//ES6 Module syntax 
import https from 'node:https';

let rawData = '';
let humanReadable = '';

https.get('https://api.itbook.store/1.0/search/MongoDB', (res) => {
  //console.log('statusCode:', res.statusCode);
  //console.log('headers:', res.headers);

  res.on('data', (chunk) => {
    //process.stdout.write(chunk);
    rawData += chunk;
    //console.log(chunk);
  });

  res.on('end', () => {
    //console.log(JSON.parse(rawData));
    humanReadable = JSON.parse(rawData);
    console.log(humanReadable);
  })

}).on('error', (e) => {
  console.error(e);
}); 