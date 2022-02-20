const config = {
  type: Phaser.AUTO,
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH,
    mode: Phaser.Scale.RESIZE
  },
  render: {
    pixelArt: true
  },
  backgroundColor: 0xffffff,
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 1500
      },
      enableBody: true,
      // debug: true
    }
  },
  scene: [Cutscene1, Cutscene2, Cutscene3, Cutscene4, Round1, Round2, Round3, Round4, Win, GameOver]
};
const phaserGame = new Phaser.Game(config);
