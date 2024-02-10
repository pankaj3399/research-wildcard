import React from 'react';
import { Paper } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const CriteriaSection = () => {
  const criteriaContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
    
  };

  const individualCriteriaStyle = {
    display: 'flex',
    flexDirection: 'column', 
    alignItems: 'center', 
    marginRight: '20px',
    marginTop:'0px' 
  };

  const acceptCriteriaDetails = [
    "number 1",
    "number 2",
    "num",
    "test",
  ];

  const declineCriteriaDetails = [
    "number 1",
    "testing 2",
  ];

  return (
    <Paper elevation={3} style={{ padding: '15px', marginTop: '60px', width: '400px', position: 'absolute' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Review Criteria</h3>
      <div style={criteriaContainerStyle}>

        {/* Accept Criteria */}
        <div style={individualCriteriaStyle}>
          <CheckIcon style={{ color: 'green' }} />
          <span style={{marginBottom: '10px', fontWeight:'bold'}}>Accept Criteria</span>
          {acceptCriteriaDetails.map((detail, index) => (
            <div key={index}>{detail}</div>
          ))}
        </div>

        {/* Reject Criteria */}
        <div style={individualCriteriaStyle}>
          <CloseIcon style={{ color: 'red' }} />
          <span style={{marginBottom: '10px', fontWeight:'bold'}}>Decline Criteria</span>
          {declineCriteriaDetails.map((detail, index) => (
            <div key={index}>{detail}</div>
          ))}
        </div>
      </div>
    </Paper>
  );
};

export default CriteriaSection;
