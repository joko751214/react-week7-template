import { message } from 'antd';
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCartList,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  deleteCartItem as apiDeleteCartItem,
} from '@/api/server/cart';

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartCount: 0
  },
  reducers: {
    setCartCount: (state, action) => {
      state.cartCount = action.payload;
    },
  }
})

// 獲取購物清單
export const refreshCartCount = createAsyncThunk(
  'cart/refreshCartCount',
  async (data, {dispatch}) => {
    try {
      const {
        data: { data },
      } = await getCartList();
      const count = data?.carts.length;
      dispatch(setCartCount(count));
    } catch (err) {
      console.error('refreshCartCount error', err);
    }
  });

// 添加購物清單
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (data, {dispatch}) => {
    try {
      await apiAddToCart(data);
      message.success('已加入購物車');
      await dispatch(refreshCartCount());
    } catch (err) {
      console.error(err);
      message.error('加入購物車失敗');
      throw err;
    }
  }
)

export const { setCartCount } = cartSlice.actions;

export default cartSlice.reducer