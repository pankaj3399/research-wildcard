// importData.js

const fs = require('fs');
const csv = require('csv-parser');
const xml2js = require('xml2js');
const axios = require('axios');

//eplace 'data.csv', 'data.xml', 'data.json', and 'https://api-url'
//with the paths to your actual files or the actual API URL.

async function importCSV() {
  return new Promise((resolve, reject) => {
    const data = [];
    fs.createReadStream('data.csv')
      .pipe(csv())
      .on('data', (row) => {
        data.push(row);
      })
      .on('end', () => {
        resolve(data);
      })
      .on('error', reject);
  });
}

async function importXML() {
  const data = await fs.promises.readFile('data.xml', 'utf-8');
  const result = await xml2js.parseStringPromise(data);
  return result;
}

async function importJSON() {
  const data = await fs.promises.readFile('data.json', 'utf-8');
  return JSON.parse(data);
}

async function importFromAPI() {
  const response = await axios.get('https://api-url');
  return response.data;
}

module.exports = { importCSV, importXML, importJSON, importFromAPI };