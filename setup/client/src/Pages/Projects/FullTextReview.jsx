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
import CriteriaSection from './CriteriaSection';

const FullTextReview = () => {
  const fullScreenPluginInstance = fullScreenPlugin();

  return (
    <>
      <div style={{ width: 'calc(100% - 300px)', overflow: 'auto', fontWeight: '300', marginLeft: '300px', marginTop: '30px', fontSize: '30pt' }}>
        Full Text Review
        <div style={{ float: 'right', marginRight: '20px' }}>
          <Button component={Link} to="/oneproject/:projectId" variant="contained" startIcon={<UndoIcon />}>Back</Button>
        </div>
      </div>
      
      <div style={{ display: 'flex', height: '100vh', marginTop: '30px', marginLeft: '270px' }}>
        {/* PDF Viewer */}
        <div style={{ flex: 1 }}>
          <Paper elevation={3} style={{ height: '100vh', marginRight: '100px' }}>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer
                fileUrl="pdfarticle.pdf"
                plugins={[fullScreenPluginInstance]} />
            </Worker>
          </Paper>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '10px', marginRight:'100px', marginTop:'20px' }}>
          <Button variant="outlined" size="large">Accept</Button>
          <Button variant="outlined" size="large">Delete</Button>
          <CriteriaSection/>

        </div>
      </div>
    </>
  );
};

export default FullTextReview;