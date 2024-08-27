import Axios from 'axios';
import {
  ORDER_SET_TYPE,
  CATEGORY_LIST_REQUEST,
  CATEGORY_LIST_FAIL,
  CATEGORY_LIST_SUCCESS,
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  ORDER_ADD_ITEM,
  ORDER_REMOVE_ITEM,
  ORDER_CLEAR,
  ORDER_SET_PAYMENT_TYPE,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_FAIL,
  ORDER_CREATE_SUCCESS,
  ORDER_LIST_REQUEST,
  ORDER_LIST_FAIL,
  ORDER_LIST_SUCCESS,
  SCREEN_SET_WIDTH,
  ORDER_QUEUE_LIST_REQUEST,
  ORDER_QUEUE_LIST_SUCCESS,
  ORDER_QUEUE_LIST_FAIL,
} from './constants';

// Ensure that `dispatch` is correctly typed in TypeScript

export const setOrderType = (dispatch, orderType) => {
  return dispatch({
    type: ORDER_SET_TYPE,
    payload: orderType,
  });
};

export const listCategories = async (dispatch) => {
  dispatch({ type: CATEGORY_LIST_REQUEST });
  try {
    const { data } = await Axios.get('http://localhost:5000/api/categories');
    if (Array.isArray(data)) {
      dispatch({
        type: CATEGORY_LIST_SUCCESS,
        payload: data,
      });
    } else {
      throw new Error('Data is not an array');
    }
  } catch (error) {
    dispatch({
      type: CATEGORY_LIST_FAIL,
      payload: error.message,
    });
  }
};

export const listProducts = async (dispatch, categoryName = '') => {
  dispatch({ type: PRODUCT_LIST_REQUEST });
  try {
    const { data } = await Axios.get(`/api/products?category=${categoryName}`);
    if (Array.isArray(data)) {
      dispatch({
        type: PRODUCT_LIST_SUCCESS,
        payload: data,
      });
    } else {
      throw new Error('Data is not an array');
    }
  } catch (error) {
    dispatch({
      type: PRODUCT_LIST_FAIL,
      payload: error.message,
    });
  }
};

export const addToOrder = (dispatch, item) => {
  return dispatch({
    type: ORDER_ADD_ITEM,
    payload: item,
  });
};

export const removeFromOrder = (dispatch, item) => {
  return dispatch({
    type: ORDER_REMOVE_ITEM,
    payload: item,
  });
};

export const clearOrder = (dispatch) => {
  return dispatch({
    type: ORDER_CLEAR,
  });
};

export const setPaymentType = (dispatch, paymentType) => {
  return dispatch({
    type: ORDER_SET_PAYMENT_TYPE,
    payload: paymentType,
  });
};

export const createOrder = async (dispatch, order) => {
  dispatch({ type: ORDER_CREATE_REQUEST });
  try {
    const { data } = await Axios.post('/api/orders', order);
    dispatch({
      type: ORDER_CREATE_SUCCESS,
      payload: data,
    });
    dispatch({
      type: ORDER_CLEAR,
    });
  } catch (error) {
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload: error.message,
    });
  }
};

export const listOrders = async (dispatch) => {
  dispatch({ type: SCREEN_SET_WIDTH });
  dispatch({ type: ORDER_LIST_REQUEST });
  try {
    const { data } = await Axios.get('/api/orders');
    if (Array.isArray(data)) {
      dispatch({
        type: ORDER_LIST_SUCCESS,
        payload: data,
      });
    } else {
      throw new Error('Data is not an array');
    }
  } catch (error) {
    dispatch({
      type: ORDER_LIST_FAIL,
      payload: error.message,
    });
  }
};

export const listQueue = async (dispatch) => {
  dispatch({ type: SCREEN_SET_WIDTH });
  dispatch({ type: ORDER_QUEUE_LIST_REQUEST });
  try {
    const { data } = await Axios.get('/api/orders/queue');
    if (Array.isArray(data)) {
      dispatch({
        type: ORDER_QUEUE_LIST_SUCCESS,
        payload: data,
      });
    } else {
      throw new Error('Data is not an array');
    }
  } catch (error) {
    dispatch({
      type: ORDER_QUEUE_LIST_FAIL,
      payload: error.message,
    });
  }
};
