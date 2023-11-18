//ES6 Module syntax 
import http, { get } from 'node:http';
import https from 'node:https'; //for getting data from api.itbooks.store

let url = `https://api.itbook.store/1.0/search/MongoDB`

const getBooks = (url,page) => new Promise((resolve,reject) =>{
  if (!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!page){
    url += `/${page}`;
  }
  https.get(url, res => {
    let getRequestData = '';

    res.on('data', (chunk) => {
      getRequestData += chunk;
    });

    res.on('end', ()=>{
      let json = JSON.parse(getRequestData);
      if (!page) 
        resolve(json.total); //just give me the number of books     
      else
        resolve(json.books); 
    });

    res.on('error', error => {
      reject(error);
    });
  });
});


let booksArray = new Array();
async function populateBooks() {
  let totalNumberOfBooks = await getBooks(url);
  let numberOfNecessaryRequests = Math.ceil(totalNumberOfBooks / 10);

  for (let i = 1; i <= numberOfNecessaryRequests ; i++) {
    let responseArray = await getBooks(url,i);
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
            resolve('Success'); //like return but for promises
            }
        else {
            console.log("failed: ", res.statusCode);
            resolve('Failure');
        }
    });
    res.on('error', () => {
      reject(Error('HTTP call failed'));
    });
  });
  await populateBooks();
  if (booksArray.length === 0) {
    reject(Error('books array empty'));
  }
  req.write(JSON.stringify(booksArray)); //the part that actually sends the request
  req.end();
});
};

await sendPostRequest();


