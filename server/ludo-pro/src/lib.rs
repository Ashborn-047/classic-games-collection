use spacetimedb::{table, reducer, ReducerContext, Table, Identity};

#[table(accessor = ludo_room, public)]
pub struct LudoRoom {
    #[primary_key]
    pub code: String,
    pub host: Identity,
    pub status: String,
    pub turn_index: u8,
}

#[table(accessor = ludo_player, public)]
pub struct LudoPlayer {
    #[primary_key]
    pub identity: Identity,
    pub room_code: String,
    pub color: String, // RED, BLUE, GREEN, YELLOW
    pub tokens: Vec<i32>, // -1: Base, 0-51: Perimeter, 57: Finished
}

#[reducer]
pub fn move_token(ctx: &ReducerContext, code: String, token_id: u32, dice: u8) -> Result<(), String> {
    let room = ctx.db.ludo_room().code().find(&code).ok_or("Room not found")?;
    let player = ctx.db.ludo_player().identity().find(&ctx.sender()).ok_or("Player not found")?;

    let old_pos = player.tokens[token_id as usize];
    let mut new_pos: i32 = old_pos;

    // Movement Logic
    if old_pos == -1 {
        if dice == 6 { new_pos = 0; } // Enter Perimeter
    } else {
        new_pos = old_pos + dice as i32;
    }

    // Capture Check
    if new_pos < 52 && !is_safe_spot(new_pos) {
        check_and_capture(ctx, &code, &ctx.sender(), new_pos);
    }

    let mut player = player;
    player.tokens[token_id as usize] = new_pos;
    ctx.db.ludo_player().identity().update(player);

    // Next turn
    let mut room = room;
    room.turn_index = (room.turn_index + 1) % 4; // Assuming 4 players
    ctx.db.ludo_room().code().update(room);

    Ok(())
}

fn is_safe_spot(pos: i32) -> bool {
    matches!(pos, 0 | 8 | 13 | 21 | 26 | 34 | 39 | 47)
}

fn check_and_capture(ctx: &ReducerContext, room_code: &str, attacker: &Identity, pos: i32) {
    let players: Vec<_> = ctx.db.ludo_player().iter().filter(|p| p.room_code == room_code).collect();
    for mut p in players {
        if p.identity == *attacker { continue; }
        let mut affected = false;
        for t in p.tokens.iter_mut() {
            if *t == pos {
                *t = -1; // Send back to base
                affected = true;
            }
        }
        if affected {
            ctx.db.ludo_player().identity().update(p);
        }
    }
}
