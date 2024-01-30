import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[200],
      }}
    >
      <Container maxWidth="lg">
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="body1" color="textPrimary">&copy; 2024 TeamProject. All rights reserved.</Typography>
          </Grid>
          <Grid item>
            <Link href="#" color="inherit" sx={{ mr: 2 }}>First Link</Link>
            <Link href="#" color="inherit" sx={{ mr: 2 }}>Second Link</Link>
            <Link href="#" color="inherit" sx={{ mr: 2 }}>Third Link</Link>
            <Link href="#" color="inherit">Fourth Link</Link>
          </Grid>
          <Grid item>
            <IconButton href="#" color="inherit"><FacebookIcon /></IconButton>
            <IconButton href="#" color="inherit"><TwitterIcon /></IconButton>
            <IconButton href="#" color="inherit"><InstagramIcon /></IconButton>
            <IconButton href="#" color="inherit"><LinkedInIcon /></IconButton>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Footer;
