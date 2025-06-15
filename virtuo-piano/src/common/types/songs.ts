export type DifficultyRange = {
  min: number;
  max: number;
  label: string;
  className: string;
};

export type SongTypeRange = {
  type: string;
  label: string;
};

export type Note = {
  note: string;
  durationInBeats: number;
  startBeat: number;
  finger: number;
  hand: string;
};
