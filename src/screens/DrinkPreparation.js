import React, { useState, useEffect, useContext } from 'react';
import { Store } from '../Store';
import './DrinkPreparation.css';
import spinner from '../imagess/spinner.gif';
import checkmark from '../imagess/checkmark.gif';
import { useHistory } from 'react-router-dom';

const DrinkPreparation = () => {
  const [isReady, setIsReady] = useState(false);
  const { state, dispatch } = useContext(Store);
  const history = useHistory();
  const { orderItems, currentDrinkIndex } = state.order;
  const currentDrink = orderItems[currentDrinkIndex] || {};

  useEffect(() => {
    console.log('Order Items:', orderItems);
    console.log('Current Drink Index:', currentDrinkIndex);

    if (orderItems.length === 0 || currentDrinkIndex >= orderItems.length) {
      console.log('No drinks to prepare or index out of bounds. Redirecting to /complete.');
      dispatch({ type: 'ORDER_PREPARE_COMPLETE' });
      history.push('/complete');
      return;
    }

    setIsReady(false);
    const preparationTimer = setTimeout(() => {
      setIsReady(true);
    }, 3000);

    return () => {
      clearTimeout(preparationTimer);
    };
  }, [currentDrinkIndex, orderItems, dispatch, history]);

  useEffect(() => {
    if (isReady) {
      const redirectTimer = setTimeout(() => {
        console.log('Dispatching ORDER_PREPARE_NEXT');
        dispatch({ type: 'ORDER_PREPARE_NEXT' });

        if (state.order.allDrinksPrepared) {
          history.push('/complete');
        } else {
          history.push('/place-cup');
        }
      }, 2000);

      return () => {
        clearTimeout(redirectTimer);
      };
    }
  }, [isReady, dispatch, history, state.order.allDrinksPrepared]);

  return (
    <div className="drink-preparation-container">
      <div className="content">
        {currentDrink && (
          <div className="preparing-text">
            {isReady ? (
              `Savurați: ${currentDrink.name} (${currentDrink.quantityPrepared + 1}/${currentDrink.quantity})`
            ) : (
              `În pregătire: ${currentDrink.name} (${currentDrink.quantityPrepared + 1}/${currentDrink.quantity})...`
            )}
          </div>
        )}
      </div>
      <img
        src={isReady ? checkmark : spinner}
        alt={isReady ? "Checkmark" : "Loading..."}
        className="spinner"
      />
    </div>
  );
};

export default DrinkPreparation;
