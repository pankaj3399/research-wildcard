import React, { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import GlobalStyles from '@mui/material/GlobalStyles';
import Container from '@mui/material/Container';
import Modal from 'react-modal';
import 'reactjs-popup/dist/index.css';
import TitleScreen from './TitleScreen';
import CloseIcon from '@mui/icons-material/Close';

const OneProject = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleContinueTitle = () => {
    console.log('Continuing Screening');
    openModal(); // Open the modal
  };

  const handleContinueIntro = () => {
    console.log('Button 2 clicked');
  };

  const handleContinueFull = () => {
    console.log('Button 3 clicked');
  };

  const tiers = [
    {
      title: 'Title review',
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
      title: 'Introduction review',
      progress: '27',
      description: [
        'You have screened 6 studies today',
        'Other reviewer has screened 7 studies',
        'Both reviewed 13 studies',
        '2 conflicts waiting to be resolved',
      ],
      buttonText: 'Continue Screening',
      buttonVariant: 'contained',
      onClick: handleContinueIntro,
    },
    {
      title: 'Full text review',
      progress: '12',
      description: [
        'You have screened 4 studies today',
        'Other reviewer has screened 3 studies',
        'Both reviewed 7 studies',
        '3 conflicts waiting to be resolved',
      ],
      buttonText: 'Continue Screening',
      buttonVariant: 'contained',
      onClick: handleContinueFull,
    },
  ];

  const defaultTheme = createTheme();

  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
      <CssBaseline />

      <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          Project A
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
              <Card>
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

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Create New Project"
        style={{
          content: {
            width: '80%',
            height: '80%',
            margin: 'auto',
          },
        }}
      >
          <button className="CloseButton" onClick={closeModal}>
          <CloseIcon />
          </button>
       
        <TitleScreen />
      </Modal>
    </ThemeProvider>
  );
};

export default OneProject;
