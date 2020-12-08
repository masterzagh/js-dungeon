function rand(min, max){
  max++;
  return (Math.random()*(max-min) + min)|0;
}

try{global.rand = rand}catch(e){/* Do nothing */}
