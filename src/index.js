import Phaser from 'phaser';

import MenuScene from './scenes/MenuScene';
import PauseScene from './scenes/PauseScene';
import PlayScene from './scenes/PlayScene';
import PreloadScene from './scenes/PreloadScene';
import ScoreScene from './scenes/ScoreScene';

const SHARED_CONFIG = {
  width: window.innerWidth,
  height: window.innerHeight,
  birdPosition: {
    x: 80,
    y: 300
  },
  flapVelocity: 300,
  pipesToRender: 8
}

const Scenes = [
  PreloadScene,
  MenuScene,
  ScoreScene,
  PlayScene,
  PauseScene
];

const initScenes = () => Scenes.map((Scene) => new Scene(SHARED_CONFIG));

const config = {
  type: Phaser.AUTO,
  pixelArt: true,
  physics: {
    // 'arcade' physics engine, manages physics
    default: 'arcade',
    arcade: {
      debug: false
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: initScenes(),
  ...SHARED_CONFIG,
};

new Phaser.Game(config);