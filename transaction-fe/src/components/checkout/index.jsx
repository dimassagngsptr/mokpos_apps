import { useDispatch, useSelector } from "react-redux";
import { formatIDR } from "../../utils/formatIDR";
import Input from "../base/input";
import Modal from "../modal";
import { Option, Select } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import {
  createCustomer,
  getAllCustomer,
} from "../../configs/redux/features/customerSlice";
import { api } from "../../configs/api";
import { toastify } from "../base/toastify";

const Checkout = ({
  openModal,
  handleOpenModal,
  cartItems,
  disc,
  setDisc,
  shippingFee,
  setShippingFee,
  getTotalPrice,
}) => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  const { data: customers } = useSelector((state) => state.customer);
  const [openModalCustomers, setOpenModalCustomers] = useState(false);
  const [customerID, setCustomerID] = useState(null);
  const [checkout, setCheckout] = useState({
    subtotal: null,
    shipping_fee: null,
    discount_percent: null,
    discount_amount: null,
    details: null,
    customer_id: customerID,
  });
  const [data, setData] = useState({
    name: "",
    phone: "",
  });
  console.log(items);

  const handleOpenModalCustomers = () =>
    setOpenModalCustomers(!openModalCustomers);

  const handleChange = (e) => {
    setData({ ...data, [e?.target?.name]: e?.target?.value });
  };
  const handleAddCustomers = async () => {
    await dispatch(createCustomer(data));
    await dispatch(getAllCustomer());
    handleOpenModalCustomers();
  };
  useEffect(() => {
    setCheckout({
      subtotal: getTotalPrice(),
      customer_id: customerID,
      details: items,
      shipping_fee: shippingFee !== null ? parseInt(shippingFee) : 0,
      discount_percent: disc !== null ? parseInt(disc) : 0,
      discount_amount: disc ? (getTotalPrice() * disc) / 100 : 0,
    });
  }, [customerID, items]);

  const handleCheckout = async () => {
    try {
      const res = await api.post("/transactions", checkout);
      if (res?.status == 201) {
        localStorage.clear();
        toastify("success", res?.data?.message);
      }
      handleOpenModal();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Modal
        isOpen={openModal}
        onClose={handleOpenModal}
        title={"Checkout"}
        btnTitle={"Checkout"}
        disabled={customerID === null}
        onSubmit={handleCheckout}
      >
        <div className="h-full min-w-[300px] lg:w-[580px] lg:px-3">
          <div className="max-h-[250px] lg:max-h-[200px] overflow-y-scroll">
            {cartItems?.map((item) => (
              <div className="flex items-center justify-between max-w-full h-full">
                <div className="flex gap-4 items-center mt-2">
                  <div className="max-w-[50px] lg:max-w-[60px]">
                    <img
                      src={item?.image}
                      alt=""
                      className="w-full h-full rounded-md"
                    />
                  </div>
                  <div className="text-xs lg:text-base">
                    <p className="font-semibold tracking-wider text-main-navy">
                      {item?.name}
                    </p>
                    <small className="block text-gray-700">
                      quantity : {item?.quantity}
                    </small>
                    <small className="block text-gray-700">
                      price : {formatIDR(item?.before_discount || item?.price)}
                    </small>
                    {item?.discount_percent > 0 && (
                      <>
                        <small className="block text-gray-700">
                          Discount product (%) : {item?.discount_percent}%
                        </small>
                        <small className="block text-gray-700">
                          Discount product (Rp) :{" "}
                          {formatIDR(item?.discount_price)}
                        </small>
                      </>
                    )}
                  </div>
                </div>
                <p className="font-semibold text-main-blue text-sm lg:text-base">
                  Total : {formatIDR(item?.totalPrice)}
                </p>
              </div>
            ))}
          </div>
          <div className="max-w-full mt-3 border-t border-gray-300 py-2">
            <div className="flex flex-col justify-between mb-2">
              <Select
                variant="outlined"
                size="lg"
                className="outline-gray-300"
                label="Select customers"
                value={customerID}
                onChange={(val) => setCustomerID(val)}
              >
                {customers?.data?.map((item) => (
                  <Option key={item?.ID} value={item?.ID}>
                    {item?.name} | {item?.code}
                  </Option>
                ))}
              </Select>
              <button
                className="text-sm border border-main-blue bg-white text-main-blue hover:bg-main-blue hover:text-white p-1 rounded mt-2"
                onClick={handleOpenModalCustomers}
              >
                Or add new customer
              </button>
            </div>
            <div className="flex justify-between items-center">
              <p className=" font-semibold text-sm">Total Price</p>
              <p className=" text-red-500 font-semibold">
                {formatIDR(getTotalPrice())}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className=" font-semibold text-sm">Shipping fee</p>
              <div className="flex gap-x-1 items-center">
                <Input
                  name="shippingFee"
                  className="border border-gray-400 max-w-24 text-xs py-1 outline-none px-1 text-end rounded"
                  value={shippingFee}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (isNaN(value) || !value) {
                      return setShippingFee(0);
                    }
                    setShippingFee(value);
                  }}
                />
                <small>Rp</small>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className=" font-semibold text-sm">Discount %</p>
              <div className="flex gap-x-1 items-center mt-2">
                <Input
                  name="disc"
                  className="border border-gray-400 max-w-12 outline-none px-1 text-end rounded"
                  value={disc}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (isNaN(value) || !value) {
                      return setDisc(0);
                    }
                    setDisc(value);
                  }}
                />
                <small className="mx-0.5"> % </small>
              </div>
            </div>
            <div className="flex justify-between items-center lg:mt-1">
              <p className=" font-semibold text-sm">Discount Rp</p>
              <p className="text-gray-600 text-sm lg:mr-2">
                -{formatIDR((getTotalPrice() * disc) / 100)}
              </p>
            </div>

            <div className="flex justify-between text-green-500 mt-4 text-lg">
              <p className="font-semibold text-sm">Total Payment</p>
              <p className="font-semibold">
                {shippingFee || disc
                  ? formatIDR(
                      getTotalPrice() -
                        (getTotalPrice() * disc) / 100 +
                        parseInt(shippingFee)
                    )
                  : formatIDR(getTotalPrice())}
              </p>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        title={"Create new customer"}
        isOpen={openModalCustomers}
        onClose={handleOpenModalCustomers}
        btnTitle={"Save"}
        onSubmit={handleAddCustomers}
        disabled={data?.name == "" || data?.phone == ""}
      >
        <div className="p-2">
          <div className="my-2">
            <Input
              onChange={handleChange}
              name="name"
              label="Customer Name"
              placeholder="Enter customer name"
              className="outline-none p-1 border border-gray-400 rounded-md px-2"
            />
          </div>
          <Input
            onChange={handleChange}
            name="phone"
            label="Customer Phone"
            placeholder="Enter customer phone"
            className="outline-none p-1 border border-gray-400 rounded-md px-2"
          />
        </div>
      </Modal>
    </>
  );
};

export default Checkout;
