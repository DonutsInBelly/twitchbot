export type PointModel = {
  usersWithPoints: UserPoints[];
};

export type UserPoints = {
  user: string;
  points: number;
};
