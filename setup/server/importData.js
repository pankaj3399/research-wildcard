// importData.js

const fs = require("fs");
const csv = require("csv-parser");
const xml2js = require("xml2js");
const axios = require("axios");
const PDFParser = require("pdf2json");



async function importCSV(filename) {
  return new Promise((resolve, reject) => {
    const data = [];
    fs.createReadStream(filename)
      .pipe(csv())
      .on("data", (row) => {
        // Convert the row data to the correct format, checking for undefined fields
        const formattedRow = {
          title: row.Title || "Untitled", // Default title if undefined
          authors: row.Authors ? row.Authors.split(', ') : [],
          abstract: row.abstract || "", // Default abstract if undefined
          publicationDate: row.Publication_Year ? new Date(row.publicationDate) : new Date(), // Default to current date if undefined
          fullTextLink: row.fullTextLink || "", // Default link if undefined
          pubmedId: row.PMID || "", // Default ID if undefined
          // ...any other relevant fields...
        };
        data.push(formattedRow);
      })
      .on("end", () => {
        resolve(data);
      })
      .on("error", reject);
  });
}


async function importXML(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {

      if (err) return reject(err);

      xml2js.parseString(data, (err, result) => {
        if (err) return reject(err);

        // Check if the expected document structure is present
        if (!result || !result.collection || !result.collection.document) {
          return reject(new Error("Invalid XML structure"));
        }

        const documents = result.collection.document;
        const formattedData = documents.map(document => {
          // Initialize default values to avoid undefined errors
          let title = "Untitled";
          if (document.ArticleTitle && document.ArticleTitle[0]) {
            title = document.Infon.Title[0];
          }

          let pubmedId = "";
          if (document.PMID && document.PMID[0]) {
            pubmedId = document.PMID[0];
          }
          let authors = [];
          if (document.AuthorList && document.AuthorList[0].Author) {
            authors = document.AuthorList[0].Author.map(author => author.CollectiveName ? author.CollectiveName[0] : "Anonymous");
          }

          let abstract = "";
          if (document.Abstract && document.Abstract[0]) {
            abstract = document.Abstract[0];
          }

          // Assuming ArticleDate is directly under document, adjust based on actual structure
          let publicationDate = new Date();
          if (document.ArticleDate && document.ArticleDate[0]) {
            const date = document.ArticleDate[0];
            publicationDate = new Date(date.Year[0], date.Month[0] - 1, date.Day[0]);
          }

          return { title, authors, abstract, publicationDate, pubmedId };
        });

        resolve(formattedData); // Adjust based on how you want to handle multiple documents
      });
    });
  });
}


async function importJSON(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, "utf8", (err, data) => {
      if (err) reject(err);
      else {
        try {
          const parsedData = JSON.parse(data);
          
          // Convert the parsed JSON data to the correct format
          const formattedData = {
            title: parsedData.text,
            authors: parsedData.authors,
            abstract: parsedData.abstract,
            publicationDate: new Date(parsedData.publicationDate),
            fullTextLink: parsedData.fullTextLink,
            PubMed: document.pubmedId ? document.pubmedId[0] : undefined,
            // ...any other relevant fields...
          };
          resolve(formattedData);
        } catch (e) {
          reject(e);
        }
      }
    });
  });
}

async function importPDF(filename) {
  return new Promise((resolve, reject) => {
    let pdfParser = new PDFParser();
    pdfParser.on("pdfParser_dataError", reject);
    pdfParser.on("pdfParser_dataReady", async pdfData => {
      try {
        const formattedData = {
          title: pdfData.formImage.Pages[0].Texts[0].R[0].T,
          abstract: pdfData.formImage.Pages[0].Texts[1].R[0].T,
          pubmedId: pdfData.formImage.Pages[0].Texts[2].R[0].T,

        };
        resolve(formattedData);
      } catch (e) {
        reject(e);
      }
    });
    pdfParser.loadPDF(filename);
  });
}
   



async function importFromAPI(id) {
  const url = `https://www.ncbi.nlm.nih.gov/research/bionlp/RESTful/pubmed.cgi/BioC_json/${id}/unicode`;
  const response = await axios.get(url);
  return response.data;
}

module.exports = { importCSV, importXML, importJSON, importFromAPI, importPDF };