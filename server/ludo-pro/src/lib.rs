use spacetimedb::{spacetimedb, ReducerContext, Identity};

#[spacetimedb(table)]
pub struct LudoRoom {
    #[primarykey]
    pub code: String,
    pub host: Identity,
    pub status: String,
    pub turn_index: u8,
}

#[spacetimedb(table)]
pub struct LudoPlayer {
    #[primarykey]
    pub identity: Identity,
    pub room_code: String,
    pub color: String, // RED, BLUE, GREEN, YELLOW
    pub tokens: Vec<i8>, // -1: Base, 0-51: Perimeter, 57: Finished
}

#[spacetimedb(reducer)]
pub fn move_token(ctx: ReducerContext, code: String, token_id: usize, dice: u8) -> Result<(), String> {
    let mut room = LudoRoom::filter_by_code(&code).ok_or("Room not found")?;
    let mut player = LudoPlayer::filter_by_identity(&ctx.sender).ok_or("Player not found")?;

    let old_pos = player.tokens[token_id];
    let mut new_pos = old_pos;

    // Movement Logic
    if old_pos == -1 {
        if dice == 6 { new_pos = 0; } // Enter Perimeter
    } else {
        new_pos = old_pos + dice as i8;
    }

    // Capture Check
    if new_pos < 52 && !is_safe_spot(new_pos) {
        check_and_capture(&code, &ctx.sender, new_pos);
    }

    player.tokens[token_id] = new_pos;
    LudoPlayer::update_by_identity(&ctx.sender, player);

    // Next turn
    room.turn_index = (room.turn_index + 1) % 4; // Assuming 4 players
    LudoRoom::update_by_code(&code, room);

    Ok(())
}

fn is_safe_spot(pos: i8) -> bool {
    matches!(pos, 0 | 8 | 13 | 21 | 26 | 34 | 39 | 47)
}

fn check_and_capture(room_code: &str, attacker: &Identity, pos: i8) {
    let players = LudoPlayer::filter_by_room_code(room_code);
    for mut p in players {
        if p.identity == *attacker { continue; }
        for t in p.tokens.iter_mut() {
            if *t == pos {
                *t = -1; // Send back to base
            }
        }
        LudoPlayer::update_by_identity(&p.identity, p);
    }
}
