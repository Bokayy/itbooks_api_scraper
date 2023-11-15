//ES6 Module syntax 
import http from 'node:http';
import https from 'node:https'; //for getting data from api.itbooks.store
import dotenv from 'dotenv';
dotenv.config()

function itbooksScrapeGetRequest(query) {
  let rawData = '';
  let humanReadable = '';
  https.get(`https://api.itbook.store/1.0/search/${query}`, (res) => {
  res.on('data', (chunk) => {
    rawData += chunk;
  });
  res.on('end', () => {
    humanReadable = JSON.parse(rawData);
    console.log("humanReadable: ", humanReadable);
  })
}).on('error', (e) => {
  console.error(e);
});
return humanReadable;
}


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
console.log(itbooksScrapeGetRequest("MongoDB"));