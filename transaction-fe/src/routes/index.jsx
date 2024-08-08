import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../pages/home";
import Layout from "../pages/layout";
import Transactions from "../pages/transaction";
import ManageProduct from "../pages/product/manageProduct";

const RouteRouter = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: "transaction", element: <Transactions /> },
        { path: "manage-product", element: <ManageProduct /> },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default RouteRouter;
