use spacetimedb::{spacetimedb, Identity, ReducerContext, Timestamp};

/// =============================================
/// SNAKE ARENA — SpacetimeDB Backend
/// =============================================

// --- Constants ---
const GRID_SIZE: i32 = 20;
const INITIAL_LENGTH: i32 = 3;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum Direction {
    Up,
    Down,
    Left,
    Right,
}

impl Direction {
    pub fn opposite(&self) -> Self {
        match self {
            Direction::Up => Direction::Down,
            Direction::Down => Direction::Up,
            Direction::Left => Direction::Right,
            Direction::Right => Direction::Left,
        }
    }

    pub fn delta(&self) -> (i32, i32) {
        match self {
            Direction::Up => (0, -1),
            Direction::Down => (0, 1),
            Direction::Left => (-1, 0),
            Direction::Right => (1, 0),
        }
    }
}

// --- Tables ---

#[spacetimedb(table)]
pub struct SnakeRoom {
    #[primarykey]
    pub code: String,
    pub host_id: Identity,
    pub is_started: bool,
    pub grid_size: u32,
    pub tick_rate_ms: u32,
    pub winner: Option<String>, // "p1", "p2", "draw"
}

#[spacetimedb(table)]
pub struct SnakePlayer {
    #[primarykey]
    pub id: u64,
    pub identity: Identity,
    pub room_code: String,
    pub name: String,
    pub color: String,
    pub direction: String,     // "Up", "Down", "Left", "Right"
    pub segments_json: String, // JSON array of {x, y} — serialized for simplicity
    pub is_alive: bool,
    pub score: u32,
    pub has_shield: bool,
    pub player_slot: u32,      // 1 or 2
}

#[spacetimedb(table)]
pub struct SnakeFood {
    #[primarykey]
    #[autoinc]
    pub id: u64,
    pub room_code: String,
    pub x: u32,
    pub y: u32,
    pub food_type: String, // "normal", "bonus", "speed", "shield"
}

#[spacetimedb(table)]
pub struct SnakeLog {
    #[primarykey]
    #[autoinc]
    pub id: u64,
    pub room_code: String,
    pub text: String,
    pub timestamp: u64,
}

// --- Helpers ---

fn add_log(room_code: &str, text: &str, ts: Timestamp) {
    SnakeLog::insert(SnakeLog {
        id: 0,
        room_code: room_code.to_string(),
        text: text.to_string(),
        timestamp: ts.unix_timestamp() as u64,
    });
}

fn spawn_food_position(room_code: &str, ts: Timestamp) -> (u32, u32) {
    // Simple pseudo-random based on timestamp
    let millis = ts.unix_timestamp() as u32;
    let x = (millis * 7 + 13) % (GRID_SIZE as u32);
    let y = (millis * 11 + 17) % (GRID_SIZE as u32);
    (x, y)
}

fn determine_food_type(ts: Timestamp) -> String {
    let val = (ts.unix_timestamp() % 100) as u32;
    if val > 92 { "shield".to_string() }
    else if val > 85 { "speed".to_string() }
    else if val > 75 { "bonus".to_string() }
    else { "normal".to_string() }
}

// --- Reducers ---

#[spacetimedb(reducer)]
pub fn create_room(ctx: ReducerContext, code: String, name: String, color: String) -> Result<(), String> {
    if SnakeRoom::filter_by_code(&code).is_some() {
        return Err("Room code already exists".to_string());
    }

    SnakeRoom::insert(SnakeRoom {
        code: code.clone(),
        host_id: ctx.sender,
        is_started: false,
        grid_size: GRID_SIZE as u32,
        tick_rate_ms: 140,
        winner: None,
    });

    // Create initial snake segments for player 1 (top-left area)
    let segments: Vec<(u32, u32)> = (0..INITIAL_LENGTH as u32).map(|i| (3 - i, (GRID_SIZE / 2) as u32)).collect();
    let segments_json = serde_json::to_string(&segments).unwrap_or("[]".to_string());

    SnakePlayer::insert(SnakePlayer {
        id: ctx.timestamp.unix_timestamp() as u64,
        identity: ctx.sender,
        room_code: code.clone(),
        name: name.clone(),
        color,
        direction: "Right".to_string(),
        segments_json,
        is_alive: true,
        score: 0,
        has_shield: false,
        player_slot: 1,
    });

    // Spawn initial food
    let (fx, fy) = spawn_food_position(&code, ctx.timestamp);
    SnakeFood::insert(SnakeFood {
        id: 0,
        room_code: code.clone(),
        x: fx, y: fy,
        food_type: "normal".to_string(),
    });

    add_log(&code, &format!("{} created the arena.", name), ctx.timestamp);
    Ok(())
}

