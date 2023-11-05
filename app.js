//ES6 Module syntax 
import https from 'node:https';

let rawData = '';
let humanReadable = ''; //just json

/* https.get('https://api.itbook.store/1.0/search/MongoDB', (res) => {
  res.on('data', (chunk) => {
    rawData += chunk;
  });
  res.on('end', () => {
    humanReadable = JSON.parse(rawData);
    console.log("line 20:\n", humanReadable);
  })
}).on('error', (e) => {
  console.error(e);
});  */

const postData= {
  title: 'test',
  subtitle: 'test',
  isbn13: 'test',
  price: 'test',
  image: 'test',
  url: 'test',
};

const postOptions = {
  hostname: 'localhost',
  port: 8080,
  path:'/insert',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(JSON.stringify(postData))
  },
};



const postReq = https.request(postOptions, (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d)=>{
    console.log(d);
  });
});

postReq.on('error', (e) =>{
  console.error(e);
});

postReq.write(postData);
req.end();

//todo šalji na backendov localhost:port kombo-
//todo - na JSONtoDB funkciju.
//solution - https post

