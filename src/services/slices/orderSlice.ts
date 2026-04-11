import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { orderBurgerApi } from '../../utils/burger-api';
import { TCreatedOrder } from '../../utils/types';

type TOrderState = {
  orderRequest: boolean;
  orderModalData: TCreatedOrder | null;
};

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredients: string[]) => {
    const response = await orderBurgerApi(ingredients);

    return response.order;
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    closeOrderModal: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(createOrder.pending, (state) => {
      state.orderRequest = true;
      state.orderModalData = null;
    });
    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.orderRequest = false;
      state.orderModalData = action.payload;
    });
    builder.addCase(createOrder.rejected, (state) => {
      state.orderRequest = false;
    });
  }
});

export const { closeOrderModal } = orderSlice.actions;

export default orderSlice.reducer;
