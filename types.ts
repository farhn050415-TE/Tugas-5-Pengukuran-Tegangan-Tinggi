export enum AppView {
  HOME = 'HOME',
  MATERIAL = 'MATERIAL',
  SIMULATOR = 'SIMULATOR',
  QUIZ = 'QUIZ',
}

export enum SimulatorMode {
  SPHERE_GAP = 'SPHERE_GAP',
  RESISTIVE_DIVIDER = 'RESISTIVE_DIVIDER',
  CAPACITIVE_DIVIDER = 'CAPACITIVE_DIVIDER',
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option
  explanation: string;
}

export interface SimulationDataPoint {
  x: number;
  y: number;
}