const express = require('express');

/* Express Static */
const app = express();
const port = 8000;
app.use(express.static('public'));
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
});

/* WebSocket.Server */
require('./public/common/utils.js');
require('./public/common/tile.js');
require('./public/common/player.js');
require('./public/common/world.js');

let world = new World();
world.generate();

let server = require('./server');

let clients = {};
let players = {};
server.on('CONNECTION', client => {
  let player = world.addPlayer(client.id, 'Name', false);

  players[client.id] = player;
  clients[client.id] = client;

  client.sendEvent('INIT', {id: client.id, players: players, world: world.save()});
  client.on('player-move', e => {
    let pos = world.movePlayer(player.id, e.move);
    server.sendEvent('player-move', {id: client.id, move: e.move});
  });


  server.sendEvent('new-player', player);
});
