var path = require('path');
var fs = require('fs');
const contractPath = path.resolve(__dirname, 'abi.json');
const contractJson = fs.readFileSync(contractPath);
const abi = JSON.parse(contractJson);
console.log(abi);