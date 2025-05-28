export type Player = {
  name: string;
  team: number;
  favors: number;
  insurance: number;
};

export type Pawn = {
  square: number;
  favors: number;
  player: string;
  team: number;
};
