import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { Box, Button, CircularProgress, Typography } from '@material-ui/core';
import Logo from '../components/Logo';
import { useStyles } from '../styles';
import { useHistory } from 'react-router-dom';


const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');

export default function PaymentScreen() {
  const styles = useStyles();
  const [loading, setLoading] = useState(false);
  const [nfcScanning, setNfcScanning] = useState(false);
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const [error, setError] = useState('');
  const history = useHistory();
  const isMounted = useRef(true);

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
      history.push('/drink-preparation');
    }
  }, [paymentSuccessful, history]);

  const handlePayment = () => {
    setLoading(true);
    setNfcScanning(true);
  };

  return (
    <Box className={[styles.root, styles.navy].join(' ')}>
      <Box className={[styles.main, styles.center].join(' ')}>
        <Box>
          <Logo large />
          <Typography
            gutterBottom
            className={styles.title}
            variant="h3"
            component="h3"
          >
            Vă rugăm să apropiați cardul de NFC
          </Typography>
          {loading && <CircularProgress />}
          {error && <Typography color="error">{error}</Typography>}
        </Box>
      </Box>
      <Box className={[styles.center, styles.space].join(' ')}>
        <Button
          onClick={handlePayment}
          variant="contained"
          color="primary"
          className={styles.largeButton}
          disabled={loading || nfcScanning}
        >
          Plătește
        </Button>
      </Box>
    </Box>
  );
}
