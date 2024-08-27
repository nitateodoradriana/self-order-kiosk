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
  ORDER_SET_PAYMENT_TYPE,
  ORDER_SET_TYPE,
  PRODUCT_LIST_FAIL,
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  SCREEN_SET_WIDTH,
  ORDER_PREPARE_NEXT,
  ORDER_PREPARE_COMPLETE,
} from './constants';

export const Store = createContext();
const initialState = {
  widthScreen: false,
  categoryList: { loading: true },
  productList: { loading: true },
  queueList: { loading: true },
  order: {
    orderType: 'Eat in',
    orderItems: [],
    paymentType: 'Pay here',
    currentDrinkIndex: 0,
    orderNumber: 1, // Inițializează numărul comenzii la 1
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
    case ORDER_SET_TYPE:
      return {
        ...state,
        order: { ...state.order, orderType: action.payload },
      };
    case ORDER_SET_PAYMENT_TYPE:
      return {
        ...state,
        order: { ...state.order, paymentType: action.payload },
      };
      case ORDER_ADD_ITEM: {
        const item = action.payload;
        const existingItem = state.order.orderItems.find((x) => x.name === item.name);
      
        // Actualizare sau adăugare item
        const orderItems = existingItem
          ? state.order.orderItems.map((x) =>
              x.name === existingItem.name
                ? { ...x, quantity: item.quantity, quantityPrepared: x.quantityPrepared }
                : x
            )
          : [...state.order.orderItems, { ...item, quantityPrepared: 0 }];
      
        // Calculuri pentru totaluri
        const itemsCount = orderItems.reduce((a, c) => a + c.quantity, 0);
        const itemsPrice = orderItems.reduce(
          (a, c) => a + c.quantity * c.price,
          0
        );
        const taxPrice = Math.round(0.19 * itemsPrice * 100) / 100;
        const totalPrice = Math.round((itemsPrice + taxPrice) * 100) / 100;
      
        return {
          ...state,
          order: {
            ...state.order,
            orderItems,
            taxPrice,
            totalPrice,
            itemsCount,
            allDrinksPrepared: false,
          },
        };
      }
      
    case ORDER_REMOVE_ITEM: {
      const orderItems = state.order.orderItems.filter(
        (x) => x.name !== action.payload.name
      );
      const itemsCount = orderItems.reduce((a, c) => a + c.quantity, 0);
      const itemsPrice = orderItems.reduce(
        (a, c) => a + c.quantity * c.price,
        0
      );
      const taxPrice = Math.round(0.19 * itemsPrice * 100) / 100;
      const totalPrice = Math.round((itemsPrice + taxPrice) * 100) / 100;

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
      const orderItems = state.order.orderItems.map((item, index) =>
        index === state.order.currentDrinkIndex
          ? { ...item, quantityPrepared: item.quantityPrepared + 1 }
          : item
      );

      let currentDrinkIndex = state.order.currentDrinkIndex;
      if (orderItems[currentDrinkIndex]?.quantityPrepared >= orderItems[currentDrinkIndex]?.quantity) {
        currentDrinkIndex += 1;
      }

      return {
        ...state,
        order: {
          ...state.order,
          orderItems,
          currentDrinkIndex,
        },
      };
    }
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
