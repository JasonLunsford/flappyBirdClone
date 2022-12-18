import BaseScene from './BaseScene';

class PlayScene extends BaseScene {
    constructor(config) {
        super('PlayScene', config); // provide unique key for your scene, can be anything

        this.birdPosition = config.birdPosition;

        this.bird = null;
        this.pipes = null;

        this.score = 0;
        this.scoreText = '';
        this.highScoreText = '';

        this.isPaused = false;

        this.pipeGapSpread = [150, 250];

        this.currentDifficulty = 'easy';
        this.difficulties = {
            'easy': {
                pipeGapSpread: [150, 250],
                pipeSpeed: -200
            },
            'normal': {
                pipeGapSpread: [140, 190],
                pipeSpeed: -300
            },
            'hard': {
                pipeGapSpread: [120, 170],
                pipeSpeed: -400
            }
        }
    }

    create() {
        this.currentDifficulty = 'easy';
        super.create();
        this.createBird();
        this.createAnimation();
        this.createPipes();
        this.createColliders();
        this.createScore();
        this.createPause();
        this.handleInputs();
        this.myEventListener();
    }

    // called 60 frames per second, or 60fps
    // 16.5 * 60 ~ 1000ms, or 1 second
    update() {
        this.checkForGameOver();

        this.recyclePipes();
    }

    createBird() {
        this.bird = this.physics.add.sprite(this.birdPosition.x, this.birdPosition.y, 'bird')
            .setFlipX(true)
            .setOrigin(0)
            .setScale(3);

        this.bird.setBodySize(this.bird.width, this.bird.height - 8);
        this.bird.body.gravity.y = 600;
        this.bird.setCollideWorldBounds(true);
    }

    createAnimation() {
        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('bird', {
                start: 8,
                end: 15
            }),
            frameRate: 16, // 8 frames for fly animation, so 8/second
            repeat: -1 // -1 = infinitely
        });

        this.bird.play('fly');
    }

    createPipes() {
        const difficulty = this.difficulties[this.currentDifficulty];
        this.pipes = this.physics.add.group();

        for (let i = 0; i < this.config.pipesToRender; i++) {
            const topPipe = this.pipes.create(0, 0, 'pipe')
                .setImmovable(true)
                .setOrigin(0, 1);
            const bottomPipe = this.pipes.create(0, 0, 'pipe')
                .setImmovable(true)
                .setOrigin(0, 0);

            this.placePipe(topPipe, bottomPipe);
        }

        this.pipes.setVelocityX(difficulty.pipeSpeed);
    }

    createColliders() {
        this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
    }

    createScore() {
        this.score = 0;
        this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, {fontSize: '32px', fill: '#000'});
        this.highScoreText = this.add.text(16, 52, `High Score: ${this.highScore}`, { fontSize: '16px', fill: '#000' });
    }

    createPause() {
        this.isPaused = false;
        const { width, height } = this.config;

        const pauseButton = this.add.image(width - 10, height - 10, 'pause')
            .setOrigin(1)
            .setScale(3)
            .setInteractive();

        pauseButton.on('pointerdown', () => {
            this.isPaused = true;
            this.physics.pause();
            this.scene.pause();
            this.scene.launch('PauseScene');
        });
    }

    handleInputs() {
        // pass "this" as a third argument to provide context for
        // this.flap
        this.input.on('pointerdown', this.flap, this);

        this.input.keyboard.on('keydown', (event) => {
            if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.SPACE) {
                this.flap();
            } else if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.P) {
                this.physics.pause();
                this.scene.pause();
                this.scene.launch('PauseScene');
            }
        });
    }

    myEventListener() {
        if (this.pauseEvent) return;

        // always assign listener to a variable so it is not "re-mounted" every
        // time the main create() method is fired.
        this.pauseEvent = this.events.on('resume', () => {
            this.initTime = 3;
            this.countDownText = this.add.text(...this.screenCenter, `Restart in: ${this.initTime}`, this.menuStyle)
                .setOrigin(0.5, 1);

            this.timedEvent = this.time.addEvent({
                delay: 1000,
                callback: this.countDown,
                callbackScope: this,
                loop: true
            });
        }, this); // critically important to add the "this" context as third param
    }

    countDown() {
        this.initTime--;
        this.countDownText.setText(`Restart in: ${this.initTime}`);

        if (this.initTime <= 0) {
            this.countDownText.setText('');
            this.physics.resume();
            this.timedEvent.remove();
            this.isPaused = false;
        }
    }

    placePipe(upperPipe, lowerPipe) {
        let difficulty = this.difficulties[this.currentDifficulty];
        const pipeBaseSpread = this.getLastPipe();

        let pipeGap = Phaser.Math.Between(...difficulty.pipeGapSpread);
        let pipePosition = Phaser.Math.Between(20, this.config.height - pipeGap);
        let pipeSpread = Phaser.Math.Between(425, 475);

        upperPipe.x = pipeBaseSpread + pipeSpread;
        upperPipe.y = pipePosition;

        lowerPipe.x = upperPipe.x;
        lowerPipe.y = upperPipe.y + pipeGap;
    }

    getLastPipe() {
        let lastPipeX = 0;

        this.pipes.getChildren().forEach((pipe) => {
            lastPipeX = Math.max(pipe.x, lastPipeX);
        });

        return lastPipeX;
    }

    recyclePipes() {
        const oldPipes = [];
        this.pipes.getChildren().forEach((pipe) => {
            if (pipe.getBounds().right <= 0) {
                oldPipes.push(pipe);
            }
        });

        if (oldPipes.length) {
            this.placePipe(oldPipes[0], oldPipes[1]);
            this.increaseScore();
            this.increaseDifficulty();
        }
    }

    flap() {
        if (this.isPaused) return;

        this.bird.body.velocity.y = -this.config.flapVelocity;
    }

    checkForGameOver() {
        if (
            this.bird.getBounds().bottom >= this.config.height ||
            this.bird.y <= 0
        ) {
            this.gameOver();
        }
    }

    increaseScore() {
        this.score++;
        this.scoreText.setText(`Score: ${this.score}`);

        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.highScoreText.setText(`Best Score: ${this.highScore}`);
            window.localStorage.setItem('storedScore', this.score);
        }
    }

    increaseDifficulty() {
        let difficulty;

        if (this.score === 1) {
            this.currentDifficulty = 'easy';
        }

        if (this.score === 5) {
            this.currentDifficulty = 'normal';
        }

        if (this.score === 10) {
            this.currentDifficulty = 'hard';
        }

        difficulty = this.difficulties[this.currentDifficulty];
        this.pipes.setVelocityX(difficulty.pipeSpeed);
    }

    gameOver() {
        this.physics.pause();
        this.bird.setTint(0xee4824);
        this.bird.stop('fly');

        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.scene.restart();
            },
            loop: false
        });
    }
}

export default PlayScene;