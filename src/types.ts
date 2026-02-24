export enum GameState {
  START = 'START',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER',
}

export enum EnemyType {
  BASIC = 'BASIC',
  FAST = 'FAST',
  HEAVY = 'HEAVY',
}

export enum PowerUpType {
  TRIPLE_SHOT = 'TRIPLE_SHOT',
  SHIELD = 'SHIELD',
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
}

export interface Point {
  x: number;
  y: number;
}

export interface Entity extends Point {
  width: number;
  height: number;
  speed: number;
}

export interface Player extends Entity {
  lives: number;
  score: number;
  level: number;
  isInvincible: boolean;
  invincibleTimer: number;
  hasTripleShot: boolean;
  tripleShotTimer: number;
  hasShield: boolean;
}

export interface Bullet extends Point {
  speedX: number;
  speedY: number;
  damage: number;
  isPlayer: boolean;
}

export interface Enemy extends Entity {
  type: EnemyType;
  health: number;
  maxHealth: number;
  points: number;
  color: string;
  lastShot: number;
  shootInterval: number;
}

export interface PowerUp extends Entity {
  type: PowerUpType;
}

export interface Particle extends Point {
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}
