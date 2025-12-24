
import { CONFIG } from './constants';

export const generateTreePosition = (index: number, total: number) => {
  // Distribute points in a cone
  const y = Math.random() * CONFIG.TREE_HEIGHT;
  const normalizedY = y / CONFIG.TREE_HEIGHT;
  const currentRadius = CONFIG.TREE_RADIUS * (1 - normalizedY);
  const angle = Math.random() * Math.PI * 2;
  
  // Add some internal volume
  const r = Math.sqrt(Math.random()) * currentRadius;
  
  const x = Math.cos(angle) * r;
  const z = Math.sin(angle) * r;
  
  return [x, y - CONFIG.TREE_HEIGHT / 2, z] as [number, number, number];
};

export const generateScatterPosition = () => {
  const r = Math.random() * CONFIG.SCATTER_RADIUS;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  
  const x = r * Math.sin(phi) * Math.cos(theta);
  const y = r * Math.sin(phi) * Math.sin(theta);
  const z = r * Math.cos(phi);
  
  return [x, y, z] as [number, number, number];
};

export const getRandomRotation = () => {
  return [
    Math.random() * Math.PI * 2,
    Math.random() * Math.PI * 2,
    Math.random() * Math.PI * 2
  ] as [number, number, number];
};
