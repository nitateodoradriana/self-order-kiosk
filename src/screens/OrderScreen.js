import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogTitle,
  Grid,
  Typography,
  TextField,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { Store } from '../Store';
import { addToOrder, listProducts, removeFromOrder } from '../actions';
import { useStyles } from '../styles';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import Logo from '../components/Logo';
import { ORDER_CLEAR } from '../constants';

export default function OrderScreen(props) {
  const styles = useStyles();
  const navigate = useHistory();
  const [quantity, setQuantity] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState({});
  const [currentDrinkIndex, setCurrentDrinkIndex] = useState(0);

  const { state, dispatch } = useContext(Store);
  const { products = [], loading: loadingProducts, error: errorProducts } = state.productList;
  const { orderItems, itemsCount, totalPrice, taxPrice } = state.order;

  const closeHandler = () => {
    setIsOpen(false);
  };

  const productClickHandler = (p) => {
    setProduct(p);
    setQuantity(1);
    setIsOpen(true);
  };

  const addToOrderHandler = () => {
    addToOrder(dispatch, { ...product, quantity });
    setIsOpen(false);
    setCurrentDrinkIndex(currentDrinkIndex + 1);
  };

  const cancelOrRemoveFromOrder = () => {
    removeFromOrder(dispatch, product);
    setIsOpen(false);
  };

  useEffect(() => {
    listProducts(dispatch, '');
  }, [dispatch]);

  const finalizeOrderHandler = () => {
    dispatch({ type: 'ORDER_CREATE_SUCCESS', payload: state.order });
    props.history.push(`/review`);
  };

  // Handler pentru butonul Înapoi
  const handleBack = () => {
    dispatch({ type: ORDER_CLEAR }); // Curăță comanda
    navigate.push('/'); // Navighează înapoi la homepage
  };

  return (
    <Box className={styles.root}>
      <Dialog maxWidth="sm" fullWidth open={isOpen} onClose={closeHandler}>
        <DialogTitle className={styles.center}>Adaugă {product.name}</DialogTitle>
        <Box className={classNames(styles.row, styles.center)}>
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
            InputProps={{
              classes: {
                input: styles.largeInput,
              },
            }}
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
        <Box className={classNames(styles.row, styles.around)}>
          <Button
            onClick={cancelOrRemoveFromOrder}
            variant="contained"
            color="primary"
            size="large"
            className={styles.largeButton}
          >
            {orderItems.find((x) => x.name === product.name)
              ? 'Șterge din comandă'
              : 'Anulează'}
          </Button>
          <Button
            onClick={addToOrderHandler}
            variant="contained"
            color="secondary"
            size="large"
            className={styles.largeButton}
          >
            Adaugă în comandă
          </Button>
        </Box>
      </Dialog>
      <Box className={styles.main}>
        <Box className={styles.logoWithTitle}>
          <Logo className={styles.logo} />
          <Typography gutterBottom className={styles.title} variant="h2" component="h2">
            Meniul Principal
          </Typography>
        </Box>
        <Grid container spacing={0}>
          {loadingProducts ? (
            <CircularProgress />
          ) : errorProducts ? (
            <Alert severity="error">{errorProducts}</Alert>
          ) : (
            Array.isArray(products) && products.map((product) => (
              <Grid item md={6} key={product.name}>
                <Card className={styles.card} onClick={() => productClickHandler(product)}>
                  <CardActionArea>
                    <CardMedia component="img" alt={product.name} image={product.image} className={styles.media} />
                  </CardActionArea>
                  <CardContent>
                    <Typography gutterBottom variant="body2" color="textPrimary" component="p">
                      {product.name}
                    </Typography>
                    <Box className={styles.cardFooter}>
                      <Typography variant="body2" color="textSecondary" component="p">
                        {product.calorie} Cal
                      </Typography>
                      <Typography variant="body2" color="textPrimary" component="p">
                        {product.price} lei
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
      <Box>
        <Box>
          <Box className={classNames(styles.bordered, styles.space)}>
            Comanda dumneavoastră - TVA: {taxPrice} lei | Total: {totalPrice} lei | Articole: {itemsCount}😊
          </Box>
          <Box className={classNames(styles.row, styles.around)}>
            <Button
              onClick={handleBack} // Folosește handler-ul definit
              variant="contained"
              color="primary"
              className={styles.largeButton}
            >
              Înapoi
            </Button>
            <Button
              onClick={finalizeOrderHandler}
              variant="contained"
              color="secondary"
              className={styles.largeButton}
              disabled={orderItems.length === 0}
            >
              Finalizează comanda
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
