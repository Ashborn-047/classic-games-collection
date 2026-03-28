---
description: Deploy all three SpacetimeDB game modules after moving the project to a space-free path.
---

// turbo-all
1. Confirm the project root has no spaces (e.g., `E:\ClassicGames`).
2. Publish Snake Arena:
   `cd server/snake-arena && spacetime publish -s local snake-arena`
3. Publish Ludo Pro:
   `cd ../ludo-pro && spacetime publish -s local ludo-pro`
4. Publish Snakes & Ladders:
   `cd ../snakes-and-ladders && spacetime publish -s local snakes-and-ladders`
5. Verify the deployment:
   `spacetime list -s local`
