import React from 'react';
import { Paper, TextField, Typography, Divider, Button, ThemeProvider, createTheme } from '@mui/material';
import '../../App.css';
import SaveIcon from '@mui/icons-material/Save';
import { Link } from 'react-router-dom';

const theme = createTheme({
  typography: {
    fontFamily: [
      'Montserrat',
      'Roboto', 
    ].join(','),
  },
});



const FormPlaceholder = () => {
  return (
    <Paper style={{ padding: '10px', margin: '2px', height: '100%', overflowY: 'auto', width:'400px' }}>
      <ThemeProvider theme={theme}>
      <Typography variant="h6" gutterBottom>
        Study Details
      </Typography>
      <TextField  
        style={{ fontFamily: 'Montserrat' }}
        variant="filled"
        label="Sponsorship"
        fullWidth
        margin="normal"
      />
      
      <TextField
        variant="filled"
        label="Country"
        fullWidth
        margin="normal"
      />
      <TextField
        variant="filled"
        label="Setting"
        fullWidth
        margin="normal"
      />
      <TextField
        variant="filled"
        label="Comments"
        fullWidth
        margin="normal"
        multiline
        rows={4}
      />

      {/* Next section divide */}
      <Divider style={{ margin: '20px 0' }} />

      <Typography variant="h6" gutterBottom>
        Author's contact details
      </Typography>
      <TextField
        variant="filled"
        label="Author's name"
        fullWidth
        margin="normal"
      />
      
      <TextField
        variant="filled"
        label="Institution"
        fullWidth
        margin="normal"
      />
      <TextField
        variant="filled"
        label="Email"
        fullWidth
        margin="normal"
      />
      <TextField
        variant="filled"
        label="Address"
        fullWidth
        margin="normal"
      />
      <Divider style={{ margin: '10px 0' }} />

      <div style={{marginRight:'10px'}}>
        <Button component={Link} to="/oneproject/:projectId" variant="contained" startIcon={<SaveIcon />}>Save</Button>
      </div>
      
      
      </ThemeProvider>
    </Paper>
    
    
  );
};

export default FormPlaceholder;
