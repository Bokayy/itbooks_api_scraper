//ES6 Module syntax 
import http from 'node:http';
import https from 'node:https'; //for getting data from api.itbooks.store

let url = `https://api.itbook.store/1.0/search/MongoDB`

const getNumberOfBooks = (url,page) => new Promise((resolve,reject) =>{
  if (!page){ //just give me the number of books
    https.get(url, res => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', ()=>{
        resolve(JSON.parse(data).total); //resolve is most likely a Promise specific kind of return
      });

      res.on('error', error => {
        reject(error);
      });
    });
  }
  https.get(`${url}/${page}`, res => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', ()=>{
      resolve(JSON.parse(data).books); //resolve is most likely a Promise specific kind of return
    });

    res.on('error', error => {
      reject(error);
    });
  });
});

let totalNumberOfBooks = await getNumberOfBooks(url);
//console.log(totalNumberOfBooks);

let numberOfNecessaryRequests = Math.ceil(totalNumberOfBooks / 10);
//console.log(numberOfNecessaryRequests);

//console.log(await getNumberOfBooks(url,2));

let booksArray = new Array();

for (let i = 1; i <= numberOfNecessaryRequests ; i++) {
  let currentArray = await getNumberOfBooks(url,i);
  booksArray.push(...currentArray);
}

//console.log(booksArray);

function sendPostRequest(){

  const postOptions = {
    'protocol': 'http:',
    'hostname': 'localhost',
    'port': 2339,
    'method': 'POST',
    'path':'/insert',
    'headers': {
      'Content-Type': 'application/json',
      //'Content-Length': Buffer.byteLength(JSON.stringify(postData)),
      'Accept': '*',
      //'Authorization': 'Basic TOKEN'
    },
  };

  return new Promise((resolve, reject) => {
    const req = http.request(postOptions, (res) => {
      let body = '';
      res.on('data', (chunk)=>{
            body+=chunk;
          });

      res.on('end', (data) => {
        if (res.statusCode / 2 === 100 ) {
            console.log('Scraper: success');
            console.log(body);
            resolve('Success');
            }
        else {
            console.log('failed')
            console.log("failed: ", res.statusCode);
            resolve('Failure');
        }
    });
    res.on('error', () => {
      console.log('error');
      reject(Error('HTTP call failed'));
    });
  });
  req.write(JSON.stringify(booksArray)); //the part that actually sends the request
  req.end();
});
};

sendPostRequest();

