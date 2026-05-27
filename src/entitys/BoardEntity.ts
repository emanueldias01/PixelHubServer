import type {
    Color,
    Board,
    Point,
    DrawMessage,
    BucketMessage,
} from "../types/draw.js";

export class BoardEntity implements Board {
    public width: number;
    public height: number;

    public art: Color[][] = [];
    public usernames: string[][] = [];

    constructor(width: number, height: number, defaultColor = "#ffffff", defaultUsername = "ninguem") {
        this.width = width;
        this.height = height;

        this.art = [];
        for (let y = 0; y < height; y++) {
            const row: Color[] = [];
            for (let x = 0; x < width; x++) {
            row.push(defaultColor);
            }
            this.art.push(row);
        }

        this.usernames = [];
        for (let y = 0; y < height; y++) {
            const row: Color[] = [];
            for (let x = 0; x < width; x++) {
            row.push(defaultUsername);
            }
            this.usernames.push(row);
        }
    }

    public inBounds(p: Point): boolean {
        return (p.x >= 0 && p.y >= 0 && p.x < this.width && p.y < this.height);
    }

    public getColor(p: Point): string | null {
        if (!this.inBounds(p)) return null;

        const color = this.art[p.y]?.[p.x];
        return color ?? null;
    }

    public getUsername(p: Point): string | null {
        if (!this.inBounds(p)) return null;

        const user = this.usernames[p.y]?.[p.x];
        return user ?? null;
    }

    public setPixel(p: Point, color: string, username: string): void {
        if (!this.inBounds(p)) return;

        this.art[p.y]![p.x] = color;
        this.usernames[p.y]![p.x] = username;
    }

    public applyDraw(msg: DrawMessage): void {
        const points = this.getLinePoints(msg.start, msg.end);

        const radius = Math.max(0, Math.floor(msg.lineWidth / 2));

        for (const p of points) {
            for (let dy = -radius; dy <= radius; dy++) {
                for (let dx = -radius; dx <= radius; dx++) {
                    this.setPixel({ x: p.x + dx, y: p.y + dy }, msg.color, msg.user);
                }
            }
        }
    }

    public applyBucket(msg: BucketMessage): void {
        this.floodFill(msg.start, msg.color, msg.user);
    }

    private floodFill(start: Point, newColor: string, username: string): void {
        if (!this.inBounds(start)) return;

        const targetColor = this.getColor(start);
        if (targetColor === null || targetColor === newColor) return;

        const q: Point[] = [start];

        while (q.length > 0) {
            const p = q.pop()!;
            if (!this.inBounds(p)) continue;

            const current = this.getColor(p);
            if (current !== targetColor) continue;

            this.setPixel(p, newColor, username);

            q.push(
                { x: p.x + 1, y: p.y },
                { x: p.x - 1, y: p.y },
                { x: p.x, y: p.y + 1 },
                { x: p.x, y: p.y - 1 }
            );
        }

        return 
    }

    private getLinePoints(a: Point, b: Point): Point[] {
        let x0 = Math.round(a.x);
        let y0 = Math.round(a.y);
        const x1 = Math.round(b.x);
        const y1 = Math.round(b.y);

        const points: Point[] = [];

        const dx = Math.abs(x1 - x0);
        const dy = Math.abs(y1 - y0);
        const sx = x0 < x1 ? 1 : -1;
        const sy = y0 < y1 ? 1 : -1;

        let err = dx - dy;

        while (true) {
            points.push({ x: x0, y: y0 });
            if (x0 === x1 && y0 === y1) break;

            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x0 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y0 += sy;
            }
        }

        return points;
    }

    public raw() {
        const out: Color[] = [];
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                out.push(this.art[y]![x]!);
            }
        }

        return {
            type: "board",
            width: this.width,
            height: this.height,
            art: out,
        };
    }
}