#[spacetimedb(reducer)]
pub fn join_room(ctx: ReducerContext, code: String, name: String, color: String) -> Result<(), String> {
    let room = SnakeRoom::filter_by_code(&code).ok_or("Room not found")?;
    if room.is_started {
        return Err("Arena already started".to_string());
    }

    let player_count = SnakePlayer::iter().filter(|p| p.room_code == code).count();
    if player_count >= 2 {
        return Err("Arena is full (2 players max)".to_string());
    }

    // Create initial snake for player 2 (bottom-right area)
    let start_x = (GRID_SIZE - 4) as u32;
    let segments: Vec<(u32, u32)> = (0..INITIAL_LENGTH as u32).map(|i| (start_x + i, (GRID_SIZE / 2) as u32)).collect();
    let segments_json = serde_json::to_string(&segments).unwrap_or("[]".to_string());

    SnakePlayer::insert(SnakePlayer {
        id: ctx.timestamp.unix_timestamp() as u64 + 1,
        identity: ctx.sender,
        room_code: code.clone(),
        name: name.clone(),
        color,
        direction: "Left".to_string(),
        segments_json,
        is_alive: true,
        score: 0,
        has_shield: false,
        player_slot: 2,
    });

    add_log(&code, &format!("{} joined the arena.", name), ctx.timestamp);
    Ok(())
}

#[spacetimedb(reducer)]
pub fn start_game(ctx: ReducerContext, code: String) -> Result<(), String> {
    let mut room = SnakeRoom::filter_by_code(&code).ok_or("Room not found")?;
    if room.host_id != ctx.sender {
        return Err("Only the host can start".to_string());
    }
    room.is_started = true;
    SnakeRoom::update_by_code(&code, room);
    add_log(&code, "🏁 Arena started! Fight!", ctx.timestamp);
    Ok(())
}

#[spacetimedb(reducer)]
pub fn set_direction(ctx: ReducerContext, code: String, direction: String) -> Result<(), String> {
    let mut player = SnakePlayer::iter()
        .find(|p| p.room_code == code && p.identity == ctx.sender)
        .ok_or("Player not found in this room")?;

    // Prevent 180-degree turns
    let current = &player.direction;
    let requested = &direction;
    let is_opposite = matches!(
        (current.as_str(), requested.as_str()),
        ("Up", "Down") | ("Down", "Up") | ("Left", "Right") | ("Right", "Left")
    );

    if !is_opposite {
        player.direction = direction;
        SnakePlayer::update_by_id(&player.id, player);
    }

    Ok(())
}

#[spacetimedb(reducer)]
pub fn leave_room(ctx: ReducerContext, code: String) -> Result<(), String> {
    // Remove the player
    if let Some(player) = SnakePlayer::iter().find(|p| p.room_code == code && p.identity == ctx.sender) {
        SnakePlayer::delete_by_id(&player.id);
        add_log(&code, &format!("{} left the arena.", player.name), ctx.timestamp);
    }

    // If room is empty, remove room
    let remaining = SnakePlayer::iter().filter(|p| p.room_code == code).count();
    if remaining == 0 {
        SnakeRoom::delete_by_code(&code);
    }

    Ok(())
}
