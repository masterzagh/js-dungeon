function Game({playerName = 'Player 1'} = {}){
  let canvas = document.createElement('canvas');
  canvas.width = 1280; canvas.height = 720;
  let ctx = canvas.getContext('2d');

  let world;
  let player_id;
  let client = new Client();
  client.on('INIT', e => {
    console.log(e);
    world = new World();
    world.load(e.world);
    world.setMainPlayer(e.id);
    for(let id in e.players){
      world.loadPlayer(id, e.players[id]);
    }
    player_id = e.id;
  });
  client.on('new-player', player => {
    if(player.id == player_id) return;
    world.loadPlayer(player.id, player);
  });
  client.on('player-move', e => {
    if(e.id == player_id) return;
    world.movePlayer(e.id, e.move);
  });

  let running = true;
  function draw(){
    requestAnimationFrame(draw);
    if(!running) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if(world)
      world.draw(ctx, canvas.width, canvas.height);
  }
  draw();

  window.addEventListener('keydown', e => {
    let moves = {
      'ArrowUp': World.PLAYER_MOVE_UP,
      'ArrowDown': World.PLAYER_MOVE_DOWN,
      'ArrowLeft': World.PLAYER_MOVE_LEFT,
      'ArrowRight': World.PLAYER_MOVE_RIGHT
    };
    let move = moves[e.key];
    if(move !== undefined){
      world.movePlayer(player_id, move);
      client.sendEvent('player-move', {move});
    }
  });

  this.appendTo = function(element){
    element.appendChild(canvas);
  };
}
