import { createContext, useReducer } from 'react';
import {
  CATEGORY_LIST_FAIL,
  CATEGORY_LIST_REQUEST,
  CATEGORY_LIST_SUCCESS,
  ORDER_ADD_ITEM,
  ORDER_CLEAR,
  ORDER_CREATE_FAIL,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_LIST_FAIL,
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_QUEUE_LIST_FAIL,
  ORDER_QUEUE_LIST_REQUEST,
  ORDER_QUEUE_LIST_SUCCESS,
  ORDER_REMOVE_ITEM,
  PRODUCT_LIST_FAIL,
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  SCREEN_SET_WIDTH,
  ORDER_PREPARE_NEXT,
  ORDER_PREPARE_COMPLETE,
  SET_CURRENT_DRINK_INDEX,
} from './constants';

export const Store = createContext();
const initialState = {
  widthScreen: false,
  categoryList: { loading: true },
  productList: { loading: true },
  queueList: { loading: true },
  order: {
    orderItems: [],
    currentDrinkIndex: 0,
    orderNumber: 1,
    allDrinksPrepared: false,
  },
  orderCreate: { loading: true },
  orderList: { loading: true },
};

function reducer(state, action) {
  switch (action.type) {
    case SCREEN_SET_WIDTH:
      return {
        ...state,
        widthScreen: true,
      };
    case CATEGORY_LIST_REQUEST:
      return { ...state, categoryList: { loading: true } };
    case CATEGORY_LIST_SUCCESS:
      return {
        ...state,
        categoryList: { loading: false, categories: action.payload },
      };
    case CATEGORY_LIST_FAIL:
      return {
        ...state,
        categoryList: { loading: false, error: action.payload },
      };
    case PRODUCT_LIST_REQUEST:
      return { ...state, productList: { loading: true } };
    case PRODUCT_LIST_SUCCESS:
      return {
        ...state,
        productList: { loading: false, products: action.payload },
      };
    case PRODUCT_LIST_FAIL:
      return {
        ...state,
        productList: { loading: false, error: action.payload },
      };
    case ORDER_ADD_ITEM: {
      const item = action.payload;
      const existingItemIndex = state.order.orderItems.findIndex(
        (x) => x._id === item._id
      );

      let updatedOrderItems;
      if (existingItemIndex !== -1) {
        console.log('Item already exists. Updating quantity.');
        updatedOrderItems = state.order.orderItems.map((x, index) =>
          index === existingItemIndex
            ? { ...x, quantity: x.quantity + item.quantity }
            : x
        );
      } else {
        console.log('Item does not exist. Adding new item.');
        updatedOrderItems = [...state.order.orderItems, { ...item, quantityPrepared: 0 }];
      }

      // Calculuri pentru totaluri
      const itemsCount = updatedOrderItems.reduce((a, c) => a + c.quantity, 0);
      const itemsPrice = updatedOrderItems.reduce(
        (a, c) => a + c.quantity * c.price,
        0
      );
      const taxPrice = Math.round(0.19 * itemsPrice * 100) / 100;
      const totalPrice = Math.round((itemsPrice + taxPrice) * 100) / 100;

      console.log('Updated Order Items:', updatedOrderItems);
      console.log('Items Count:', itemsCount);
      console.log('Total Price:', totalPrice);

      return {
        ...state,
        order: {
          ...state.order,
          orderItems: updatedOrderItems,
          taxPrice,
          totalPrice,
          itemsCount,
          allDrinksPrepared: false,
        },
      };
    }
    case ORDER_REMOVE_ITEM: {
      const orderItems = state.order.orderItems.filter(
        (x) => x._id !== action.payload._id
      );
      const itemsCount = orderItems.reduce((a, c) => a + c.quantity, 0);
      const itemsPrice = orderItems.reduce(
        (a, c) => a + c.quantity * c.price,
        0
      );
      const taxPrice = Math.round(0.19 * itemsPrice * 100) / 100;
      const totalPrice = Math.round((itemsPrice + taxPrice) * 100) / 100;

      console.log('Order Items after removal:', orderItems);
      console.log('Items Count:', itemsCount);
      console.log('Total Price:', totalPrice);

      return {
        ...state,
        order: {
          ...state.order,
          orderItems,
          taxPrice,
          totalPrice,
          itemsCount,
        },
      };
    }
    case ORDER_CLEAR:
      return {
        ...state,
        order: {
          orderItems: [],
          taxPrice: 0,
          totalPrice: 0,
          itemsCount: 0,
          currentDrinkIndex: 0,
        },
        orderCreated: false,
      };
    case ORDER_CREATE_REQUEST:
      return { ...state, orderCreate: { loading: true } };
    case ORDER_CREATE_SUCCESS:
      return {
        ...state,
        orderCreate: { loading: false, error: null, newOrder: action.payload },
        order: { 
          ...state.order, 
          orderNumber: action.payload.orderNumber,
          orderCreated: true 
        },
      };
    case ORDER_CREATE_FAIL:
      return {
        ...state,
        orderCreate: { loading: false, error: action.payload },
      };
    case ORDER_LIST_REQUEST:
      return { ...state, orderList: { loading: true } };
    case ORDER_LIST_SUCCESS:
      return {
        ...state,
        orderList: { loading: false, orders: action.payload },
      };
    case ORDER_LIST_FAIL:
      return {
        ...state,
        orderList: { loading: false, error: action.payload },
      };
    case ORDER_QUEUE_LIST_REQUEST:
      return { ...state, queueList: { loading: true } };
    case ORDER_QUEUE_LIST_SUCCESS:
      return {
        ...state,
        queueList: { loading: false, queue: action.payload },
      };
    case ORDER_QUEUE_LIST_FAIL:
      return {
        ...state,
        queueList: { loading: false, error: action.payload },
      };
      case ORDER_PREPARE_NEXT: {
        const updatedOrderItems = state.order.orderItems.map((item, index) =>
          index === state.order.currentDrinkIndex
            ? { ...item, quantityPrepared: item.quantityPrepared + 1 }
            : item
        );
      
        const currentDrink = updatedOrderItems[state.order.currentDrinkIndex];
      
        // Check if the current drink is fully prepared
        const isCurrentDrinkPrepared = currentDrink.quantityPrepared >= currentDrink.quantity;
      
        // Move to the next drink if the current one is fully prepared
        const nextDrinkIndex = isCurrentDrinkPrepared
          ? state.order.currentDrinkIndex + 1
          : state.order.currentDrinkIndex;
      
        // Check if all drinks are prepared
        const allDrinksPrepared = nextDrinkIndex >= updatedOrderItems.length;
      
        return {
          ...state,
          order: {
            ...state.order,
            orderItems: updatedOrderItems,
            currentDrinkIndex: nextDrinkIndex, // Move to the next drink
            allDrinksPrepared,
          },
        };
      }
      
      
    case SET_CURRENT_DRINK_INDEX:
      return {
        ...state,
        order: {
          ...state.order,
          currentDrinkIndex: action.payload,
        },
      };
    case ORDER_PREPARE_COMPLETE:
      return {
        ...state,
        order: {
          ...state.order,
          allDrinksPrepared: true,
        },
      };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = { state, dispatch };

  return (
    <Store.Provider value={value}>
      {props.children}
    </Store.Provider>
  );
}
