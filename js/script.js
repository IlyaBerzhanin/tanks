"use strict";

var MAP = [
  [2, 0, 5, 3, 0, 0, 2, 0, 0, 3, 0, 0, 2],
  [0, 3, 0, 3, 0, 0, 0, 0, 0, 3, 5, 4, 4],
  [4, 4, 4, 3, 5, 0, 0, 0, 0, 3, 0, 0, 0],
  [4, 0, 4, 3, 5, 5, 0, 0, 3, 3, 3, 3, 0],
  [3, 3, 3, 3, 3, 5, 5, 0, 0, 8, 0, 3, 0],
  [0, 4, 4, 8, 8, 8, 0, 0, 0, 8, 3, 3, 0],
  [3, 3, 3, 5, 8, 3, 3, 3, 0, 8, 3, 3, 3],
  [4, 8, 0, 0, 3, 5, 5, 8, 8, 8, 0, 0, 0],
  [4, 8, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [4, 8, 3, 3, 3, 3, 5, 3, 3, 3, 3, 0, 0],
  [3, 5, 0, 3, 0, 5, 0, 5, 5, 0, 0, 0, 0],
  [3, 5, 4, 0, 0, 3, 3, 3, 0, 4, 4, 4, 0],
  [3, 4, 3, 0, 0, 3, 0, 3, 0, 0, 0, 4, 0],
  [4, 4, 3, 0, 1, 3, 7, 3, 6, 8, 8, 4, 4],
];



var MAP_LEGEND = {
  PLAYER_BASE: 1,
  ENEMY_BASE: 2,
  WALL: 3,
  FOREST: 4,
  ARMOUR: 5,
  SECOND_PLAYER: 6,
  PLAYER_FLAG: 7,
  WATER: 8,
};

class GameItem {
    constructor(options) {
      this.gameMap = document.querySelector("#game-map");
      this.itemWidth = 64;
      this.itemHeight = 64;
      this.fieldWidth = this.gameMap.clientWidth;
      this.fieldHeight = this.gameMap.clientHeight;
  
      this.item = document.createElement("div");
      this.item.classList.add("game-object");
      this.directions = ["top", "left", "right", "down"];
      this.direction = options.direction;
  
      this.wasKilled = false;
      this.rank = options.rank;
  
      this.x = options.x;
      this.y = options.y;
      this.baseX = options.baseX;
      this.baseY = options.baseY;
  
      this.step = options.step;
      this.run = options.run;
      this.obstacleReached = false;
      this.type = options.type;
      this.id = options.id;
    }
  
    addItemOnField(x, y, array) {
      this.gameMap.append(this.item);
      this.item.style.left = `${x * this.itemWidth}px`;
      this.item.style.top = `${y * this.itemHeight}px`;
      this.x = x * this.itemWidth;
      this.y = y * this.itemHeight;
      this.baseX = x * this.itemWidth;
      this.baseY = y * this.itemHeight;
      array.push(this);
    }
  
    move() {
      if (this.run === true) {
        switch (this.direction) {
          case "left":
            if (this.x > 0) {
              this.x -= this.step;
              this.item.style.left = `${this.x}px`;
            }
            break;
  
          case "right":
            if (this.x < this.fieldWidth - this.item.offsetWidth) {
              this.x += this.step;
              this.item.style.left = `${this.x}px`;
            }
            break;
  
          case "top":
            if (this.y > 0) {
              this.y -= this.step;
              this.item.style.top = `${this.y}px`;
            }
            break;
  
          case "down":
            if (this.y < this.fieldHeight - this.item.offsetHeight) {
              this.y += this.step;
              this.item.style.top = `${this.y}px`;
            }
            break;
        }
      }
    }
  
    checkDistance() {
      let masterX = this.item.offsetLeft + this.item.offsetWidth / 2;
      let masterY = this.item.offsetTop + this.item.offsetHeight / 2;
      for (let i = 0; i < MY_GAME.ALL_PLAY_ITEMS.length; i++) {
        let targetX =
          MY_GAME.ALL_PLAY_ITEMS[i].item.offsetLeft +
          MY_GAME.ALL_PLAY_ITEMS[i].item.offsetWidth / 2;
        let targetY =
          MY_GAME.ALL_PLAY_ITEMS[i].item.offsetTop +
          MY_GAME.ALL_PLAY_ITEMS[i].item.offsetHeight / 2;
  
        let dX = masterX - targetX;
        let dY = masterY - targetY;
        let rangeFromCenters =
          (this.item.offsetWidth + MY_GAME.ALL_PLAY_ITEMS[i].item.offsetWidth) /
          2;
        //---------checking distance between two objects
  
        if (
          (dX <= rangeFromCenters &&
            dX > 1 &&
            Math.abs(dY) < rangeFromCenters &&
            this.direction === "left") ||
          (dX >= -rangeFromCenters &&
            dX < -1 &&
            Math.abs(dY) < rangeFromCenters &&
            this.direction === "right") ||
          (dY <= rangeFromCenters &&
            dY > 1 &&
            Math.abs(dX) < rangeFromCenters &&
            this.direction === "top") ||
          (dY >= -rangeFromCenters &&
            dY < -1 &&
            Math.abs(dX) < rangeFromCenters &&
            this.direction === "down") 
        ) {        
          if((this.type === 'player-tank' && MY_GAME.ALL_PLAY_ITEMS[i].type !== 'player-bullet') || 
          (this.type === 'enemy-tank' && MY_GAME.ALL_PLAY_ITEMS[i].type !== 'enemy-bullet') ) {
            this.run = false;
            this.obstacleReached = true;
          }
          //------------------------checking destruction of player base
  
          if (
            this.type === "enemy-bullet" &&
            MY_GAME.ALL_PLAY_ITEMS[i].type === "flag"
          ) {
            MY_GAME.IS_GAME_OVER = true;
          }
  
          //-------------------------friendly fire------
          else if (
            (this.type === "enemy-bullet" &&
              MY_GAME.ALL_PLAY_ITEMS[i].type === "enemy-tank") ||
            (this.type === "player-bullet" &&
              MY_GAME.ALL_PLAY_ITEMS[i].type === "player-tank")
          ) {
            this.wasKilled = true;
          }
  
          //------checking what do kill
          else if (
            (this.type === "player-bullet" &&
              (MY_GAME.ALL_PLAY_ITEMS[i].type === "wall" ||
                MY_GAME.ALL_PLAY_ITEMS[i].type === "armour" ||
                MY_GAME.ALL_PLAY_ITEMS[i].type === "flag" ||
                MY_GAME.ALL_PLAY_ITEMS[i].type === "enemy-tank" ||
                MY_GAME.ALL_PLAY_ITEMS[i].type === "enemy-bullet")) ||
            (this.type === "enemy-bullet" &&
              (MY_GAME.ALL_PLAY_ITEMS[i].type === "wall" ||
                MY_GAME.ALL_PLAY_ITEMS[i].type === "armour" ||
                MY_GAME.ALL_PLAY_ITEMS[i].type === "player-tank" ||
                MY_GAME.ALL_PLAY_ITEMS[i].type === "player-bullet")) ||
            (this.type === "enemy-bullet" &&
              MY_GAME.ALL_PLAY_ITEMS[i].type === "enemy-bullet") ||
            (this.type === "player-bullet" &&
              MY_GAME.ALL_PLAY_ITEMS[i].type === "player-bullet")
          ) {
            this.wasKilled = true;
            MY_GAME.ALL_PLAY_ITEMS[i].wasKilled = true;
          }
  
        }
        //------------checking the borders of gamefield
        else if (
          (this.x <= 0 && this.direction === "left") ||
          (this.x >= this.fieldWidth - this.item.offsetWidth &&
            this.direction === "right") ||
          (this.y <= 0 && this.direction === "top") ||
          (this.y >= this.fieldHeight - this.item.offsetHeight &&
            this.direction === "down")
        ) {
          this.run = false;
          this.obstacleReached = true;
          if (this.type === "player-bullet" || this.type === "enemy-bullet") {
            this.wasKilled = true;
          }
        }
      }
    }
  };
class AudioTrack {
  constructor(options) {
    this.container = document.body;
    this.track = document.createElement("audio");
    this.id = options.id;
    this.src = options.src;
    this.track.setAttribute("src", this.src);
    this.container.insertBefore(this.track, document.querySelector("main"));
  }
}

const Engine = new AudioTrack({
  id: "engine",
  src: "audio/engine-freeze.mp3",
});

const Movement = new AudioTrack({
  id: "movement",
  src: "audio/move.mp3",
});

const Shot = new AudioTrack({
  id: "shot",
  src: "audio/shot.mp3",
});

const Main = new AudioTrack({
  id: "main",
  src: "audio/main.mp3",
});

const Death = new AudioTrack({
  id: "death",
  src: "audio/cutdeath.mp3",
});

;
 class LifeIcon {
    constructor(options) {
      this.container = options.container
      this.class = options.class
      this.attribute = options.attribute
      this.container = document.querySelector(this.container)
      this.life = document.createElement("img")    
      this.life.classList.add(this.class)
      this.life.setAttribute('src', this.attribute)
      this.container.append(this.life)
    }
  };
class PlayerFlag extends GameItem {
    constructor(options) {
      super(options) 
      this.item.classList.add('player-base') 
      }
  
    
  };
 class Modal {
    constructor(options) {
      this.modal = document.querySelector('.intro-modal')
      this.pointer = document.querySelector('.pointer')
      this.onePlayer = document.querySelector('#one-player')
      this.twoPlayers = document.querySelector('#two-players')
      this.choiceBlock = document.querySelector('.player-choice')
      this.numberOfPlayers = 1
      this.gameStart = true
    }
  
    show() {  
        this.modal.classList.remove('hidden')  
    }
  
    hide() {
      this.modal.classList.add('hidden')
    }
  
    makeChoice() {
     this.choiceBlock.addEventListener('focus', (e) => {
       if(e.target.getAttribute('id') === 'two-players') {
         this.pointer.classList.add('down')
         this.numberOfPlayers = 2
       }
       else{
        this.pointer.classList.remove('down')
        this.numberOfPlayers = 1
       }
     }, true)
  
     document.addEventListener('keyup', (e) => {
       switch(e.keyCode) {
         case 38:
           this.pointer.classList.remove('down');
           this.numberOfPlayers = 1
           break;
         case 40: 
         this.pointer.classList.add('down')
         this.numberOfPlayers = 2
         break;  
       }
     })
    }
    
    runTheGame(callback) {
      
        document.addEventListener('keydown', (e) => {
          if(e.keyCode === 13 && this.gameStart === true) {    
            this.gameStart = false     
            this.hide()
            callback()        
          }          
        })
      
    }
  };
 class Wall extends GameItem {
  constructor(options) {
    super(options);
    this.class = options.class;
    this.item.classList.add(this.class);
    this.touchNumber = 0
  }

  destroyTheWall() {
    if (this.wasKilled === true && this.touchNumber === 0) {
      this.item.classList.add('half-destroyed')
      this.wasKilled = false
      this.touchNumber += 1
    }
    else if(this.wasKilled === true && this.touchNumber === 1)  {
      this.item.remove();
    }
  }
}

class Forest extends Wall {
  constructor(options) {
    super(options);
  }
}

class Armour extends Wall {
  constructor(options) {
    super(options);
  }
}

class Water extends Wall {
  constructor(options) {
    super(options);
  }
}
;
class Game {
  constructor(options) {
    this.IS_GAME_OVER = false;
    this.GAME_TIMER_INTERVAL = 30;

    this.ENEMY_TANKS_COUNT = options.ENEMY_TANKS_COUNT;
    this.PLAYER_LIFE_COUNT = options.PLAYER_LIFE_COUNT;

    this.PLAYER_LIFES_ICONS = [];
    this.ENEMY_LIFES_ICONS = [];

    this.tracks = {
      shotSound: Shot,
      moveSound: Movement,
      staySound: Engine,
      mainSound: Main,
      deathSound: Death,
    };

    this.ALL_PLAY_ITEMS = [];
    this.WALLS = [];
    this.FOREST = [];
    this.BULLETS = [];
    this.ALLTANKS = [];
    this.PLAYER = [];
    this.PLAYER_BULLETS = [];
    this.ENEMIES = [];
    this.ENEMY_BULLETS = [];
    this.FLAG = [];
  }

  fillTheField(number, x, y) {
    switch (number) {
      case 1:
        const PLAYER_TANK = new Player({
          type: "player-tank",
          className: "game-object game-object__player-tank",
          rank: "main",
          moveLeft: 37,
          moveRight: 39,
          moveDown: 40,
          moveUp: 38,
          shooting: 32,
        });
        PLAYER_TANK.addItemOnField(x, y, MY_GAME.PLAYER);
        MY_GAME.ALLTANKS.push(PLAYER_TANK);
        MY_GAME.ALL_PLAY_ITEMS.push(PLAYER_TANK);

        const PLAYER_BULLET = new Bullet({
          type: "player-bullet",
          id: "player",
          rank: "main",
        });
        MY_GAME.BULLETS.push(PLAYER_BULLET);
        MY_GAME.ALL_PLAY_ITEMS.push(PLAYER_BULLET);
        MY_GAME.PLAYER_BULLETS.push(PLAYER_BULLET);
        break;

      case 2:
        const ENEMY_TANK = new Enemy({
          type: "enemy-tank",
          className: "game-object game-object__enemy-tank",
        });
        ENEMY_TANK.addItemOnField(x, y, MY_GAME.ENEMIES);
        MY_GAME.ALLTANKS.push(ENEMY_TANK);
        MY_GAME.ALL_PLAY_ITEMS.push(ENEMY_TANK);

        const ENEMY_BULLET = new Bullet({
          type: "enemy-bullet",
          id: "enemy",
        });
        MY_GAME.BULLETS.push(ENEMY_BULLET);
        MY_GAME.ALL_PLAY_ITEMS.push(ENEMY_BULLET);
        MY_GAME.ENEMY_BULLETS.push(ENEMY_BULLET);
        break;

      case 3:
        const WALL = new Wall({
          type: "wall",
          class: "game-object__wall",
        });
        WALL.addItemOnField(x, y, MY_GAME.WALLS);
        MY_GAME.ALL_PLAY_ITEMS.push(WALL);
        break;

      case 4:
        const FOREST = new Forest({
          type: "forest",
          class: "forest",
        });
        FOREST.addItemOnField(x, y, MY_GAME.FOREST);
        break;

      case 5:
        const ARMOUR = new Armour({
          type: "armour",
          class: "armour",
        });
        ARMOUR.addItemOnField(x, y, MY_GAME.ALL_PLAY_ITEMS);
        break;

      case 6:
        if (IntroModal.numberOfPlayers === 2) {
          const SECOND_PLAYER_TANK = new SecondPlayer({
            type: "player-tank",
            className: "game-object game-object__player-tank second-player",
            moveLeft: 100,
            moveRight: 102,
            moveDown: 101,
            moveUp: 104,
            shooting: 96,
          });
          SECOND_PLAYER_TANK.addItemOnField(x, y, MY_GAME.PLAYER);
          MY_GAME.ALLTANKS.push(SECOND_PLAYER_TANK);
          MY_GAME.ALL_PLAY_ITEMS.push(SECOND_PLAYER_TANK);

          const SECOND_PLAYER_BULLET = new Bullet({
            type: "player-bullet",
            id: "player",
          });
          MY_GAME.BULLETS.push(SECOND_PLAYER_BULLET);
          MY_GAME.ALL_PLAY_ITEMS.push(SECOND_PLAYER_BULLET);
          MY_GAME.PLAYER_BULLETS.push(SECOND_PLAYER_BULLET);
        }
        break;

      case 7:
        const FLAG = new PlayerFlag({
          type: "flag",
        });
        FLAG.addItemOnField(x, y, MY_GAME.ALL_PLAY_ITEMS);
        MY_GAME.FLAG.push(FLAG);
        break;

      case 8:
        const WATER = new Water({
          type: "water",
          class: "water",
        });
        WATER.addItemOnField(x, y, MY_GAME.ALL_PLAY_ITEMS);
        break;
    }
  }

  draw() {
    for (let i = 0; i < MAP.length; i++) {
      for (let j = 0; j < MAP[i].length; j++) {
        for (let key in MAP_LEGEND) {
          if (MAP[i][j] === MAP_LEGEND[key]) {
            this.fillTheField(MAP_LEGEND[key], j, i);
          }
        }
      }
    }

    for (let i = 0; i < this.PLAYER_LIFE_COUNT; i++) {
      const PLAYER_LIFE_ICON = new LifeIcon({
        container: ".player-lifes-container",
        class: "player-life",
        attribute: "img/player-live.png",
      });
      this.PLAYER_LIFES_ICONS.push(PLAYER_LIFE_ICON);
    }

    for (let i = 0; i < this.ENEMY_TANKS_COUNT; i++) {
      const ENEMY_LIFE_ICON = new LifeIcon({
        container: ".enemy-lifes-container",
        class: "enemy-life",
        attribute: "img/enemy-live.png",
      });
      this.ENEMY_LIFES_ICONS.push(ENEMY_LIFE_ICON);
    }
  }

  countLifes(tank) {
    if (tank.wasKilled === true) {
      switch (tank.type) {
        case "player-tank":
          this.PLAYER_LIFES_ICONS[
            this.PLAYER_LIFES_ICONS.length - this.PLAYER_LIFE_COUNT
          ].life.remove();
          this.PLAYER_LIFE_COUNT--;
          break;
        case "enemy-tank":
          this.ENEMY_LIFES_ICONS[
            this.ENEMY_LIFES_ICONS.length - this.ENEMY_TANKS_COUNT
          ].life.remove();
          this.ENEMY_TANKS_COUNT--;
      }
    }
  }

  addSounds() {
    for (let i = 0; i < this.PLAYER.length; i++) {
      //---------------------------movement--------------------------------

      if (this.PLAYER[i].rank === "main" && this.PLAYER[i].run === false) {
        this.tracks.moveSound.track.pause();
        this.tracks.staySound.track.play();
      } else if (
        this.PLAYER[i].rank === "main" &&
        this.PLAYER[i].run === true
      ) {
        this.tracks.staySound.track.pause();
        this.tracks.moveSound.track.play();
      }

      if (this.IS_GAME_OVER === true) {
        this.tracks.staySound.track.pause();
        this.tracks.moveSound.track.pause();
      }
      //----------------------------shooting---------------------------------------
      if (
        this.PLAYER[i].shotIsMade === true &&
        this.PLAYER_BULLETS[i].wasKilled === false &&
        this.PLAYER_BULLETS[i].rank === "main"
      ) {
        this.tracks.shotSound.track.play();
        if (
          this.PLAYER_BULLETS[i].isBulletFlying === true ||
          this.PLAYER_BULLETS[i].obstacleReached === true
        ) {
          this.PLAYER[i].shotIsMade = false;
          this.tracks.shotSound.track.currentTime = 0;
        }
      }
    }

    for (let i = 0; i < this.ALLTANKS.length; i++) {
      if (this.ALLTANKS[i].wasKilled === true) {
        this.tracks.deathSound.track.play();
      }
    }
  }

  finishGame() {
    if (this.PLAYER_LIFE_COUNT === 0 || this.ENEMY_TANKS_COUNT === 0) {
      MY_GAME.IS_GAME_OVER = true;
    }
  }
}
;

const MY_GAME = new Game({
  ENEMY_TANKS_COUNT: 21,
  PLAYER_LIFE_COUNT: 10,
});

class Bullet extends GameItem {
    constructor(options) {
      super(options);
      this.isBulletFlying = false;
      this.bulletDirection = "";
      this.bulletStep = options.bulletStep;
      this.item.classList.add("bullet");
      this.step = 16;
    }
  
    shoot(tank) {
      if (
        this.id === tank.id &&
        this.isBulletFlying === false &&
        this.gameMap.contains(tank.item)
      ) {
        tank.shotIsMade = true;
        this.gameMap.append(this.item);
        this.item.style.left = `${
          tank.item.offsetLeft + tank.item.offsetWidth / 2.5
        }px`;
        this.item.style.top = `${
          tank.item.offsetTop + tank.item.offsetHeight / 2.5
        }px`;
        this.x = tank.item.offsetLeft + tank.item.offsetWidth / 2.5;
        this.y = tank.item.offsetTop + tank.item.offsetHeight / 2.5;
        this.direction = tank.direction;
        this.run = true;
        this.isBulletFlying = true;
        tank.numberOfShots++;
      }
    }
  
    reload() {
      if (this.wasKilled) {
        this.item.remove();
        this.isBulletFlying = false;
        this.wasKilled = false;
        this.run = true;
      }
    }
  };


class Tank extends GameItem {
    constructor(options) {
      super(options);
      this.step = 8;
      this.run = false;
      this.className = options.className;
      this.shotIsMade = false;
    }
  
    checkDirection() {
      switch (this.direction) {
        case "left":
          this.item.className = this.className;
          this.item.classList.add("left");
          break;
        case "top":
          this.item.className = this.className;
          this.item.classList.add("top");
          break;
        case "right":
          this.item.className = this.className;
          this.item.classList.add("right");
          break;
        case "down":
          this.item.className = this.className;
          this.item.classList.add("down");
          break;
      }
    }
  
    regenerate() {
      if (this.wasKilled) {
        this.item.remove();
        if (!this.gameMap.contains(this.item)) {
          if (
            this.type === "player-tank" &&
            MY_GAME.PLAYER_LIFE_COUNT >= MY_GAME.PLAYER.length
          ) {
            this.item.style.left = this.baseX + "px";
            this.item.style.top = this.baseY + "px";
            this.x = this.baseX;
            this.y = this.baseY;
            this.gameMap.append(this.item);
          } else if (
            this.type === "enemy-tank" &&
            MY_GAME.ENEMY_TANKS_COUNT >= MY_GAME.ENEMIES.length
          ) {
            let randomEnemy =
              MY_GAME.ENEMIES[Math.floor(Math.random() * MY_GAME.ENEMIES.length)];
            this.item.style.left = randomEnemy.baseX + "px";
            this.item.style.top = randomEnemy.baseY + "px";
            this.x = randomEnemy.baseX;
            this.y = randomEnemy.baseY;
            this.gameMap.append(this.item);
          }
  
          this.wasKilled = false;
        }
      }
    }
  };
class Enemy extends Tank {
    constructor(options) {
      super(options);
      this.direction = "down";
      this.run = true;
      this.numberOfShots = 0;
      this.item.classList.add("game-object__enemy-tank");
      this.id = "enemy";
    }
    changeDirection() {
      if (this.obstacleReached === true && this.run === false) {
        let prevDirection = this.direction;
        this.direction = this.directions[
          Math.floor(Math.random() * this.directions.length)
        ];
        if (this.direction !== prevDirection) {
          this.obstacleReached = false;
          this.run = true;
          this.numberOfShots = 0;
        }
      } else if (this.numberOfShots > 2) {
        this.direction = this.directions[
          Math.floor(Math.random() * this.directions.length)
        ];
        this.numberOfShots = 0;
      }
    }
  }
  ;
class Player extends Tank {
    constructor(options) {
      super(options);
      this.direction = "top";
      this.item.classList.add("game-object__player-tank");
      this.id = "player";
  
      this.moveLeft = options.moveLeft
      this.moveRight = options.moveRight
      this.moveDown = options.moveDown
      this.moveUp = options.moveUp
      this.shooting = options.shooting
  
      this.keys = {
        moveLeft: this.moveLeft,
        moveRight: this.moveRight,
        moveDown: this.moveDown,
        moveUp: this.moveUp,
        shooting: this.shooting,
      }
    }
  
    switchKeycodeToAct(key, indexOfPlayer) {
      switch (key) {
        case this.keys.moveLeft:
          this.direction = "left";
          this.run = true;
          break;
        case this.keys.moveUp:
          this.direction = "top";
          this.run = true;
          break;
        case this.keys.moveRight:
          this.direction = "right";
          this.run = true;
          break;
        case this.keys.moveDown:
          this.direction = "down";
          this.run = true;
          break;
  
        case this.keys.shooting:
          MY_GAME.PLAYER_BULLETS[indexOfPlayer].shoot(this);
          break;
      }
    }
  
    checkKeyCodeToStop(key) {
      if([this.moveLeft, this.moveRight, this.moveUp, this.moveDown].includes(key)) {
        this.run = false
      }
    }
  };
class SecondPlayer extends Player {
    constructor(options) {
      super(options);
      this.item.classList.add("second-player");
    }
  };

const IntroModal = new Modal({})
IntroModal.show()
IntroModal.makeChoice()
IntroModal.runTheGame(gameInitialization)


gameLoop();

function gameInitialization() {
  MY_GAME.tracks.mainSound.track.play();
  MY_GAME.draw();

  document.addEventListener("keydown", (e) => {
    let key = e.keyCode;
    for(let i = 0; i < MY_GAME.PLAYER.length; i++) {
      MY_GAME.PLAYER[i].switchKeycodeToAct(key, i);
    }    
  });
  document.addEventListener("keyup", (e) => {    
    for(let i = 0; i < MY_GAME.PLAYER.length; i++) {
      MY_GAME.PLAYER[i].checkKeyCodeToStop(e.keyCode);
    }
  });
}

function gameLoop() {
  if (MY_GAME.IS_GAME_OVER !== true) {

    gameStep();

    setTimeout(function () {
      gameLoop();
    }, MY_GAME.GAME_TIMER_INTERVAL);
  } else {
    MY_GAME.IS_GAME_OVER = false;
    IntroModal.gameStart = true
    if (MY_GAME.ENEMY_TANKS_COUNT === 0) {
      alert("Victory!)");
    } else {
      alert("Defeated!)");
    }    
    location.reload()
   
  }
}

function gameStep() {
  MY_GAME.ALLTANKS.forEach((tank) => {
    tank.checkDirection();
    tank.checkDistance();
    tank.move();
    MY_GAME.countLifes(tank);
    tank.regenerate();
  });

  for (let i = 0; i < MY_GAME.ENEMIES.length; i++) {
    MY_GAME.ENEMIES[i].changeDirection();
    MY_GAME.ENEMY_BULLETS[i].shoot(MY_GAME.ENEMIES[i]);
  }

  MY_GAME.WALLS.forEach((wall) => {
    wall.destroyTheWall();
  });

  MY_GAME.BULLETS.forEach((bul) => {
    bul.move();
    bul.checkDistance();
    bul.reload();
  });

  MY_GAME.addSounds();
  MY_GAME.finishGame();

}



