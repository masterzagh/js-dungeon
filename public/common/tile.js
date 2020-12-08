function Tile({type = Tile.TYPE_SIMPLE }){
  this.type = type;

  this.draw = function(ctx, x, y, side){
    ctx.fillStyle = Tile.COLORS[type];
    ctx.fillRect(x, y, side, side);
  }

}
Tile.TYPE_SIMPLE = 0;
Tile.TYPE_GRASS = 1;
Tile.TYPE_WATER = 2;
Tile.TYPE_MAGMA = 3;
Tile.COLORS = {
  [Tile.TYPE_SIMPLE]: '#ccc',
  [Tile.TYPE_GRASS]: '#2c2',
  [Tile.TYPE_WATER]: '#22c',
  [Tile.TYPE_MAGMA]: '#c22'
};

Tile.randomType = function(){
  return rand(Tile.TYPE_SIMPLE, Tile.TYPE_MAGMA);
}

try{global.Tile = Tile}catch(e){/* Do nothing */}
