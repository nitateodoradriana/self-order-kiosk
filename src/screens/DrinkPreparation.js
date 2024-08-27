import React, { useState, useEffect, useContext } from 'react';
import { Store } from '../Store';
import './DrinkPreparation.css';
import spinner from '../imagess/spinner.gif';
import checkmark from '../imagess/checkmark.gif';

const DrinkPreparation = (props) => {
  const [isReady, setIsReady] = useState(false);
  const { state, dispatch } = useContext(Store);
  const { orderItems, currentDrinkIndex } = state.order;
  const currentDrink = orderItems[currentDrinkIndex] || {}; // Default to empty object

  useEffect(() => {
    if (orderItems.length === 0 || currentDrinkIndex >= orderItems.length) {
      dispatch({ type: 'ORDER_PREPARE_COMPLETE' });
      props.history.push('/complete');
      return;
    }

    setIsReady(false);
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentDrinkIndex, orderItems, dispatch, props.history]);

  useEffect(() => {
    if (isReady) {
      const redirectTimer = setTimeout(() => {
        dispatch({ type: 'ORDER_PREPARE_NEXT' });
      }, 6000);

      return () => clearTimeout(redirectTimer);
    }
  }, [isReady, dispatch]);

  return (
    <div className="drink-preparation-container">
      <div className="content">
        {currentDrink && (
          <div className="preparing-text">
            {isReady ? (
              `Savurați: ${currentDrink.name} (${(currentDrink.quantityPrepared || 0) + 1}/${currentDrink.quantity || 0})`
            ) : (
              `În pregătire: ${currentDrink.name} (${(currentDrink.quantityPrepared || 0) + 1}/${currentDrink.quantity || 0})...`
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
