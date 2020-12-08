(function(){
  const WebSocket = require('ws');
  function Server(){
    let clients = {};
    let currentID = 0;

    const ws_port = 8001;
    const wss = new WebSocket.Server({ port: ws_port });
    wss.on('connection', function connection(ws) {
      let client = new Client(currentID, ws);
      clients[currentID++] = client;

      trigger('CONNECTION', client);
    });

    this.sendEvent = function(eventName, eventData){
      for(let i in clients){
        clients[i].sendEvent(eventName, eventData);
      }
    }

    let events = {};
    this.on = function(eventName, fn){
      if(!events[eventName]) events[eventName] = [];
      events[eventName].push(fn);
    }
    function trigger(eventName, data){
      events[eventName].forEach(fn => fn(data));
    }

  }
  function Client(id, ws){
    this.id = id;

    ws.on('message', function incoming(message) {

      let data;
      try{
        data = JSON.parse(message);
      }catch(e){
        return;
      }

      if(data.type == 'event'){
        trigger(data.eventName, data.eventData);
      }
    });

    this.sendEvent = function(eventName, eventData){
      let e = {type: 'event', eventName, eventData};
      ws.send(JSON.stringify(e));
    }

    let events = {};
    this.on = function(eventName, fn){
      if(!events[eventName]) events[eventName] = [];
      events[eventName].push(fn);
    }
    function trigger(eventName, data){
      events[eventName].forEach(fn => fn(data));
    }
  }

  module.exports = new Server();
})();
