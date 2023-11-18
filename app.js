//ES6 Module syntax 
import http from 'node:http';
import https from 'node:https'; //for getting data from api.itbooks.store

let url = `https://api.itbook.store/1.0/search/MongoDB`

const getNumberOfBooks = (url,page) => new Promise((resolve,reject) =>{
  if (!page){ //just give me the number of books
    https.get(url, res => {
      let getRequestData = '';
      res.on('data', (chunk) => {
        getRequestData += chunk;
      });

      res.on('end', ()=>{
        console.log("data:", getRequestData);
        if (getRequestData.length === 0){
          reject(Error("data empty"));
        }
        resolve(JSON.parse(getRequestData).total); //resolve is most likely a Promise specific kind of return
      });

      res.on('error', error => {
        reject(error);
      });
    });
  }
  else{
    https.get(`${url}/${page}`, res => {
      let getRequestData = '';
        res.on('data', (chunk) => {
          getRequestData += chunk;
        });

        res.on('end', ()=>{
          resolve(JSON.parse(getRequestData).books); //resolve is most likely a Promise specific kind of return
        });

        res.on('error', error => {
          reject(error);
        });
      });
    }
});


let booksArray = new Array();
async function populateBooks() {
  let totalNumberOfBooks = await getNumberOfBooks(url);
  let numberOfNecessaryRequests = Math.ceil(totalNumberOfBooks / 10);

  for (let i = 1; i <= numberOfNecessaryRequests ; i++) {
    let responseArray = await getNumberOfBooks(url,i);
    booksArray.push(...responseArray);
  }
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

  return new Promise(async (resolve, reject) => {
    const req = http.request(postOptions, (res) => {
      let body = '';
      res.on('data', (chunk)=>{ //recieves the response
            body+=chunk;
          });

      res.on('end', (data) => {
        if (res.statusCode / 2 === 100 ) {
            console.log('Scraper: success');
            console.log(body);
            resolve('Success'); //like return but for promises
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
  await populateBooks();
  console.log(booksArray);
  if (booksArray.length === 0) {
    reject(Error('books array empty'));
  }
  req.write(JSON.stringify(booksArray)); //the part that actually sends the request
  req.end();
});
};

await sendPostRequest();


