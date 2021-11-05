const fs = require('fs');
const parseCSV = require('csv-parse/lib/sync');

const toObject = (csvFilePath) => {
    try {
        const fileToUpload = fs.readFileSync(csvFilePath);
        const records = parseCSV(fileToUpload, {
            columns: true,
            skip_empty_lines: true
        });
        return records;
    } catch (e) {
        console.log('Unable to convert CSV file to JSON', { e });
    }
};

module.exports = {
    toObject,
}