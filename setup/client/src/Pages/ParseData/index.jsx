import {
  Box,
  Button,
  Container,
  LinearProgress,
  Typography,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";

export const ParseDataPage = () => {
  const [selectedFile, setSelectedFile] = useState();
  const [resData, setResData] = useState();
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  console.log("FILE: ", selectedFile);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:3000/parse",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setResData(JSON.stringify(response.data));
      console.log(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApiData = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.get(
        "http://localhost:3000/parse/pubmed/12",
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setResData(JSON.stringify(response.data));
      console.log(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <Container
        maxWidth="sm"
        className="bg-white d-flex flex-column text-center justify-content-center align-items-center"
      >
        <Box className="p-3 rounded d-flex flex-column justify-content-center align-items-center">
          <Typography variant="h4" gutterBottom>
            Parse Data
          </Typography>
          <form onSubmit={handleSubmit} className="d-flex gap-1 mt-3">
            <div>
              <input
                accept=".csv,.xml,.json"
                style={{ display: "none" }}
                id="contained-button-file"
                multiple
                type="file"
                disabled={selectedFile}
                onChange={handleFileChange}
              />
              <label htmlFor="contained-button-file">
                <Button variant="contained" component="span">
                  Select File
                </Button>
              </label>
            </div>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="w-full"
            >
              Submit
            </Button>
          </form>
          <div>OR</div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="w-full"
            onClick={fetchApiData}
          >
            Fetch API Data
          </Button>
        </Box>
        {loading && <LinearProgress />}
        {resData && <Typography variant="body1">{resData}</Typography>}
      </Container>
    </Box>
  );
};
