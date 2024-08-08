import { useDispatch } from "react-redux";
import RouteRouter from "./routes";
import { getAllProducts } from "./configs/redux/features/productSlice";
import { getAllCategories } from "./configs/redux/features/categorySlice";
import { ToastContainer } from "react-toastify";
import { getAllCustomer } from "./configs/redux/features/customerSlice";

function App() {
  const dispatch = useDispatch();
  dispatch(getAllProducts()).unwrap();
  dispatch(getAllCategories()).unwrap();
  dispatch(getAllCustomer()).unwrap();
  return (
    <>
      <ToastContainer />
      <RouteRouter />
    </>
  );
}

export default App;
