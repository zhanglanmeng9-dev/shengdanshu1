
export enum TreeMorphState {
  SCATTERED = 'SCATTERED',
  TREE_SHAPE = 'TREE_SHAPE'
}

export interface ParticleData {
  scatterPos: [number, number, number];
  treePos: [number, number, number];
  size: number;
  phase: number;
}

export interface OrnamentData {
  id: number;
  type: 'gift' | 'ball' | 'star';
  scatterPos: [number, number, number];
  treePos: [number, number, number];
  scatterRot: [number, number, number];
  treeRot: [number, number, number];
  scale: number;
  weight: number; // For physics-like movement
}
