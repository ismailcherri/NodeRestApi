# NodeRestApi
A small RESTful API built using Node.js only modules

## Requirements
- Node v8.* LTS or more
- OpenSSL to generate HTTPS certificate

## Installation
- Clone this repository
- Go to https folder `$ cd https`
- Create your HTTPS certificates with this command:  
 
`$ openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem`

## Starting the server
From root folder, run the following command:  
Staging:
- `$ node index.js`
  
Production:  
- `$ NODE_ENV=production node index.js`

## Api endpoints
- `/hello`: returns a welcome message (Code: 200)
- Any other route: returns an error message (Code: 404)

## Note
The code is written using ES6 conventions except for the import statements which are not fully supported yet by Node.