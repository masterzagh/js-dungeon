function Client(){
  let ws = new WebSocket(`ws://${window.location.hostname}:8001`);
  ws.addEventListener('open', e => {
    // Do Nothing
  });
  ws.addEventListener('message', function(event) {
    let data;
    try{
      data = JSON.parse(event.data);
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
