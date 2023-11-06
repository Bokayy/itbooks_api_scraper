//ES6 Module syntax 
import http from 'node:http';
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


function makeHttpRequest(){

  const postData= {
    title: 'test',
    subtitle: 'test',
    isbn13: 'test',
    price: 'test',
    image: 'test',
    url: 'test',
  };

  const postOptions = {
    protocol: 'http:',
    hostname: 'localhost',
    port: 8080,
    method: 'POST',
    path:'/insert',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(JSON.stringify(postData)),
      //'Authorization': 'Basic TOKEN'
    },
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
            console.log('success')
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
    req.write(JSON.stringify(body));
    req.end();
});
  })
}

makeHttpRequest();

