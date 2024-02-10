import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Paper, Button } from '@mui/material';
import '../../App.css';
import UndoIcon from '@mui/icons-material/Undo';
import { Link } from 'react-router-dom';
import { fullScreenPlugin } from '@react-pdf-viewer/full-screen';
import FormPlaceholder from './FormPlaceholder';


const PDFViewer = () => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const fullScreenPluginInstance = fullScreenPlugin();

  return (
    <><div style={{ width: 'calc(100% - 300px)', height: '100%', overflow: 'auto', fontWeight:'300' , marginLeft:'300px', marginTop:'30px', fontSize:'30pt', display:'flex'}}>
      Extraction
      <div style={{ marginRight:'20px', height:'100%'}}>
      <Button component={Link} to="/oneproject/:projectId" variant="contained" startIcon={<UndoIcon />}>Back</Button>
      </div>
      
    </div><div style={{ display: 'flex', height: '100vh', marginTop: '30px', marginLeft: '250px' }}>
        {/* PDF Viewer */}
        <Paper elevation={3} style={{ width: 'calc(100vw - 250px - 500px)', height: '100vh', overflow: 'hidden' }}>
          {/* Width = full width - sidebar- right placeholder */}
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Viewer
              fileUrl="pdfarticle.pdf"
              plugins={[fullScreenPluginInstance]} />
          </Worker>
        </Paper>

        {/* Form Placeholder */}
        <div style={{ width: '400px', height: '100%', overflow: 'auto' }}>
          <FormPlaceholder />
        </div>
      </div></>
  );
};

export default PDFViewer;
