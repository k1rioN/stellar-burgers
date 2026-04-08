import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getOrderByNumberApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

type TOrderInfoState = {
  orderData: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderInfoState = {
  orderData: null,
  isLoading: false,
  error: null
};

export const fetchOrderByNumber = createAsyncThunk(
  'orderInfo/fetchOrderByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);

    if (!response.orders.length) {
      throw new Error('Заказ не найден');
    }

    return response.orders[0];
  }
);

export const orderInfoSlice = createSlice({
  name: 'orderInfo',
  initialState,
  reducers: {
    clearOrderInfo: (state) => {
      state.orderData = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchOrderByNumber.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.orderData = null;
    });
    builder.addCase(fetchOrderByNumber.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orderData = action.payload;
    });
    builder.addCase(fetchOrderByNumber.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Ошибка загрузки заказа';
    });
  }
});

export const { clearOrderInfo } = orderInfoSlice.actions;

export default orderInfoSlice.reducer;
