import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { addToOrder, removeFromOrder } from '../actions';
import { Store } from '../Store';
import { useStyles } from '../styles';
import Logo from '../components/Logo';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';

export default function ReviewScreen() {
  const { state, dispatch } = useContext(Store);
  const {
    order: { orderItems, itemsCount, totalPrice, taxPrice },
  } = state;
  const history = useHistory();
  const [quantity, setQuantity] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState({});

  const addToOrderHandler = () => {
    const existingItem = orderItems.find((x) => x.name === item.name);
    
    if (existingItem) {
      const updatedItem = { ...existingItem, quantity };
      addToOrder(dispatch, updatedItem);
    } else {
      addToOrder(dispatch, { ...item, quantity });
    }
    
    setIsOpen(false);
  };

  const itemClickHandler = (i) => {
    setItem(i);
    setQuantity(i.quantity);
    setIsOpen(true);
  };

  const closeHandler = () => {
    setIsOpen(false);
    setQuantity(1);
  };

  const cancelOrRemoveFromOrder = () => {
    removeFromOrder(dispatch, item);
    setIsOpen(false);
  };

  const procedToCheckoutHandler = () => {
    history.push('/payment');
  };

  const styles = useStyles();

  return (
    <Box className={styles.root}>
      <Box className={[styles.main, styles.navy].join(' ')}>
        {/* Muta acest bloc mai sus */}
        <Box className={[styles.top, styles.column].join(' ')}>
          <Logo large />
          <Typography gutterBottom className={styles.top} variant="h3" component="h3">
            Comanda dumneavoastră
          </Typography>
        </Box>

        <Dialog maxWidth="sm" fullWidth={true} open={isOpen} onClose={closeHandler}>
          <DialogTitle className={styles.center}>
            Editeaza {item.name}
          </DialogTitle>
          <Box className={[styles.row, styles.center].join(' ')}>
            <Button
              variant="contained"
              color="primary"
              disabled={quantity === 1}
              onClick={() => quantity > 1 && setQuantity(quantity - 1)}
            >
              <RemoveIcon />
            </Button>
            <TextField
              inputProps={{ className: styles.largeInput }}
              className={styles.largeNumber}
              type="number"
              variant="filled"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => setQuantity(quantity + 1)}
            >
              <AddIcon />
            </Button>
          </Box>
          <Box className={[styles.row, styles.around].join(' ')}>
            <Button
              onClick={cancelOrRemoveFromOrder}
              variant="contained"
              color="primary"
              size="large"
              className={styles.largeButton}
            >
              {orderItems.find((x) => x.name === item.name) ? 'Sterge din comanda' : 'Anuleaza'}
            </Button>
            <Button
              onClick={addToOrderHandler}
              variant="contained"
              color="secondary"
              size="large"
              className={styles.largeButton}
            >
              Actualizeaza comanda
            </Button>
          </Box>
        </Dialog>

        <Grid container>
          {orderItems.map((orderItem) => (
            <Grid item md={12} key={orderItem.name}>
              <Card className={styles.card} onClick={() => itemClickHandler(orderItem)}>
                <CardActionArea>
                  <CardContent>
                    <Box className={[styles.row, styles.between].join(' ')}>
                      <Typography gutterBottom variant="body2" color="textPrimary" component="p">
                        {orderItem.name}
                      </Typography>
                      <Button variant="contained">Editeaza</Button>
                    </Box>
                    <Box className={[styles.row, styles.between].join(' ')}>
                      <Typography variant="body2" color="textSecondary" component="p">
                        {orderItem.calorie} Cal
                      </Typography>
                      <Typography variant="body2" color="textPrimary" component="p">
                        {orderItem.quantity} x {orderItem.price} lei
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box>
        <Box>
          <Box className={[styles.bordered, styles.space].join(' ')}>
            Comanda dumneavoastră - TVA: {taxPrice} lei | Total: {totalPrice} lei | Articole: {itemsCount}😊
          </Box>
          <Box className={[styles.row, styles.around].join(' ')}>
            <Button
              onClick={() => history.push('/order')}
              variant="contained"
              color="primary"
              className={styles.largeButton}
            >
              Inapoi
            </Button>
            <Button
              onClick={procedToCheckoutHandler}
              variant="contained"
              color="secondary"
              disabled={orderItems.length === 0}
              className={styles.largeButton}
            >
              Finalizează
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
