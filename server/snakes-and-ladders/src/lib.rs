use spacetimedb::{spacetimedb, ReducerContext, Identity};

#[spacetimedb(table)]
pub struct SnLRoom {
    #[primarykey]
    pub code: String,
    pub host: Identity,
    pub status: String,
    pub turn_index: u32,
    pub last_die_roll: u8,
}

#[spacetimedb(table)]
pub struct SnLPlayer {
    #[primarykey]
    pub identity: Identity,
    pub room_code: String,
    pub name: String,
    pub position: u8, // 1-100
    pub color: String,
}

#[spacetimedb(reducer)]
pub fn roll_die(ctx: ReducerContext, code: String) -> Result<(), String> {
    let mut room = SnLRoom::filter_by_code(&code).ok_or("Room not found")?;
    let players = SnLPlayer::filter_by_room_code(&code);
    
    if players[room.turn_index as usize].identity != ctx.sender {
        return Err("Not your turn".into());
    }

    use rand::Rng;
    let roll = rand::thread_rng().gen_range(1..=6);
    room.last_die_roll = roll;

    let mut player = SnLPlayer::filter_by_identity(&ctx.sender).unwrap();
    let old_pos = player.position;
    let mut new_pos = old_pos + roll;

    if new_pos > 100 {
        new_pos = old_pos; // Must land exactly on 100
    }

    // Apply Snakes & Ladders logic
    new_pos = apply_board_rules(new_pos);

    player.position = new_pos;
    SnLPlayer::update_by_identity(&ctx.sender, player);

    // Next turn
    room.turn_index = (room.turn_index + 1) % players.len() as u32;
    SnLRoom::update_by_code(&code, room);

    Ok(())
}

fn apply_board_rules(pos: u8) -> u8 {
    let mut rules = std::collections::HashMap::new();
    // Ladders
    rules.insert(2, 38);
    rules.insert(7, 14);
    rules.insert(8, 31);
    rules.insert(15, 26);
    // Snakes
    rules.insert(16, 6);
    rules.insert(46, 25);
    rules.insert(49, 11);
    // ... add more ...
    *rules.get(&pos).unwrap_or(&pos)
}
