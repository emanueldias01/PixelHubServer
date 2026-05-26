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