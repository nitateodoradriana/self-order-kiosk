import React from 'react';
import { Box, Card, CardActionArea, Typography } from '@material-ui/core';
import TouchAppIcon from '@material-ui/icons/TouchApp';
import { useStyles } from '../styles';
import Logo from '../components/Logo';

export default function HomeScreen(props) {
  const styles = useStyles();
  return (
    <Card>
      <CardActionArea onClick={() => props.history.push('/order')}>
        <Box className={[styles.root, styles.red].join(' ')}>
          <Box className={[styles.main, styles.center].join(' ')}>
            <Typography component="h6" variant="h6">
              Repede & Usor 
            </Typography>
            <Typography component="h1" variant="h1">
              Comanda <br /> & plateste <br /> aici
            </Typography>
            <TouchAppIcon fontSize="large"></TouchAppIcon>
          </Box>
          <Box className={[styles.center, styles.green].join(' ')}>
          <Logo large></Logo>
            <Typography component="h5" variant="h5">
              Atinge pentru a incepe
            </Typography>
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
}
