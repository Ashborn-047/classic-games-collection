use spacetimedb::{table, reducer, ReducerContext, Table, Identity, ScheduleAt};

#[derive(Clone)]
#[table(accessor = snake_room, public)]
pub struct SnakeRoom {
    #[primary_key]
    pub code: String,
    pub host: Identity,
    pub status: String, // "LOBBY", "PLAYING", "FINISHED"
    pub grid_size: u8,
    pub tick_rate_ms: u32,
    pub winner_id: Option<Identity>,
}

#[derive(Clone)]
#[table(accessor = snake_player, public)]
pub struct SnakePlayer {
    #[primary_key]
    pub identity: Identity,
    pub room_code: String,
    pub name: String,
    pub color: String,
    pub segments: Vec<Point>,
    pub direction: String, // "UP", "DOWN", "LEFT", "RIGHT"
    pub is_alive: bool,
    pub score: u32,
}

#[derive(Clone)]
#[table(accessor = food, public)]
pub struct Food {
    #[primary_key]
    pub id: u64,
    pub room_code: String,
    pub x: u8,
    pub y: u8,
    pub food_type: String,
}

#[derive(Clone)]
#[table(accessor = snake_tick_timer, scheduled(tick))]
pub struct SnakeTickTimer {
    #[primary_key]
    pub id: u64,
    pub room_code: String,
    pub scheduled_at: ScheduleAt,
}

#[derive(spacetimedb::SpacetimeType, Clone, Copy, serde::Deserialize, serde::Serialize)]
pub struct Point {
    pub x: u8,
    pub y: u8,
}

#[reducer]
pub fn create_room(ctx: &ReducerContext, code: String, grid_size: u8, tick_rate_ms: u32) -> Result<(), String> {
    ctx.db.snake_room().insert(SnakeRoom {
        code: code.clone(),
        host: ctx.sender(),
        status: "LOBBY".to_string(),
        grid_size,
        tick_rate_ms,
        winner_id: None,
    });
    Ok(())
}

#[reducer]
pub fn start_game(ctx: &ReducerContext, code: String) -> Result<(), String> {
    let room = ctx.db.snake_room().code().find(&code).ok_or("Room not found")?;
    if room.host != ctx.sender() {
        return Err("Only host can start".into());
    }

    let tick_rate = room.tick_rate_ms;
    let mut room = room;
    room.status = "PLAYING".to_string();
    ctx.db.snake_room().code().update(room);

    // Schedule the first tick (recurring)
    let interval = std::time::Duration::from_millis(tick_rate as u64);
    ctx.db.snake_tick_timer().insert(SnakeTickTimer {
        id: (ctx.timestamp.to_micros_since_unix_epoch() as u64 % 100000), 
        room_code: code,
        scheduled_at: interval.into(),
    });

    Ok(())
}

#[reducer]
pub fn set_direction(ctx: &ReducerContext, direction: String) -> Result<(), String> {
    let player = ctx.db.snake_player().identity().find(&ctx.sender()).ok_or("Player not found")?;
    
    // Server-side validation: No 180-degree turns
    let is_valid = match (player.direction.as_str(), direction.as_str()) {
        ("UP", "DOWN") | ("DOWN", "UP") | ("LEFT", "RIGHT") | ("RIGHT", "LEFT") => false,
        _ => true,
    };

    if is_valid {
        let mut player = player;
        player.direction = direction;
        ctx.db.snake_player().identity().update(player);
    }

    Ok(())
}

#[reducer]
pub fn tick(ctx: &ReducerContext, timer: SnakeTickTimer) -> Result<(), String> {
    let code = timer.room_code;
    let room_opt = ctx.db.snake_room().code().find(&code);
    
    if let Some(room) = room_opt {
        if room.status != "PLAYING" { 
            ctx.db.snake_tick_timer().id().delete(&timer.id);
            return Ok(()); 
        }

        let players: Vec<_> = ctx.db.snake_player().iter().filter(|p| p.room_code == code).collect();
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

            if new_head.x >= room.grid_size { new_head.x = 0; }
            if new_head.y >= room.grid_size { new_head.y = 0; }

            if player.segments.iter().any(|p| p.x == new_head.x && p.y == new_head.y) {
                player.is_alive = false;
            }

            let mut ate_food = false;
            let foods: Vec<_> = ctx.db.food().iter().filter(|f| f.room_code == code && f.x == new_head.x && f.y == new_head.y).collect();
            if let Some(food) = foods.first() {
                ate_food = true;
                player.score += 10;
                ctx.db.food().id().delete(&food.id);
                spawn_food(ctx, &code, room.grid_size);
            }

            player.segments.insert(0, new_head);
            if !ate_food {
                player.segments.pop();
            }

            updated_players.push(player);
        }

        for p in updated_players {
            ctx.db.snake_player().identity().update(p);
        }
    } else {
        // Room deleted, stop timer
        ctx.db.snake_tick_timer().id().delete(&timer.id);
    }
    Ok(())
}

fn spawn_food(ctx: &ReducerContext, code: &str, grid_size: u8) {
    let micros = ctx.timestamp.to_micros_since_unix_epoch() as u64;
    let x = (micros % grid_size as u64) as u8;
    let y = (micros / 7 % grid_size as u64) as u8;
    ctx.db.food().insert(Food {
        id: micros,
        room_code: code.to_string(),
        x,
        y,
        food_type: "NORMAL".to_string(),
    });
}
