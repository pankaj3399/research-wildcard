const express = require("express");
const multer = require("multer");
const csv = require("fast-csv");
const fs = require("fs");
const { importJSON, importXML, importFromAPI } = require("../importData");

const router = express.Router();
const upload = multer({ dest: "data/" });

router.post("/", upload.single("file"), async (req, res) => {
  const filename = req.file.path;
  const ext = req.file.originalname.split(".").pop();
  let parsedData;

  // Determine the file format based on the file extension
  switch (ext) {
    case "csv":
      const fileRows = [];
      // Open uploaded file
      csv
        .parseFile(filename)
        .on("data", function (data) {
          fileRows.push(data); // Push each row
        })
        .on("end", function () {
          console.log(fileRows);
          fs.unlinkSync(filename); // Remove temp file
          // Process "fileRows" and respond
          parsedData = fileRows;
        });
      break;
    case "xml":
      try {
        parsedData = await importXML(filename);
      } catch (error) {
        res.status(500).json({ error: "Failed to parse XML" });
        return;
      }
      break;
    case "json":
      try {
        parsedData = await importJSON(filename);
      } catch (error) {
        res.status(500).json({ error: "Failed to parse JSON" });
        return;
      }
      break;
    default:
      res.status(400).json({ error: "Unsupported file format" });
      return;
  }

  // Send the parsed data as the response
  res.json(parsedData);
});

// If you want 3 routes based on files format
// router.post("/upload-csv", upload.single("file"), function (req, res) {
//   const fileRows = [];

//   // open uploaded file
//   csv
//     .parseFile(req.file.path)
//     .on("data", function (data) {
//       fileRows.push(data); // push each row
//     })
//     .on("end", function () {
//       console.log(fileRows);
//       fs.unlinkSync(req.file.path); // remove temp file
//     });
// });
// router.post("/parseXml", upload.single("file"), async (req, res) => {
//   const filename = req.file.path;
//   try {
//     const parsedData = await importXML(filename);
//     res.json(parsedData);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to parse XML" });
//   }
// });
// router.post("/parseJson", upload.single("file"), async (req, res) => {
//   const filename = req.file.path;
//   try {
//     const parsedData = await importJSON(filename);
//     res.json(parsedData);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to parse JSON" });
//   }
// });

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
