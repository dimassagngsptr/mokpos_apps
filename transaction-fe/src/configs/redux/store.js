import { combineReducers, configureStore } from "@reduxjs/toolkit";
import productSlice from "./features/productSlice";
import categorySlice from "./features/categorySlice";
import cartSlice from "./features/cartSlice";
import customerSlice from "./features/customerSlice";

const rootReducers = combineReducers({
  product: productSlice,
  category: categorySlice,
  cart: cartSlice,
  customer: customerSlice,
});

export const store = configureStore({
  reducer: rootReducers,
});
