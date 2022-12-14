import BaseScene from './BaseScene';

class MenuScene extends BaseScene {
    constructor(config) {
        super('MenuScene', config);

        this.menu = [
            {
                scene: 'PlayScene',
                label: 'Play'
            },
            {
                scene: 'ScoreScene',
                label: 'High Score'
            },
            {
                scene: null,
                label: 'Exit'
            }
        ];
    }

    create() {
        super.create();

        this.createMenu(this.menu, this.setupMenuEvents.bind(this));
        this.handleInputs();
    }

    setupMenuEvents(menuItem) {
        const { scene, textObject } = menuItem;

        textObject.setInteractive();

        textObject.on('pointerover', () => {
            textObject.setStyle({ fill: '#ff0' });
        });

        textObject.on('pointerout', () => {
            textObject.setStyle({ fill: '#fff' });
        });

        textObject.on('pointerup', () => {
            if (scene) {
                this.scene.start(scene);
            } else {
                this.game.destroy(true);
            }
        });
    }

    handleInputs() {
        this.input.keyboard.on('keydown', (event) => {
            if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.P) {
                this.scene.start('PlayScene');
            } else if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.H) {
                this.scene.start('ScoreScene');
            } else if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.E) {
                this.game.destroy(true);
            }
        });
    }
}

export default MenuScene;