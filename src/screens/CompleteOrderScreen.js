import { Box, Button, CircularProgress, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { useContext, useEffect, useState } from 'react';
import { createOrder } from '../actions';
import Logo from '../components/Logo';
import { Store } from '../Store';
import { useStyles } from '../styles';

export default function CompleteOrderScreen(props) {
  const styles = useStyles();
  const { state, dispatch } = useContext(Store);
  const { order } = state;
  const { loading, error, newOrder } = state.orderCreate;

  const [displayedText, setDisplayedText] = useState('');
  const fullText = 'Multumesc!';
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  useEffect(() => {
    if (order.orderItems.length > 0) {
      createOrder(dispatch, order);
    }
  }, [order, dispatch]);

  useEffect(() => {
    let index = 0;
    const speed = 150; 
    let intervalId;

    if (!isButtonClicked) {
      intervalId = setInterval(() => {
        if (index < fullText.length) {
          setDisplayedText((prev) => prev + fullText.charAt(index));
          index++;
        } else {
          clearInterval(intervalId); 
        }
      }, speed);
    }

    return () => clearInterval(intervalId); 
  }, [isButtonClicked]);

  useEffect(() => {
    const timer = setTimeout(() => {
      props.history.push('/'); // Redirecționează către home screen
    }, 60000); // 120000 ms = 2 minute

    return () => clearTimeout(timer); 
  }, [props.history]);

  const handleButtonClick = () => {
    setIsButtonClicked(true);
    props.history.push('/'); 
  };

  return (
    <Box className={`${styles.root} ${styles.navy}`}>
      <Box className={`${styles.main} ${styles.center}`}>
        <Box>
          <Logo large />
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            newOrder && newOrder.number ? (
              <>
                <Typography
                  gutterBottom
                  className={styles.title}
                  variant="h3"
                  component="h3"
                >
                  Comanda efectuata cu succes😉
                </Typography>
                <Typography
                  gutterBottom
                  className={styles.title}
                  variant="h1"
                  component="h1"
                >
                  {displayedText} {}
                </Typography>
                <Typography
                  gutterBottom
                  className={styles.title}
                  variant="h3"
                  component="h3"
                >
                  Numarul comenzii tale este {newOrder.number}
                </Typography>
              </>
            ) : (
              <Alert severity="error">Numărul comenzii nu este disponibil. Vă rugăm să încercați din nou.</Alert>
            )
          )}
        </Box>
      </Box>
      <Box className={`${styles.center} ${styles.space}`}>
        <Button
          onClick={handleButtonClick}
          variant="contained"
          color="primary"
          className={styles.largeButton}
        >
          Comanda din nou
        </Button>
      </Box>
    </Box>
  );
}
