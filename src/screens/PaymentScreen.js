import React, { useState, useEffect, useRef, useContext } from 'react';
import io from 'socket.io-client';
import { Box, Button, CircularProgress, Typography } from '@material-ui/core';
import Logo from '../components/Logo';
import { useStyles } from '../styles';
import { useHistory } from 'react-router-dom'; 
import { Store } from '../Store'; 
import { ORDER_CLEAR } from '../constants'; 

const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');

export default function PaymentScreen() {
  const styles = useStyles();
  const [loading, setLoading] = useState(false);
  const [nfcScanning, setNfcScanning] = useState(false);
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const [error, setError] = useState('');
  const isMounted = useRef(true);
  const history = useHistory(); 
  const { dispatch } = useContext(Store); 

  useEffect(() => {
    isMounted.current = true;

    const handleNfcCard = uid => {
      if (isMounted.current) {
        setPaymentSuccessful(true);
        setLoading(false);
        setNfcScanning(false);
        console.log(`Card detected with UID: ${uid}`);
      }
    };

    const handleError = error => {
      if (isMounted.current) {
        console.error('WebSocket error:', error);
        setError('A apărut o eroare de conexiune. Vă rugăm să încercați din nou.');
        setLoading(false);
        setNfcScanning(false);
      }
    };

    socket.on('nfc-card', handleNfcCard);
    socket.on('error', handleError);

    return () => {
      isMounted.current = false;
      socket.off('nfc-card', handleNfcCard);
      socket.off('error', handleError);
    };
  }, []);

  useEffect(() => {
    if (paymentSuccessful) {
      history.push('/place-cup'); 
    }
  }, [paymentSuccessful, history]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!paymentSuccessful) {
        dispatch({ type: ORDER_CLEAR });
        history.push('/'); // Redirecționează către home screen
      }
    }, 60000); 

    return () => clearTimeout(timer);
  }, [paymentSuccessful, history, dispatch]);

  const handlePayment = () => {
    setLoading(true);
    setNfcScanning(true);
  };

  const handleCancel = () => {
    dispatch({ type: ORDER_CLEAR }); 
    history.push('/'); 
  };

  return (
    <Box className={[styles.root, styles.navy].join(' ')}>
      <Box className={[styles.main, styles.center].join(' ')}>
        <Box>
          <Logo large />
          <Typography gutterBottom className={styles.title} variant="h3" component="h3">
            Vă rugăm să apropiați cardul 💳
          </Typography>
          {loading && <CircularProgress />}
          {error && <Typography color="error">{error}</Typography>}
        </Box>
      </Box>
      <Box className={[styles.center, styles.space].join(' ')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
        <Button
          onClick={handlePayment}
          variant="contained"
          color="secondary" // Set the button color to green
          className={styles.largeButton}
          style={{ marginBottom: '5px' }} // Adjust spacing
          disabled={loading || nfcScanning}
        >
          Plătește
        </Button>
        <Typography 
          onClick={handleCancel} 
          style={{ color: 'red', textDecoration: 'underline', cursor: 'pointer' }} 
          align="center" // Center the text
        >
          Renunță
        </Typography>
      </Box>
    </Box>
  );
};
