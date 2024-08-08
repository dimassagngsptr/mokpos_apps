import { useDispatch, useSelector } from "react-redux";
import { decrementQuantity, incrementQuantity } from "../configs/redux/features/cartSlice";

const dispatch = useDispatch()
const cartItems = useSelector((state) => state.cart.items);
console.log(cartItems);

const handleAddToCart = (item) => {
  console.log(item);
  const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);
  if (existingItem) {
    dispatch(incrementQuantity(item.id));
  } else {
    dispatch(
      addToCart({
        id: item.ID,
        name: item.name,
        price: item.price,
        quantity: 1,
      })
    );
  }
};
const handleIncrementQuantity = (itemId) => {
  dispatch(incrementQuantity(itemId));
};

const handleDecrementQuantity = (itemId) => {
  dispatch(decrementQuantity(itemId));
};

const getCartItemQuantity = (itemId) => {
  const item = cartItems.find((cartItem) => cartItem.id === itemId);
  console.log(item?.length);

  return item ? item.quantity : 0;
};
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);
