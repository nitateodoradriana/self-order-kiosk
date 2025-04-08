import React, { useEffect } from 'react';
import { Box, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useStyles } from '../styles';
import coffeeCup from '../imagess/coffee-cup.jpeg';

export default function PlaceCupScreen() {
  const styles = useStyles();
  const history = useHistory();

  useEffect(() => {
    const timer = setTimeout(() => {
      history.push('/drink-preparation');  
    }, 5000);

    return () => clearTimeout(timer);
  }, [history]);

  return (
    <Box
      className={styles.PlaceCupScreen}
      style={{
        backgroundImage: `url(${coffeeCup})`, 
      }}
    >
      <div className={styles.textContainer}>
        <Typography variant="h3" className={styles.placeCupText}>
        👇Așează paharul potrivit pentru cafeaua ta👇
        </Typography>
      </div>
    </Box>
  );
}
