/**
 * Snake Arena Rendering Worker
 * Runs on a separate thread to maintain 60FPS despite React reconciliation.
 */

let canvas: OffscreenCanvas | null = null;
let ctx: OffscreenCanvasRenderingContext2D | null = null;

self.onmessage = (e: MessageEvent) => {
  const { type, payload } = e.data;

  if (type === 'INIT') {
    canvas = payload.canvas;
    ctx = canvas!.getContext('2d') as OffscreenCanvasRenderingContext2D;
  }

  if (type === 'RENDER') {
    render(payload);
  }
};

interface RenderPayload {
  snakes: Record<string, any>;
  food: any[];
  gridSize: number;
}

function render({ snakes, food, gridSize }: RenderPayload) {
  if (!ctx || !canvas) return;

  const cellSize = canvas.width / gridSize;

  // 1. Clear Canvas
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Draw Food
  food.forEach(f => {
    ctx.fillStyle = f.type === 'SPECIAL' ? '#ffd700' : '#ff2a2a';
    ctx.shadowBlur = 10;
    ctx.shadowColor = ctx.fillStyle;
    ctx.fillRect(f.x * cellSize + 2, f.y * cellSize + 2, cellSize - 4, cellSize - 4);
  });

  // 3. Draw Snakes
  Object.values(snakes).forEach((snake: any) => {
    ctx.fillStyle = snake.color || '#00ff00';
    ctx.shadowBlur = 5;
    ctx.shadowColor = ctx.fillStyle;
    
    snake.segments.forEach((seg: any, i: number) => {
      // Head has slightly different color/look
      if (i === 0) {
        ctx.globalAlpha = 1.0;
        ctx.fillRect(seg.x * cellSize, seg.y * cellSize, cellSize, cellSize);
      } else {
        ctx.globalAlpha = 0.8;
        ctx.fillRect(seg.x * cellSize + 1, seg.y * cellSize + 1, cellSize - 2, cellSize - 2);
      }
    });
  });
  
  ctx.globalAlpha = 1.0;
  ctx.shadowBlur = 0;
}
