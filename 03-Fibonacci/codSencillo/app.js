const fs= require('fs');

let fibo1=1;
let fibo2=1;
let serie='';

serie += `${fibo1}\t`;

for (let i=2; i<= 5; i++){
    serie +=`${fibo2}\t`;
    fibo2= fibo1+fibo2;
    fibo1= fibo2-fibo1;
}

fs.writeFile('fibonacci.txt', serie, (err)=>{
    if (err) throw err;
    console.log('Archivo exitoso');
})