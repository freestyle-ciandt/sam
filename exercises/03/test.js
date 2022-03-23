// const csv = require('csv-parser');
// const fs = require('fs');


// const results = [];

// const products = fs.createReadStream('produtos.csv')
//   .pipe(csv({}))
//   .on('data', (data) => results.push(data))
//   .on('end', () => {
//     console.log(results)
//   })
const {parse} = require('csv-parse/dist/cjs/sync.cjs');

const input = `
"key_1","key_2"
"value 1","value 2"
`;
const records = parse(input, {
  columns: true,
  skip_empty_lines: true
});

console.log(records)