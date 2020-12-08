function Player(id, name, use_sprites = true){
  this.id = id;
  this.name = name;
  this.x = this.y = 0;

  const SPRITE_SIZE = 100;
  let sprites, images;
  let n_sprites, sprites_loaded;
  if(use_sprites){
    sprites = {};
    images = {
      [Player.DIRECTION_LEFT]: '/player/sprite_left.png',
      [Player.DIRECTION_RIGHT]: '/player/sprite_right.png',
      [Player.DIRECTION_UP]: '/player/sprite_up.png',
      [Player.DIRECTION_DOWN]: '/player/sprite_down.png',
    };

    n_sprites = 0;
    sprites_loaded = 0;
    for(let direction in images){
    n_sprites++;
    let url = images[direction];

    let img = new Image();
    img.src = url;
    img.onload = function(){
      let canvas = document.createElement('canvas');
      canvas.width = canvas.height = SPRITE_SIZE;
      let ctx = canvas.getContext('2d');
      ctx.drawImage(img,
        0, 0, img.naturalWidth, img.naturalHeight,
        0, 0, SPRITE_SIZE, SPRITE_SIZE);

      sprites[direction] = canvas;
      sprites_loaded++;
    };
  }
  }

  this.direction = Player.DIRECTION_RIGHT;
  this.look = function(direction){
    this.direction = direction;
  }

  this.draw = function(ctx, x, y, size){
    if(sprites_loaded == n_sprites){
      ctx.drawImage(sprites[this.direction],
        0, 0, SPRITE_SIZE, SPRITE_SIZE,
        x, y, size, size);
    }
  }
}
Player.DIRECTION_LEFT = 0;
Player.DIRECTION_RIGHT = 1;
Player.DIRECTION_UP = 2;
Player.DIRECTION_DOWN = 3;

try{global.Player = Player}catch(e){/* Do nothing */}
