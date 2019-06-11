function findFac(n) {
  if(n === 1) return n;
  
  return n * findFac(n-1);
}

function fib(n) {
  if(n === 1) {
    return [0]; 
  }else if(n === 2) {
    return [0,1];
  }

  fibs = fib(n - 1);
  fibs.push(fibs[fibs.length - 2] + fibs[fibs.length - 1]);
  return fibs;
}

console.log(fib(7));