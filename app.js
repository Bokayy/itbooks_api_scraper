//ES6 Module syntax 
import http from 'node:http';
import dotenv from 'dotenv';
dotenv.config()


function makeHttpRequest(){

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

  const postData= 
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
    console.log(body);
  });
  //req.write(JSON.stringify(body));
  req.end();
});
};
//makeHttpGetRequest();
makeHttpRequest();