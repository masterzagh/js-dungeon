function World(){
  let main_player_id;
  let players = {};
  let tiles = [], sectors = [];
  let spawn;

  let world = {spawn, tiles, sectors};
  const TILE_SIDE = 75;
  const TILE_GAP = 2;
  const SECTOR_GAP = 1;
  const MIN_SECTORS_SIDE = 4;
  const MAX_SECTORS_SIDE = 8;
  const MIN_ROOM_SIDE = 8;
  const MAX_ROOM_SIDE = 16;
  this.generate = function(){
    sectors = [];
    tiles = [];

    let sectors_side = rand(MIN_SECTORS_SIDE, MAX_SECTORS_SIDE);
    let tile_side = sectors_side*MAX_ROOM_SIDE + sectors_side*SECTOR_GAP;

    for(let y=0;y<tile_side;y++){
      tiles[y] = Array(tile_side);
    }

    for(let y=0;y<sectors_side;y++){
      sectors[y] = Array(sectors_side);
      for(let x=0;x<sectors_side;x++){
        sectors[y][x] = generateRoom(x, y);
        if(x > 0){
          makePathLeft(sectors[y][x-1], sectors[y][x]);
        }
        if(y > 0){
          makePathTop(sectors[y-1][x], sectors[y][x]);
        }
      }
    }

  }
  function makePathLeft(left, right){
    let left_start_y = left.tile_y, left_end_y = left.tile_y+left.side-1;
    let right_start_y = right.tile_y, right_end_y = right.tile_y+right.side-1;
    let intersection_right_top =
      (right_start_y >= left_start_y && right_start_y <= left_end_y);
    let intersection_right_bottom =
      (right_end_y >= left_start_y && right_end_y <= left_end_y);
    let intersection_left_top =
      (left_start_y >= right_start_y && left_start_y <= right_end_y);
    let intersection_left_bottom =
      (left_end_y >= right_start_y && left_end_y <= right_end_y);
    let intersection =
      intersection_right_top || intersection_right_bottom ||
      intersection_left_top || intersection_left_bottom;

    let left_path, right_path;
    let start_y, end_y;
    if(intersection){
      let top, bottom;
      if(intersection_right_top) top = right_start_y;
      if(intersection_right_bottom) bottom = right_end_y;
      if(intersection_left_top) top = left_start_y;
      if(intersection_left_bottom) bottom = left_end_y;

      start_y = rand(top, bottom);
      end_y = rand(top, bottom);
    }else{
      if(left_end_y < right_start_y){
        start_y = left_end_y;
        end_y = right_start_y;
      }else {
        start_y = left_start_y;
        end_y = right_end_y;
      }
    }

    let start_x = left.tile_x + left.side, end_x = right.tile_x - 1;

    let start_room_x = left.x + left.side, end_room_x = right.x;
    if(intersection && (start_room_x == MAX_ROOM_SIDE || end_room_x == 0))
      start_y = end_y;

    let y = start_y;
    for(let x = start_x, room = start_room_x; x <= end_x; x++, room++){
      let tile = new Tile({type: Tile.TYPE_SIMPLE});
      tiles[y][x] = tile;
      if(room == MAX_ROOM_SIDE){
        if(start_y > end_y){
          for(y = start_y;y >= end_y;y--){
            let tile = new Tile({type: Tile.TYPE_SIMPLE});
            tiles[y][x] = tile;
          }
          y++;
        }else if(start_y < end_y){
          for(y = start_y;y <= end_y;y++){
            let tile = new Tile({type: Tile.TYPE_SIMPLE});
            tiles[y][x] = tile;
          }
          y--;
        }
      }
    }
  }
  function makePathTop(top, bottom){
    let top_start_x = top.tile_x, top_end_x = top.tile_x+top.side-1;
    let bottom_start_x = bottom.tile_x, bottom_end_x = bottom.tile_x+bottom.side-1;
    let intersection_bottom_top =
      (bottom_start_x >= top_start_x && bottom_start_x <= top_end_x);
    let intersection_bottom_bottom =
      (bottom_end_x >= top_start_x && bottom_end_x <= top_end_x);
    let intersection_top_top =
      (top_start_x >= bottom_start_x && top_start_x <= bottom_end_x);
    let intersection_top_bottom =
      (top_end_x >= bottom_start_x && top_end_x <= bottom_end_x);
    let intersection =
      intersection_bottom_top || intersection_bottom_bottom ||
      intersection_top_top || intersection_top_bottom;

    let top_path, bottom_path;
    let start_x, end_x;
    if(intersection){
      let top, bottom;
      if(intersection_bottom_top) top = bottom_start_x;
      if(intersection_bottom_bottom) bottom = bottom_end_x;
      if(intersection_top_top) top = top_start_x;
      if(intersection_top_bottom) bottom = top_end_x;

      start_x = rand(top, bottom);
      end_x = rand(top, bottom);
    }else{
      if(top_end_x < bottom_start_x){
        start_x = top_end_x;
        end_x = bottom_start_x;
      }else {
        start_x = top_start_x;
        end_x = bottom_end_x;
      }
    }

    let start_y = top.tile_y + top.side, end_y = bottom.tile_y - 1;

    let start_room_y = top.y + top.side, end_room_y = bottom.y;
    if(intersection && (start_room_y == MAX_ROOM_SIDE || end_room_y == 0))
      start_x = end_x;

    let x = start_x;
    for(let y = start_y, room = start_room_y; y <= end_y; y++, room++){
      let tile = new Tile({type: Tile.TYPE_SIMPLE});
      tiles[y][x] = tile;
      if(room == MAX_ROOM_SIDE){
        if(start_x > end_x){
          for(x = start_x;x >= end_x;x--){
            let tile = new Tile({type: Tile.TYPE_SIMPLE});
            tiles[y][x] = tile;
          }
          x++;
        }else if(start_x < end_x){
          for(x = start_x;x <= end_x;x++){
            let tile = new Tile({type: Tile.TYPE_SIMPLE});
            tiles[y][x] = tile;
          }
          x--;
        }
      }
    }
  }
  function generateRoom(sector_x, sector_y){
    let room_side = rand(MIN_ROOM_SIDE, MAX_ROOM_SIDE)
    let diff_pos = MAX_ROOM_SIDE - room_side;
    let pos_x = 0, pos_y = 0;
    if(diff_pos > 0){
      pos_x = rand(0, diff_pos);
      pos_y = rand(0, diff_pos);
    }

    let tile_type = Tile.randomType();
    let tile_x = sector_x*MAX_ROOM_SIDE + sector_x*SECTOR_GAP + pos_x;
    let tile_y = sector_y*MAX_ROOM_SIDE + sector_y*SECTOR_GAP + pos_y;
    let tile_end_x = tile_x + room_side;
    let tile_end_y = tile_y + room_side;

    if(!spawn){
      spawn = {x: tile_x, y: tile_y};
    }

    for(let y=tile_y;y<tile_end_y;y++){
      for(let x=tile_x;x<tile_end_x;x++){
        tiles[y][x] = new Tile({type: tile_type});
      }
    }

    return {x: pos_x, y: pos_y, tile_x, tile_y, side: room_side};
  }

  this.setMainPlayer = function(id){
    main_player_id = id;
  }
  this.addPlayer = function(id, name, use_sprites){
    let player = new Player(id, name, use_sprites);
    players[id] = player;
    if(spawn){
      player.x = spawn.x;
      player.y = spawn.y;
    }
    return player;
  };
  this.loadPlayer = function(id, _player){
    let player = new Player(id, _player.name);
    players[id] = player;

    player.x = _player.x;
    player.y = _player.y;
  }
  this.movePlayer = function(playerId, playerMove){
    let player = players[playerId];
    switch(playerMove){
      case World.PLAYER_MOVE_UP: {
        let x = player.x;
        let y = player.y - 1;
        if(y >= 0 && tiles[y][x])
          player.y = y;
        player.look(Player.DIRECTION_UP);
        break;
      }
      case World.PLAYER_MOVE_DOWN: {
        let x = player.x;
        let y = player.y + 1;
        if(tiles[y][x])
          player.y = y;
        player.look(Player.DIRECTION_DOWN);
        break;
      }
      case World.PLAYER_MOVE_LEFT: {
        let y = player.y;
        let x = player.x - 1;
        if(x >= 0 && tiles[y][x])
          player.x = x;
        player.look(Player.DIRECTION_LEFT);
        break;
      }
      case World.PLAYER_MOVE_RIGHT: {
        let y = player.y;
        let x = player.x + 1;
        if(tiles[y][x])
          player.x = x;
        player.look(Player.DIRECTION_RIGHT);
        break;
      }
    }
  }

  this.load = function(world){
    tiles = world.tiles;
    sectors = world.sectors;
    spawn = world.spawn;

    tiles = tiles.map(t => {
      return t.map(t => {
        if(t) return new Tile(t);
        return null;
      });
    });
  }
  this.save = function(){
    return {
      spawn: {x:spawn.x, y:spawn.y},
      tiles: tiles.slice(),
      sectors: tiles.slice()
    };
  }

  let translate = {x: 0, y: 0};
  this.draw = function(ctx, width, height){
    let main_player = players[main_player_id];
    let main_player_x_2 = main_player.x*TILE_SIDE + main_player.x*TILE_GAP + TILE_SIDE/2;
    let main_player_y_2 = main_player.y*TILE_SIDE + main_player.y*TILE_GAP + TILE_SIDE/2;

    translate.x = main_player_x_2 - width/2;
    translate.y = main_player_y_2 - height/2;
    if(translate.x < 0) translate.x = 0;
    if(translate.y < 0) translate.y = 0;

    let tl = tiles.length-1;
    let max_translate = tl*TILE_SIDE + tl*TILE_GAP;
    let max_translate_x = max_translate - width;
    let max_translate_y = max_translate - height;
    if(translate.x > max_translate_x) translate.x = max_translate_x;
    if(translate.y > max_translate_y) translate.y = max_translate_y;

    translate.x |= 0;
    translate.y |= 0;

    ctx.translate(-translate.x, -translate.y);

    for(let y=0;y<tiles.length;y++){
      for(let x=0;x<tiles[y].length;x++){
        if(tiles[y][x]){
          let x_draw = x*TILE_SIDE + x*TILE_GAP;
          let y_draw = y*TILE_SIDE + y*TILE_GAP;
          if(x_draw > width + translate.x || y_draw > height + translate.y) continue;

          tiles[y][x].draw(ctx, x_draw, y_draw, TILE_SIDE);
        }
      }
    }

    for(let id in players){
      let player = players[id];
      let x_draw = player.x*TILE_SIDE + player.x*TILE_GAP;
      let y_draw = player.y*TILE_SIDE + player.y*TILE_GAP;
      player.draw(ctx, x_draw, y_draw, TILE_SIDE);
    }

    ctx.translate(translate.x, translate.y);

  };
}
World.PLAYER_MOVE_UP = 0;
World.PLAYER_MOVE_DOWN = 1;
World.PLAYER_MOVE_LEFT = 2;
World.PLAYER_MOVE_RIGHT = 3;

try{global.World = World}catch(e){/* Do nothing */}
