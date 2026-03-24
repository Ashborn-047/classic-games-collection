use spacetimedb::{spacetimedb, ReducerContext, Identity, Timestamp, ScheduleAt};
use std::collections::HashMap;

#[spacetimedb(table)]
pub struct SnakeRoom {
    #[primarykey]
    pub code: String,
    pub host: Identity,
    pub status: String, // "LOBBY", "PLAYING", "FINISHED"
    pub grid_size: u8,
    pub tick_rate_ms: u32,
    pub winner_id: Option<Identity>,
}

#[spacetimedb(table)]
pub struct SnakePlayer {
    #[primarykey]
    pub identity: Identity,
    pub room_code: String,
    pub name: String,
    pub color: String,
    pub segments: Vec<Point>,
    pub direction: String, // "UP", "DOWN", "LEFT", "RIGHT"
    pub is_alive: bool,
    pub score: u32,
}

#[spacetimedb(table)]
pub struct Food {
    #[primarykey]
    pub id: u64,
    pub room_code: String,
    pub x: u8,
    pub y: u8,
    pub food_type: String,
}

#[derive(spacetimedb::SpacetimeType, Clone, Copy)]
pub struct Point {
    pub x: u8,
    pub y: u8,
}

#[spacetimedb(reducer)]
pub fn create_room(ctx: ReducerContext, code: String, grid_size: u8, tick_rate_ms: u32) -> Result<(), String> {
    SnakeRoom::insert(SnakeRoom {
        code,
        host: ctx.sender,
        status: "LOBBY".to_string(),
        grid_size,
        tick_rate_ms,
        winner_id: None,
    }).map_err(|e| e.to_string())?;
    Ok(())
}

#[spacetimedb(reducer)]
pub fn start_game(ctx: ReducerContext, code: String) -> Result<(), String> {
    let room = SnakeRoom::filter_by_code(&code).ok_or("Room not found")?;
    if room.host != ctx.sender {
        return Err("Only host can start".into());
    }

    let mut room = room;
    room.status = "PLAYING".to_string();
    SnakeRoom::update_by_code(&code, room);

    // Schedule the first tick
    ScheduleAt::Interval(Timestamp::now() + room.tick_rate_ms.into(), room.tick_rate_ms.into(), move |ctx| {
        tick(ctx, code.clone()).unwrap();
    });

    Ok(())
}

#[spacetimedb(reducer)]
pub fn set_direction(ctx: ReducerContext, direction: String) -> Result<(), String> {
    let mut player = SnakePlayer::filter_by_identity(&ctx.sender).ok_or("Player not found")?;
    
    // Server-side validation: No 180-degree turns
    let is_valid = match (player.direction.as_str(), direction.as_str()) {
        ("UP", "DOWN") | ("DOWN", "UP") | ("LEFT", "RIGHT") | ("RIGHT", "LEFT") => false,
        _ => true,
    };

    if is_valid {
        player.direction = direction;
        SnakePlayer::update_by_identity(&ctx.sender, player);
    }

    Ok(())
}

fn tick(ctx: ReducerContext, code: String) -> Result<(), String> {
    let room = SnakeRoom::filter_by_code(&code).ok_or("Room not found")?;
    if room.status != "PLAYING" { return Ok(()); }

    let players = SnakePlayer::filter_by_room_code(&code);
    let mut updated_players = Vec::new();

    for mut player in players {
        if !player.is_alive { continue; }

        let head = player.segments[0];
        let mut new_head = match player.direction.as_str() {
            "UP" => Point { x: head.x, y: head.y.wrapping_sub(1) },
            "DOWN" => Point { x: head.x, y: head.y.wrapping_add(1) },
            "LEFT" => Point { x: head.x.wrapping_sub(1), y: head.y },
            "RIGHT" => Point { x: head.x.wrapping_add(1), y: head.y },
            _ => head,
        };

        // Screen wrap (or wall collision)
        if new_head.x >= room.grid_size { new_head.x = 0; }
        if new_head.y >= room.grid_size { new_head.y = 0; }

        // Collision Check: Self
        if player.segments.iter().any(|p| p.x == new_head.x && p.y == new_head.y) {
            player.is_alive = false;
        }

        // Collision Check: Food
        let mut ate_food = false;
        if let Some(food) = Food::filter_by_room_code(&code).find(|f| f.x == new_head.x && f.y == new_head.y) {
            ate_food = true;
            player.score += 10;
            Food::delete_by_id(&food.id);
            spawn_food(&code, room.grid_size); // Spawn new food
        }

        player.segments.insert(0, new_head);
        if !ate_food {
            player.segments.pop();
        }

        updated_players.push(player);
    }

    // Update all players
    for p in updated_players {
        SnakePlayer::update_by_identity(&p.identity, p);
    }

    Ok(())
}

fn spawn_food(code: &str, grid_size: u8) {
    use rand::Rng;
    let mut rng = rand::thread_rng();
    Food::insert(Food {
        id: rng.gen(),
        room_code: code.to_string(),
        x: rng.gen_range(0..grid_size),
        y: rng.gen_range(0..grid_size),
        food_type: "NORMAL".to_string(),
    }).unwrap();
}
