export const WAKE_COUNT = 12;
export const WAKE_LIFETIME = 2.4;

type Bounds = { left: number; top: number; width: number; height: number };

export function liquidPoint(clientX: number, clientY: number, rect: Bounds) {
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  if (rect.width <= 0 || rect.height <= 0 || x < 0 || y < 0 || x > rect.width || y > rect.height)
    return null;
  return { x: ((x - rect.width / 2) / rect.height) * 3.3, y: (0.5 - y / rect.height) * 3.3 };
}

// A bounded trail in shader coordinates, independent of event rate and aspect ratio.
export class LiquidWake {
  readonly segments = new Float32Array(WAKE_COUNT * 4);
  readonly ages = new Float32Array(WAKE_COUNT).fill(WAKE_LIFETIME);
  private previous: { x: number; y: number; time: number } | null = null;
  private next = 0;

  move(x: number, y: number, time: number) {
    const previous = this.previous;
    if (!previous || time - previous.time > 150) {
      this.previous = { x, y, time };
      return;
    }
    if (time - previous.time < 24) return;
    const dx = x - previous.x;
    const dy = y - previous.y;
    this.previous = { x, y, time };
    const distance = Math.hypot(dx, dy);
    if (distance < 0.002 || distance > 0.8) return;
    this.segments.set([previous.x, previous.y, dx, dy], this.next * 4);
    this.ages[this.next] = 0;
    this.next = (this.next + 1) % WAKE_COUNT;
  }

  advance(dt: number) {
    for (let i = 0; i < WAKE_COUNT; i++)
      this.ages[i] = Math.min(WAKE_LIFETIME, this.ages[i] + dt);
  }

  leave() {
    this.previous = null;
  }

  clear() {
    this.leave();
    this.segments.fill(0);
    this.ages.fill(WAKE_LIFETIME);
  }
}
