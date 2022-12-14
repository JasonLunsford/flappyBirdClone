import BaseScene from './BaseScene';

class ScoreScene extends BaseScene {
    constructor(config) {
        super('ScoreScene', config);
    }

    create() {
        super.create();

        this.createHighScoreText();
        this.createBackButton();
        this.handleInputs();
    }

    createHighScoreText() {
        this.add.text(...this.screenCenter, `High Score: ${this.highScore}`, this.menuStyle)
            .setOrigin(0.5, 1);
    }

    createBackButton() {
        const { width, height } = this.config;

        const backButton = this.add.image(width - 10, height - 10, 'back')
            .setOrigin(1)
            .setScale(2)
            .setInteractive();

        backButton.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }

    handleInputs() {
        this.input.keyboard.on('keydown', (event) => {
            if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.B) {
                this.scene.start('MenuScene');
            }
        });
    }
}

export default ScoreScene;