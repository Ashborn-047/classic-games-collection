use spacetimedb::{table, reducer, ReducerContext, Table, Identity};

#[table(accessor = snl_room, public)]
pub struct SnLRoom {
    #[primary_key]
    pub code: String,
    pub host: Identity,
    pub status: String,
    pub turn_index: u32,
    pub last_die_roll: u8,
}

#[table(accessor = snl_player, public)]
pub struct SnLPlayer {
    #[primary_key]
    pub identity: Identity,
    pub room_code: String,
    pub name: String,
    pub position: u8, // 1-100
    pub color: String,
}

#[reducer]
pub fn roll_die(ctx: &ReducerContext, code: String) -> Result<(), String> {
    let room = ctx.db.snl_room().code().find(&code).ok_or("Room not found")?;
    let players: Vec<_> = ctx.db.snl_player().iter().filter(|p| p.room_code == code).collect();
    
    if players[room.turn_index as usize].identity != ctx.sender() {
        return Err("Not your turn".into());
    }

    // Use timestamp for pseudo-randomness in WASM
    let roll = (ctx.timestamp.to_micros_since_unix_epoch() % 6 + 1) as u8;
    
    let mut room = room;
    room.last_die_roll = roll;

    let mut player = ctx.db.snl_player().identity().find(&ctx.sender()).unwrap();
    let old_pos = player.position;
    let mut new_pos = old_pos + roll;

    if new_pos > 100 {
        new_pos = old_pos; // Must land exactly on 100
    }

    // Apply Snakes & Ladders logic
    new_pos = apply_board_rules(new_pos);

    player.position = new_pos;
    ctx.db.snl_player().identity().update(player);

    // Next turn
    room.turn_index = (room.turn_index + 1) % players.len() as u32;
    ctx.db.snl_room().code().update(room);

    Ok(())
}

fn apply_board_rules(pos: u8) -> u8 {
    match pos {
        // Ladders
        2 => 38,
        7 => 14,
        8 => 31,
        15 => 26,
        // Snakes
        16 => 6,
        46 => 25,
        49 => 11,
        _ => pos,
    }
}
