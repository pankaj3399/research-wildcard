const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const { importCSV, importJSON, importXML, importFromAPI, importPDF } = require("../importData");
const Study = require('../models/StudySchema');

const router = express.Router();
const upload = multer({ dest: "data/" });

router.post("/upload", upload.single("file"), (req, res) => {
  const filename = req.file.path;
  const ext = req.file.originalname.split(".").pop();

  switch (ext) {
    case "csv":
      importCSV(filename) // Use the importCSV function from importData.js
        .then(data => createAndSaveStudy(data, res))
        .catch(error => res.status(500).json({ error: "Failed to parse CSV" }));
      break;
    case "xml":
      importXML(filename)
        .then(data => createAndSaveStudy(data, res))
        .catch(error => res.status(500).json({ error: "Failed to parse XML" }));
      break;
    case "json":
      importJSON(filename)
        .then(data => createAndSaveStudy(data, res))
        .catch(error => res.status(500).json({ error: "Failed to parse JSON" }));
      break;
    case "pdf":
      importPDF(filename)
        .then(data => {
          console.log(data); // Log the data from the PDF
          createAndSaveStudy(data, res);
        })
        .catch(error => res.status(500).json({ error: "Failed to parse PDF" }));
      break;
    default:
      res.status(400).json({ error: "Unsupported file format" });
  }
});

async function createAndSaveStudy(parsedData, res) {
  // Check if parsedData is an array and handle accordingly
  if (Array.isArray(parsedData)) {
    try {
      for (const data of parsedData) {
        const study = new Study(data);
        await study.save();
      }
      res.json({ message: 'Studies saved successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to save studies to database" });
    }
  } else {
    // Existing logic for a single study object
    const study = new Study(parsedData);
    try {
      console.log("Parsed data:", parsedData);
      console.log("Title:", parsedData.title);
      await study.save();
      res.json({ id: study._id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to save study to database" });
    }
  }
}


router.get("/pubmed/:id", async (req, res) => {
  const pmid = req.params.id;
  try {
    const data = await importFromAPI(pmid);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data from PubMed" });
  }
});

module.exports = router;