// importData.js

const fs = require("fs");
const csv = require("csv-parser");
const xml2js = require("xml2js");
const axios = require("axios");

//eplace 'data.csv', 'data.xml', 'data.json', and 'https://api-url'
//with the paths to your actual files or the actual API URL.

// async function importCSV(req, res) {
//   return new Promise((resolve, reject) => {
//     const data = [];
//     fs.createReadStream("data.csv")
//       .pipe(csv())
//       .on("data", (row) => {
//         data.push(row);
//       })
//       .on("end", () => {
//         resolve(data);
//       })
//       .on("error", reject);
//   });
// }

async function importXML(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if (err) reject(err);
      else {
        xml2js.parseString(data, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      }
    });
  });
}

async function importJSON(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, "utf8", (err, data) => {
      if (err) reject(err);
      else {
        try {
          const obj = JSON.parse(data);
          resolve(obj);
        } catch (e) {
          reject(e);
        }
      }
    });
  });
}

async function importFromAPI(id) {
  const url = `https://www.ncbi.nlm.nih.gov/research/bionlp/RESTful/pubmed.cgi/BioC_json/${id}/unicode`;
  const response = await axios.get(url);
  return response.data;
}

module.exports = { importXML, importJSON, importFromAPI };
