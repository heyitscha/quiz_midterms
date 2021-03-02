export default class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
    }

    //*** Load images***//
    preload() {
        this.load.image("player", "../assets/catplayer.png");
        this.load.image("platform", "../assets/platform.png");
        this.load.image("background", "../assets/bg1.jpg");
    }

    //*** Call loaded assets***//
    create() {

        this.game;
        this.gameOptions = {
        firstPlatformPosition: 2 / 10,
        gameGravity: 1700,
        platformHorizontalSpeedRange: [250, 400],
        platformLengthRange: [120, 300],
        platformVerticalDistanceRange: [150, 250]
        }

        // Add background to game
        this.background = this.add.image(900,600,"background");

        // Create group of platforms
        this.platformGroup = this.physics.add.group();
        for (let i = 0; i < 10; i ++) {
            this.addPlatform(i == 0);
        }
        // Create player
        this.player = this.physics.add.sprite(this.game.config.width / 2, 0, "player");
        this.player.setFrictionX(1);
        this.canDestroy = false;

        // Set camera to follow player
        this.cameras.main.startFollow(this.player, true, 0, 0.5, 0, - (this.game.config.height / 2 - this.game.config.height * this.gameOptions.firstPlatformPosition));
        this.input.on("pointerdown", this.destroyPlatform, this);
    }


    addPlatform(isFirstPlatform) {
        
        let platform = this.platformGroup.create(this.game.config.width / 2,isFirstPlatform ? this.game.config.width * this.gameOptions.firstPlatformPosition : 0, "platform");
        platform.isPlayerOnIt = false;
        
        platform.setImmovable(true);    // sets if platform will be separated during collision
        platform.body.setAllowGravity(false); // Gravity not applicable to platforms
        platform.setFrictionX(1);
        if(!isFirstPlatform) {
            this.positionPlatform(platform);
        }
        else {
            platform.setTint(0xffff00)
        }
        platform.assignedVelocityX = isFirstPlatform ? 0 : this.randomValue(this.gameOptions.platformHorizontalSpeedRange) * Phaser.Math.RND.sign();
    }


    paintSafePlatforms() {
        let floorPlatform = this.getHighestPlatform(0);
        floorPlatform.setTint(0x00ff00); // Set tint for the current current platform
        let targetPlatform = this.getHighestPlatform(floorPlatform.y);
        targetPlatform.setTint(0xffff00); // Set tint for the next target platform
    }

    // Collision function
    handleCollision(player, platform) {
        if (!platform.isPlayerOnIt) {
            if (!platform.isTinted) {
                this.scene.start("GameScene") // Game restarts if player faisl to land on the right platform
            }
            if (player.x < platform.getBounds().left) {
                player.setVelocityY(-200);
                player.setVelocityX(-200);
                player.angle = -45;
            }
            if (player.x > platform.getBounds().right) {
                player.setVelocityY(-200);
                player.setVelocityX(200);
                player.angle = 45;
            }

            // Player lands on the right platform, game continues
            platform.isPlayerOnIt = true;
            this.paintSafePlatforms();
            this.canDestroy = true; // 
        }
    }

    randomValue(a) {
        return Phaser.Math.Between(a[0], a[1]);
    }

    destroyPlatform() {
        if (this.canDestroy) {
            this.canDestroy = false;
            let closestPlatform = this.physics.closest(this.player).gameObject;
            let furthestPlatform = this.physics.furthest(this.player);
            closestPlatform.isPlayerOnIt = false;
            closestPlatform.y = furthestPlatform.gameObject.y + this.randomValue(this.gameOptions.platformVerticalDistanceRange);
            closestPlatform.assignedVelocityX = this.randomValue(this.gameOptions.platformHorizontalSpeedRange) * Phaser.Math.RND.sign();
            closestPlatform.x = this.game.config.width / 2;
            closestPlatform.displayWidth = this.randomValue(this.gameOptions.platformLengthRange);
            closestPlatform.clearTint()
        }
    }

    getLowestPlatform() {
        let lowestPlatform = null;
        this.platformGroup.getChildren().forEach(function(platform) {
            lowestPlatform = Math.max(lowestPlatform, platform.y);
        });
        return lowestPlatform;
    }
    
    // Target platform
    getHighestPlatform(maxHeight) {
        let highestPlatform = null;
        this.platformGroup.getChildren().forEach(function(platform) {
            if ((platform.y > maxHeight) && (!highestPlatform || platform.y < highestPlatform.y)) {
                highestPlatform = platform;
            }
        });
        return highestPlatform;
    }

    positionPlatform(platform) {
        platform.y = this.getLowestPlatform() + this.randomValue(this.gameOptions.platformVerticalDistanceRange);
        platform.x = this.game.config.width / 2;
        platform.displayWidth = this.randomValue(this.gameOptions.platformLengthRange);
    }

    update() {

        if (this.player.angle == 0) {
            this.physics.world.collide(this.player, this.platformGroup, this.handleCollision, null, this);
        }
        this.platformGroup.getChildren().forEach(function(platform) {
            if (platform.y + this.game.config.height < this.player.y) {
                this.scene.start("GameScene")
            }
            let distance = Math.max(0.2, 1 - ((Math.abs(this.game.config.width / 2 - platform.x) / (this.game.config.width / 2)))) * Math.PI / 2;
            platform.setVelocityX(platform.assignedVelocityX * distance);
            if ((platform.body.velocity.x < 0 && platform.getBounds().left < this.player.displayWidth / 2) || (platform.body.velocity.x > 0 && platform.getBounds().right > this.game.config.width - this.player.displayWidth / 2)) {
                platform.assignedVelocityX *= -1;
            }
        }, this);
    }
}
