export const WAKE_COUNT = 12;

type Bounds = { left: number; top: number; width: number; height: number };

export function liquidPoint(clientX: number, clientY: number, rect: Bounds) {
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  if (rect.width <= 0 || rect.height <= 0 || x < 0 || y < 0 || x > rect.width || y > rect.height)
    return null;
  return { x: ((x - rect.width / 2) / rect.height) * 3.3, y: (0.5 - y / rect.height) * 3.3 };
}

// Queue movement once; the GPU heightfield owns propagation and decay afterwards.
export class LiquidWake {
  readonly segments = new Float32Array(WAKE_COUNT * 4);
  private previous: { x: number; y: number; time: number } | null = null;
  private count = 0;

  move(x: number, y: number, time: number) {
    const previous = this.previous;
    if (!previous || time - previous.time > 150) {
      this.previous = { x, y, time };
      return;
    }
    if (time - previous.time < 16) return;
    const dx = x - previous.x;
    const dy = y - previous.y;
    this.previous = { x, y, time };
    const distance = Math.hypot(dx, dy);
    if (distance < 0.002 || distance > 0.8) return;
    if (this.count === WAKE_COUNT) {
      this.segments.copyWithin(0, 4);
      this.count--;
    }
    this.segments.set([previous.x, previous.y, dx, dy], this.count++ * 4);
  }

  consume() {
    const count = this.count;
    this.count = 0;
    return count;
  }

  leave() {
    this.previous = null;
  }

  clear() {
    this.leave();
    this.segments.fill(0);
    this.count = 0;
  }
}
