import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  decrementQuantity,
  incrementQuantity,
} from "../configs/redux/features/cartSlice";

const useCart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const handleAddToCart = (item) => {
    const existingItem = cartItems?.find(
      (cartItem) => cartItem?.id === item?.ID
    );
    console.log(existingItem);
    if (existingItem) {
      dispatch(incrementQuantity(item?.ID));
    } else {
      const originalPrice = item?.price;
      if (item?.discount > 0) {
        const discountAmount = originalPrice * (item?.discount / 100);
        const finalPrice = originalPrice - discountAmount;
        dispatch(
          addToCart({
            id: item?.ID,
            name: item?.name,
            before_discount: item?.price,
            price: finalPrice,
            quantity: 1,
            image: item?.image,
            discount_percent: item?.discount,
            discount_price: discountAmount,
          })
        );
      } else {
        dispatch(
          addToCart({
            id: item?.ID,
            name: item?.name,
            beforeDiscount: item?.price,
            price: item?.price,
            quantity: 1,
            image: item?.image,
            discount_percent: 0,
            discount_price: 0,
          })
        );
      }
    }
  };

  const handleIncrementQuantity = (itemId) => {
    dispatch(incrementQuantity(itemId));
  };

  const handleDecrementQuantity = (itemId) => {
    dispatch(decrementQuantity(itemId));
  };

  const getCartItemQuantity = (itemId) => {
    const item = cartItems?.find((cartItem) => cartItem?.id === itemId);

    return item ? item.quantity : 0;
  };
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.totalPrice, 0);
  };

  useEffect(() => {
    // Filter out items with quantity 0
    const filteredItems = cartItems?.filter((item) => item?.quantity > 0);

    // Save only items with quantity > 0 to localStorage
    localStorage.setItem("cartItems", JSON.stringify(filteredItems));
  }, [cartItems]);

  return {
    cartItems,
    getTotalPrice,
    handleAddToCart,
    handleIncrementQuantity,
    handleDecrementQuantity,
    getCartItemQuantity,
  };
};

export default useCart;
