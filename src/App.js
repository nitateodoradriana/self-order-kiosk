import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Container, createTheme, CssBaseline, Paper, ThemeProvider } from '@material-ui/core';
import AdminScreen from './screens/AdminScreen';
import PlaceCupScreen from './screens/PlaceCupScreen';
import CompleteOrderScreen from './screens/CompleteOrderScreen';
import HomeScreen from './screens/HomeScreen';
import OrderScreen from './screens/OrderScreen';
import PaymentScreen from './screens/PaymentScreen';
import DrinkPreparation from './screens/DrinkPreparation'; // Am adăugat importul pentru DrinkPreparation
import QueueScreen from './screens/QueueScreen';
import ReviewScreen from './screens/ReviewScreen';

import { StoreProvider, Store } from './Store'; // Importă StoreProvider
import { useStyles } from './styles';

const theme = createTheme({
  typography: {
    h1: { fontWeight: 'bold' },
    h2: {
      fontSize: '2rem',
      color: 'black',
    },
    h3: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      color: 'white',
    },
  },
  palette: {
    primary: { main: '#ff1744' },
    secondary: {
      main: '#118e16',
      contrastText: '#ffffff',
    },
  },
});

function App() {
  const { state } = React.useContext(Store);
  const styles = useStyles();

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <StoreProvider> {/* Învăluie aplicația cu StoreProvider */}
          <Container maxWidth={state.widthScreen ? 'lg' : 'sm'}>
            <Paper className={styles.paper}>
              <Switch>
                <Route path="/" component={HomeScreen} exact />
                <Route path="/order" component={OrderScreen} exact />
                <Route path="/review" component={ReviewScreen} exact />
               
                <Route path="/payment" component={PaymentScreen} />
               
                <Route path="/place-cup" component={PlaceCupScreen} /> 
                <Route path="/drink-preparation" component={DrinkPreparation} />
                <Route path="/complete" component={CompleteOrderScreen} />
                <Route path="/admin" component={AdminScreen} />
                <Route path="/queue" component={QueueScreen} />
                
              </Switch>
            </Paper>
          </Container>
        </StoreProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;