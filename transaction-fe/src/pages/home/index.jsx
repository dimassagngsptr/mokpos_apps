import { FaCirclePlus } from "react-icons/fa6";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Option, Select, Tooltip } from "@material-tailwind/react";
import Modal from "../../components/modal";
import Input from "../../components/base/input";
import { getAllProducts } from "../../configs/redux/features/productSlice";
import Card from "../../components/card";
import Spinner from "../../components/base/spinner";
import useCart from "../../hooks/useCart";
import useProductForm from "../../hooks/useProductForm";
import FormProduct from "../../components/product/form";

const Home = () => {
  const params = new URLSearchParams(location.search);
  const search = params.get("search") || "";
  const limit = params.get("limit") || 30;
  const page = params.get("page") || 1;
  const { data, url, loadingUpload } = useSelector((state) => state.product);
  const { data: categories } = useSelector((state) => state.category);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const handleOpen = () => setOpen(!open);
  const {
    value,
    handleChange,
    handleChangeImage,
    handleSubmit,
    loadingAdd,
    selectedImage,
    setValue,
  } = useProductForm({ search, limit, page });
  const onAddProduct = () => {
    handleSubmit();
    handleOpen();
  };
  const FORM = [
    {
      name: "name",
      label: "Product name",
      type: "text",
      value: value?.name,
      placeholder: "Input name",
    },
    {
      name: "price",
      label: "Product price",
      type: "text",
      value: value?.price,
      placeholder: "Input price",
    },
    {
      name: "discount",
      label: (
        <>
          <p>Product discount (%)</p>
          <small className="text-xs">Example: 0.25 or 1.20</small>
        </>
      ),
      type: "number",
      value: value?.discount,
      placeholder: "Input discount",
    },
  ];

  const {
    cartItems,
    handleAddToCart,
    handleIncrementQuantity,
    handleDecrementQuantity,
    getCartItemQuantity,
  } = useCart();
  useEffect(() => {
    dispatch(getAllProducts({ search, limit, page }));
  }, [search, limit, page]);
  return (
    <div className="lg:ml-72">
      <div className="font-poppins grid grid-cols-2 md:grid-cols-4 4xl:grid-cols-5 md:gap-y-5 gap-x-2 gap-y-4 min-w-screen mx-auto px-[3%] lg:px-10 py-5 ml-2 md:min-h-screen">
        {data?.data?.map((item) => (
          <Card
            code={item?.code}
            image={item?.image}
            name={item?.name}
            price={item?.price}
            quantity={getCartItemQuantity(item.ID)}
            addToCart={() => handleAddToCart(item)}
            onIncrement={() => handleIncrementQuantity(item?.ID)}
            onDecrement={() => handleDecrementQuantity(item?.ID)}
            discount={item?.discount}
          />
        ))}
      </div>
      <Tooltip content="Add products">
        <button
          className="fixed bottom-5 right-[87%] lg:right-10"
          onClick={handleOpen}
        >
          <FaCirclePlus className="text-green-700" size={40} />
        </button>
      </Tooltip>
      <FormProduct
        FORM={FORM}
        categories={categories}
        handleChange={handleChange}
        handleChangeImage={handleChangeImage}
        handleOpen={handleOpen}
        loadingUpload={loadingUpload}
        onAddProduct={onAddProduct}
        open={open}
        selectedImage={selectedImage}
        setValue={setValue}
        value={value}
        title={"Add product"}
      />
    </div>
  );
};
export default Home;
