import Phaser from 'phaser';

class BaseScene extends Phaser.Scene {
    constructor(key, config) {
        super(key);

        this.config = config;
        this.screenCenter = [config.width / 2, config.height / 2];

        this.menuStyle = {
            fontSize: '32px',
            fill: '#fff'
        };

        let storedScore = window.localStorage.getItem('storedScore');
        if (storedScore) storedScore = parseInt(storedScore, 10);

        this.highScore = storedScore || 0;
    }

    create() {
        const graphics = this.add.graphics();

        graphics.fillGradientStyle(0x169ac5, 0x169ac5, 0x9addf3, 0x9addf3, 1);
        graphics.fillRect(0, 0, this.config.width, this.config.height);

    }

    createMenu(menu, setupMenuEvents) {
        let indentY = 0;

        menu.forEach((menuItem) => {
            const menuPosition = [this.screenCenter[0], this.screenCenter[1] + indentY];
            menuItem.textObject = this.add.text(...menuPosition, menuItem.label, this.menuStyle)
                .setOrigin(0.5, 1);
            setupMenuEvents(menuItem);
            indentY += 42;
        });
    }
}

export default BaseScene;