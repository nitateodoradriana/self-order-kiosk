import Axios from 'axios';
import {
  CATEGORY_LIST_REQUEST,
  CATEGORY_LIST_FAIL,
  CATEGORY_LIST_SUCCESS,
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  ORDER_ADD_ITEM,
  ORDER_REMOVE_ITEM,
  ORDER_CLEAR,
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

let isOrderBeingCreated = false;

export const listCategories = async (dispatch) => {
  dispatch({ type: CATEGORY_LIST_REQUEST });
  try {
    const { data } = await Axios.get('http://localhost:5000/api/products');
    if (Array.isArray(data)) {
      dispatch({ type: CATEGORY_LIST_SUCCESS, payload: data });
    } else {
      throw new Error('Data is not an array');
    }
  } catch (error) {
    dispatch({ type: CATEGORY_LIST_FAIL, payload: error.message || 'Failed to fetch categories' });
  }
};

export const listProducts = async (dispatch, categoryName = '') => {
  dispatch({ type: PRODUCT_LIST_REQUEST });
  try {
    const { data } = await Axios.get(`/api/products?category=${categoryName}`);
    if (Array.isArray(data)) {
      dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
    } else {
      throw new Error('Data is not an array');
    }
  } catch (error) {
    dispatch({ type: PRODUCT_LIST_FAIL, payload: error.message || 'Failed to fetch products' });
  }
};

export const addToOrder = (dispatch, item) => {
  return dispatch({ type: ORDER_ADD_ITEM, payload: item });
};

export const removeFromOrder = (dispatch, item) => {
  return dispatch({ type: ORDER_REMOVE_ITEM, payload: item });
};

export const clearOrder = (dispatch) => {
  return dispatch({ type: ORDER_CLEAR });
};

export const createOrder = async (dispatch, order) => {
  console.log('Order object before sending:', JSON.stringify(order, null, 2));
  
  if (isOrderBeingCreated) {
    console.warn('Order is already being created.');
    return;
  }
  
  isOrderBeingCreated = true;
  
  dispatch({ type: ORDER_CREATE_REQUEST });

  try {
    const requiredFields = ['orderItems', 'totalPrice', 'taxPrice']; 
    const missingFields = requiredFields.filter(field => !order[field] || (Array.isArray(order[field]) && order[field].length === 0));

    if (missingFields.length > 0) {
      throw new Error(`Order data is incomplete. Missing fields: ${missingFields.join(', ')}`);
    }

    order.orderItems.forEach(item => {
      if (item.quantityPrepared < 0 || item.quantityPrepared > item.quantity) {
        throw new Error(`Invalid quantityPrepared for item: ${item.name}`);
      }
    });

    const { data } = await Axios.post('http://localhost:5000/api/orders', order, {
      headers: { 'Content-Type': 'application/json' },
    });

    dispatch({ type: ORDER_CREATE_SUCCESS, payload: data });
    dispatch({ type: ORDER_CLEAR });

    dispatch({
      type: 'SET_INITIAL_ORDER',
      payload: { orderItems: [], totalPrice: 0, taxPrice: 0 },
    });

  } catch (error) {
    dispatch({ type: ORDER_CREATE_FAIL, payload: error.message || 'Failed to create order' });
    console.error('Error creating order:', error.response ? error.response.data : error.message);
  } finally {
    isOrderBeingCreated = false;
  }
};

export const listOrders = async (dispatch) => {
  dispatch({ type: SCREEN_SET_WIDTH });
  dispatch({ type: ORDER_LIST_REQUEST });
  try {
    const { data } = await Axios.get('/api/orders');
    if (Array.isArray(data)) {
      dispatch({ type: ORDER_LIST_SUCCESS, payload: data });
    } else {
      throw new Error('Data is not an array');
    }
  } catch (error) {
    dispatch({ type: ORDER_LIST_FAIL, payload: error.message || 'Failed to fetch orders' });
  }
};

export const listQueue = async (dispatch) => {
  dispatch({ type: SCREEN_SET_WIDTH });
  dispatch({ type: ORDER_QUEUE_LIST_REQUEST });
  try {
    const { data } = await Axios.get('/api/orders/queue');
    if (Array.isArray(data)) {
      dispatch({ type: ORDER_QUEUE_LIST_SUCCESS, payload: data });
    } else {
      throw new Error('Data is not an array');
    }
  } catch (error) {
    dispatch({ type: ORDER_QUEUE_LIST_FAIL, payload: error.message || 'Failed to fetch queue' });
  }
};
