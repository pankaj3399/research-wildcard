import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import GlobalStyles from '@mui/material/GlobalStyles';
import Container from '@mui/material/Container';
import 'reactjs-popup/dist/index.css';
import "../../App.css";
import CssBaseline from '@mui/material/CssBaseline';


//import { Link, useHistory } from 'react-router-dom';


const OneProject = () => {
  const [projectData, setProjectData] = useState(null);
  const { projectId } = useParams();
  const navigate = useNavigate();

  const fetchProjectData = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3000/project/${projectId}`, {
        headers: { /* ... your auth headers if needed ... */ }
      });
      setProjectData(response.data); 
    } catch (error) {
      console.error('Error fetching project data:', error);
    }
  }, [projectId]); 

  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]); 

  

  const handleContinueTitle = () => {
    navigate(`/titleabstract/${projectId}`);
  };
  

  const handleContinueFullText = () => {
    navigate('/fulltext')
  };

  const handleContinueExtraction = () => {
    navigate('/extraction')
  };

  const tiers = [
    {
      title: 'Title & Abstract',
      progress: '30',
      description: [
        'You have screened 12 studies today',
        'Other reviewer has screened 9 studies',
        'Both reviewed 21 studies',
        '13 conflicts waiting to be resolved',
      ],
      buttonText: 'Continue Screening',
      buttonVariant: 'contained',
      onClick: handleContinueTitle,
    },
    {
      title: 'Full text',
      progress: '27',
      description: [
        'You have screened 6 studies today',
        'Other reviewer has screened 7 studies',
        'Both reviewed 13 studies',
        '2 conflicts waiting to be resolved',
      ],
      buttonText: 'Continue Screening',
      buttonVariant: 'contained',
      onClick: handleContinueFullText,
    },
    {
      title: 'Data Extraction',
      progress: '12',
      description: [
        'You have screened 4 studies today',
        'Other reviewer has screened 3 studies',
        'Both reviewed 7 studies',
        '3 conflicts waiting to be resolved',
      ],
      buttonText: 'Continue Extraction',
      buttonVariant: 'contained',
      onClick: handleContinueExtraction ,
    },
  ];

  const defaultTheme = createTheme();

  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
      <CssBaseline />
      
    <div className="MainContent">
      <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          {projectData ? projectData.title : 'Loading...'}
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" component="p">
          Welcome back, see your overall progress and continue screening
        </Typography>
      </Container>

      <Container maxWidth="md" component="main">
        <Grid container spacing={5} alignItems="flex-end">
          {tiers.map((tier) => (
            <Grid
              item
              key={tier.title}
              xs={12}
              sm={tier.title === 'Full text review' ? 12 : 6}
              md={4}
            >
              <Card sx={{height: '100%'}}> 
                <CardHeader
                  title={tier.title}
                  subheader={tier.subheader}
                  titleTypographyProps={{ align: 'center' }}
                  subheaderTypographyProps={{
                    align: 'center',
                  }}
                  sx={{
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'light'
                        ? theme.palette.grey[200]
                        : theme.palette.grey[700],
                  }}
                />
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'baseline',
                      mb: 2,
                    }}
                  >
                    <Typography component="h2" variant="h3" color="text.primary">
                      {tier.progress}%
                    </Typography>
                  </Box>
                  <ul>
                    {tier.description.map((line) => (
                      <Typography
                        component="li"
                        variant="subtitle1"
                        align="center"
                        key={line}
                      >
                        {line}
                      </Typography>
                    ))}
                  </ul>
                </CardContent>
                <CardActions>
                  <Button fullWidth variant={tier.buttonVariant} onClick={tier.onClick}>
                    {tier.buttonText}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      </div>
    </ThemeProvider>
  );
};

export default OneProject;
