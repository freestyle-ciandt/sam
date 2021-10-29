
const parse = require('csv-parse/lib/sync');
const { readFileSync } = require('fs');

const input = readFileSync('./produtos.csv', { encoding: 'utf-8' } )

const records = parse(input, {
  columns: true,
  skip_empty_lines: true
})

exports.handler = () => {

}