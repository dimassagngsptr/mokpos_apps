import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { HiOutlineBars3CenterLeft } from "react-icons/hi2";
import { images } from "../images";
import { IoMdClose } from "react-icons/io";
import { Drawer } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useSelector } from "react-redux";
import { FaArrowRight, FaBagShopping } from "react-icons/fa6";
import useCart from "../../hooks/useCart";
import Checkout from "../checkout";

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [disc, setDisc] = useState(null);
  const [shippingFee, setShippingFee] = useState(null);
  const [search, setSearch] = useState("");
  
  const navigate = useNavigate();
  const handleSearch = () => {
    navigate(`/?search=${search}`);
    window.location.reload();
  };
  const cartItems = useSelector((state) => state.cart.items);

  const handleOpen = () => setOpen(!open);
  const handleOpenModal = () => setOpenModal(!openModal);
  const { getTotalPrice } = useCart();
  return (
    <div className="flex flex-col items-center gap-y-5 bg-[#fff] px-[5%] py-5 font-poppins lg:w-1/5 mx:px-0 lg:fixed lg:h-screen">
      <div className="flex gap-24 md:gap-5 md:items-center w-full lg:hidden md:justify-between">
        <button onClick={handleOpen} className="lg:hidden">
          <HiOutlineBars3CenterLeft color="blue" size={28} />
        </button>
        <div className="bg-[#fff] rounded-md p-2 hidden lg:block">
          <img src={images?.logo} alt="" className="w-6 h-6" />
        </div>

        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          className={`h-full bg-main-blue w-[250px] py-[5%] px-5 lg:hidden`}
        >
          <div className="flex justify-between">
            <div className="flex text-[#ffff] items-center gap-x-2">
              <div className="bg-[#fff] rounded-md p-2">
                <img src={images?.logo} alt="" className="w-6 h-6" />
              </div>
              <p className="font-semibold text-xl tracking-wide">MokPOS</p>
            </div>
            <button onClick={handleOpen}>
              <IoMdClose color="white" size={24} />
            </button>
          </div>
          <div className="flex flex-col gap-y-5 mt-5 border-t border-[#ffff] py-4">
            <div
              onClick={() => navigate("/transaction")}
              className="flex gap-x-5 text-sm text-[#ffff] cursor-pointer"
            >
              <img
                src={images?.history}
                alt=""
                loading="lazy"
                className="h-8 w-8"
              />
              <p>History Transactions</p>
            </div>
            <div
              onClick={() => navigate("/manage-product")}
              className="flex gap-x-5 text-sm text-[#ffff] cursor-pointer"
            >
              <img
                src={images?.product_manage}
                alt=""
                loading="lazy"
                className="h-8 w-8"
              />
              <p>Manage Product</p>
            </div>
          </div>
        </Drawer>
        <h1
          className="font-poppins text-main-blue font-semibold text-xl tracking-wide md:text-2xl"
          onClick={() => navigate("/")}
        >
          Products
        </h1>
        <div className="relative">
          <button onClick={handleOpenModal}>
            <FaBagShopping size={24} className="text-blue-500" />
          </button>
          {cartItems?.length > 0 && (
            <div className="bg-red-500 w-5 h-5 rounded-full -top-1 -right-2 absolute text-center text-white font-semibold">
              {cartItems?.length}
            </div>
          )}
        </div>
      </div>
      <div className=" min-w-full flex gap-3 items-center font-poppins lg:flex-col-reverse lg:items-start">
        <div
          onClick={handleOpenModal}
          className="hidden lg:flex items-center cursor-pointer hover:bg-main-blue hover:text-white transition-all duration-300 px-2 gap-3 rounded-md fixed bottom-5 left-5 border border-gray-500 h-10 w-1/6"
        >
          <AiOutlineShoppingCart size={20} />
          <p>Items in cart</p>
          <div className="bg-main-blue w-5 text-center rounded-full">
            <p className="text-white ">{cartItems?.length}</p>
          </div>
          <FaArrowRight size={15} className="ml-2" />
        </div>
        <Checkout
          cartItems={cartItems}
          disc={disc}
          getTotalPrice={getTotalPrice}
          handleOpenModal={handleOpenModal}
          openModal={openModal}
          setDisc={setDisc}
          shippingFee={shippingFee}
          setShippingFee={setShippingFee}
        />
        <div className="hidden text-sm lg:flex lg:flex-col lg:gap-x-5 w-full border-t border-gray-300 mt-2">
          <div className="flex flex-col gap-y-5 border-t border-[#ffff] py-4">
            <div
              onClick={() => navigate("/transaction")}
              className="flex gap-x-2 text-sm text-main-blue cursor-pointer hover:bg-main-blue hover:text-white min-w-full rounded py-0.5 transition-all duration-300"
            >
              <img
                src={images?.history}
                alt=""
                loading="lazy"
                className="h-6 w-6 p-1 bg-main-blue rounded-md"
              />
              <p>History Transactions</p>
            </div>
            <div
              onClick={() => navigate("/manage-product")}
              className="flex gap-x-2 text-sm text-main-blue cursor-pointer hover:bg-main-blue hover:text-white min-w-full rounded py-0.5 transition-all duration-300"
            >
              <img
                src={images?.product_manage}
                alt=""
                loading="lazy"
                className="h-6 w-6 p-1 bg-main-blue rounded-md"
              />
              <p>Manage Product</p>
            </div>
          </div>
        </div>
        <div className="flex gap-x-2">
          <input
            type="search"
            onChange={(e) => setSearch(e?.target?.value)}
            value={search}
            placeholder="Search products..."
            className="border border-main-darkGrey rounded-md w-[300px] p-2 outline-none md:w-[450px] lg:w-[200px]"
          />
          <button
            className="bg-main-blue p-2 rounded-md outline-none"
            onClick={handleSearch}
          >
            <CiSearch size={24} color="white" />
          </button>
        </div>
        <div className="hidden lg:flex justify-between">
          <div
            className="flex text-[#ffff] items-center gap-x-2 text-main-blue cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="bg-[#fff] rounded-md p-2">
              <img src={images?.logo} alt="" className="w-5 h-5" />
            </div>
            <p className="font-semibold text-xl tracking-wide">MokPOS</p>
          </div>
        </div>
      </div>
    </div>
  );
};
