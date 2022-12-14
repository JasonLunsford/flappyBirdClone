import BaseScene from './BaseScene';

class PauseScene extends BaseScene {
    constructor(config) {
        super('PauseScene', config);

        this.menu = [
            {
                scene: 'PlayScene',
                label: 'Continue'
            },
            {
                scene: 'MenuScene',
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
            if (menuItem.label === 'Continue') {
                this.scene.stop();
                this.scene.resume(scene);
            } else if (menuItem.label === 'Exit') {
                this.scene.stop('PlayScene');
                this.scene.start(scene);
            }
        });
    }

    handleInputs() {
        this.input.keyboard.on('keydown', (event) => {
            if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.C) {
                this.scene.stop();
                this.scene.resume('PlayScene');
            } else if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.E) {
                this.scene.stop('PlayScene');
                this.scene.start('MenuScene');
            }
        });
    }
}

export default PauseScene;