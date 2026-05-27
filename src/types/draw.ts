export interface Point {
  x: number;
  y: number;
}

export interface DrawMessage {
  type: "draw";
  user: string;
  start: Point;
  end: Point;
  color: string;
  lineWidth: number;
}

export interface BucketMessage {
  type: "bucket";
  user: string;
  start: Point;
  color: string;
}

export type Color = string;

export interface Board {
  width: number;
  height: number;
  art: Color[][];
  usernames: string[][];
}