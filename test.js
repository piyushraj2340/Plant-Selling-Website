const http = require('http');

const options = {
  hostname: 'localhost',
  port: 8000,
  path: '/api/v2/nursery/plants/65eb53a5b6aa273ac2b4c28f/description-image',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer test'
  }
};

const req = http.request(options, res => {
  console.log(statusCode: );
  res.on('data', d => {
    process.stdout.write(d);
  });
});

req.on('error', error => {
  console.error(error);
});

req.end();
