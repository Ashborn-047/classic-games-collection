## 2024-05-15 - Missing Input Validation in Rust Reducer
**Vulnerability:** The SpacetimeDB `move_token` reducer in `ludo-pro` blindly trusted client-provided `token_id` and `dice` values without bounds checking.
**Learning:** Even with server-authoritative architecture, trusting the client's payload structure can lead to panic (DoS via `token_id` out of bounds) or cheating (arbitrary `dice` values bypassing rules).
**Prevention:** Always validate all reducer parameters from the client against game rules (e.g., `token_id < 4`, `1 <= dice <= 6`) before executing state changes or accessing arrays.
