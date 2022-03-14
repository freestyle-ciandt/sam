const csv = require('csv-parser');
const fs = require('fs');


const results = [];

const products = fs.createReadStream('produtos.csv')
  .pipe(csv({}))
  .on('data', (data) => results.push(data))
  .on('end', () => {
    console.log(results)
  })