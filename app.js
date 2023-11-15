//ES6 Module syntax 
import http from 'node:http';
import https from 'node:https'; //for getting data from api.itbooks.store
import dotenv from 'dotenv';
dotenv.config()

let url = `https://api.itbook.store/1.0/search/MongoDB`

const alternativeGetRequest = url => new Promise((resolve,reject) =>{
  https.get(url, res => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', ()=>{
      resolve(JSON.parse(data)); //resolve is most likely a Promise specific kind of return
    });

    res.on('error', error => {
      reject(error);
    });
  });
});

let baseResponse = await alternativeGetRequest(url);

console.log("baseResponse: ", baseResponse);

function sendPostRequest(){

  const postOptions = {
    'protocol': 'http:',
    'hostname': 'localhost',
    'port': process.env.PORT,
    'method': 'POST',
    'path':'/insert',
    'headers': {
      'Content-Type': 'application/json',
      //'Content-Length': Buffer.byteLength(JSON.stringify(postData)),
      'Accept': '*',
      //'Authorization': 'Basic TOKEN'
    },
  };

  const postBody= 
  {
  "title": "test",
  "subtitle": "test",
  "isbn13": "test",
  "price": "test",
  "image": "test",
  "url": "test"
};

  return new Promise((resolve, reject) => {
    const req = http.request(postOptions, (res) => {
      let body = '';
      res.on('data', (chunk)=>{
            body+=chunk;
          });

      res.on('end', () => {
        console.log(body);
        if (res.statusCode / 2 === 100 ) {
            console.log('Scraper: success')
            resolve('Success');
            }
        else {
            console.log('failed')
            resolve('Failure');
        }
    });
    res.on('error', () => {
      console.log('error');
      reject(Error('HTTP call failed'));
    });
  });
  req.write(JSON.stringify(postBody)); //the part that actually sends the request
  req.end();
});
};

//sendPostRequest();
//console.log("test: ", await itbooksScrapeGetRequest("MongoDB"));

