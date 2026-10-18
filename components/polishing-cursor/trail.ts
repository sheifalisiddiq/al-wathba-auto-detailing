type Point = { x: number; y: number; t: number };
type Spark = { x: number; y: number; vx: number; vy: number; t: number; size: number };

const LIFE = 520; // ms a trail segment stays visible
const MAX_POINTS = 48;
const MAX_SPARKS = 22;
const MIN_STEP = 2.5; // px of travel before another point is recorded

/** Canvas 2D polish trail: a glossy gold swath that tapers and fades like fresh, buffed paint. */
export class PolishTrail {
  private ctx: CanvasRenderingContext2D;
  private points: Point[] = [];
  private sparks: Spark[] = [];
  private dpr = 1;
  private dirty = false;

  constructor(private canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("2d canvas unavailable");
    this.ctx = ctx;
    this.resize();
  }

  resize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(window.innerWidth * this.dpr);
    this.canvas.height = Math.round(window.innerHeight * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  /** Records the pad position. `intensity` of 0 pauses new trail (hover on links). */
  add(x: number, y: number, now: number, intensity: number) {
    if (intensity <= 0.01) return;
    const last = this.points[this.points.length - 1];
    if (last && Math.hypot(x - last.x, y - last.y) < MIN_STEP) return;
    this.points.push({ x, y, t: now });
    if (this.points.length > MAX_POINTS) this.points.shift();
    if (intensity > 1 && this.sparks.length < MAX_SPARKS && Math.random() < 0.35) {
      this.sparks.push({
        x: x + (Math.random() - 0.5) * 18,
        y: y + (Math.random() - 0.5) * 12,
        vx: (Math.random() - 0.5) * 0.02,
        vy: -0.012 - Math.random() * 0.02,
        t: now,
        size: 0.8 + Math.random() * 1.2,
      });
    }
  }

  clear() {
    this.points.length = 0;
    this.sparks.length = 0;
    this.wipe();
  }

  draw(now: number, intensity: number) {
    const { ctx, points } = this;
    while (points.length && now - points[0].t > LIFE) points.shift();
    while (this.sparks.length && now - this.sparks[0].t > LIFE) this.sparks.shift();
    if (!points.length && !this.sparks.length) {
      this.wipe();
      return;
    }
    this.wipe();
    this.dirty = true;
    const strength = Math.min(intensity, 1.6);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1];
      const b = points[i];
      const age = Math.min((now - b.t) / LIFE, 1);
      const fade = (1 - age) * (1 - age);
      const shimmer = 0.88 + 0.12 * Math.sin(now / 70 + i * 1.7);
      const alpha = Math.min(fade * shimmer * 0.7 * strength, 0.85);
      const width = (7 + 20 * fade) * (0.7 + 0.3 * Math.min(strength, 1));

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = `rgba(200,163,101,${alpha * 0.55})`;
      ctx.lineWidth = width;
      ctx.stroke();

      ctx.strokeStyle = `rgba(229,209,166,${alpha})`;
      ctx.lineWidth = width * 0.5;
      ctx.stroke();

      ctx.strokeStyle = `rgba(255,248,228,${alpha * 0.8})`;
      ctx.lineWidth = Math.max(width * 0.14, 0.8);
      ctx.stroke();
    }

    for (const spark of this.sparks) {
      const age = (now - spark.t) / LIFE;
      const twinkle = 0.5 + 0.5 * Math.sin(now / 40 + spark.x);
      ctx.fillStyle = `rgba(245,230,190,${(1 - age) * 0.8 * twinkle})`;
      ctx.beginPath();
      ctx.arc(spark.x + spark.vx * (now - spark.t), spark.y + spark.vy * (now - spark.t), spark.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private wipe() {
    if (!this.dirty) return;
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.dirty = false;
  }
}
