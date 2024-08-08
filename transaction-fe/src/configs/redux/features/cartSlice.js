import { createSlice } from "@reduxjs/toolkit";
export const loadState = () => {
  try {
    const serializedState = localStorage.getItem("cartItems");
    if (serializedState === null) {
      return [];
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return [];
  }
};
const calculateSubtotal = (items) => {
  return items.reduce((total, item) => total + item.totalPrice, 0);
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    code: "",
    date: "",
    items: loadState(),
    subtotal: calculateSubtotal(loadState()),
  },
  reducers: {
    addToCart: (state, action) => {
      const newItems = action.payload;
      const existingItem = state.items.find((item) => item.id === newItems.id);
      if (existingItem) {
        existingItem.quantity += newItems.quantity;
        existingItem.totalPrice += newItems.price * newItems.quantity;
      } else {
        state.items.push({
          id: newItems.id,
          name: newItems.name,
          price: newItems.price,
          quantity: newItems.quantity,
          totalPrice: newItems.price * newItems.quantity,
          image: newItems.image,
          discount_percent: newItems?.discount_percent,
          discount_price: newItems?.discount_price,
          before_discount: newItems?.before_discount,
        });
      }
      state.subtotal += newItems.price * newItems.quantity;
    },
    incrementQuantity: (state, action) => {
      const itemId = action.payload;
      const existingItem = state.items.find((item) => item.id === itemId);

      if (existingItem) {
        existingItem.quantity += 1;
        existingItem.totalPrice += existingItem.price;
        state.subtotal += existingItem.price;
      }
    },
    decrementQuantity: (state, action) => {
      const itemId = action.payload;
      const existingItem = state.items.find((item) => item.id === itemId);

      if (existingItem) {
        existingItem.quantity -= 1;
        existingItem.totalPrice -= existingItem.price;
        state.subtotal -= existingItem.price;

        if (existingItem.quantity === 0) {
          state.items = state.items.filter((item) => item.id !== itemId);
        }
      }
    },
    
  },
  
});

export const { addToCart, incrementQuantity, decrementQuantity } =
  cartSlice.actions;
export default cartSlice.reducer;
