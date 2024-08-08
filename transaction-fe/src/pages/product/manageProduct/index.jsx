import { useDispatch, useSelector } from "react-redux";
import TransactionsTable from "../../../components/table";
import { useEffect, useState } from "react";
import { CardBody, Tooltip, Typography } from "@material-tailwind/react";
import { RiEditBoxLine } from "react-icons/ri";
import { CiTrash } from "react-icons/ci";
import FormProduct from "../../../components/product/form";
import useProductForm from "../../../hooks/useProductForm";
import { api } from "../../../configs/api";
import { getAllProducts } from "../../../configs/redux/features/productSlice";
import { toastify } from "../../../components/base/toastify";
import { formatIDR } from "../../../utils/formatIDR";
import { useNavigate } from "react-router-dom";
const TABLE_HEAD = ["Name", "Price", "Discount", "Code", "", ""];
const ManageProduct = () => {
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const dispatch = useDispatch();
  const limit = params.get("limit") || 30;
  const page = params.get("page") || 1;
  const { data, url, loadingUpload } = useSelector((state) => state.product);
  const { data: categories } = useSelector((state) => state.category);
  const [search, setSearch] = useState("");
  const {
    value,
    handleChange,
    handleChangeImage,
    selectedImage,
    setValue,
    setSelectedImage,
  } = useProductForm({ search, limit, page });
  const [productId, setProductId] = useState(null);
  const [open, setOpen] = useState(false);
  const onUpdateProduct = async () => {
    try {
      const res = await api.put(`/products/${productId}`, value);
      toastify("success", res?.data?.message);
      await dispatch(getAllProducts({ search, limit, page }));
    } catch (error) {}
    handleOpen();
  };
  const handleOpen = () => setOpen(!open);
  const handleSelectedProduct = (id) => {
    const product = data?.data?.find((product) => product?.ID === id);
    if (product) {
      setValue({
        name: product?.name || "",
        price: product?.price || "",
        image: product?.image || "",
        discount: product?.discount || null,
        category_id: product?.category_id || null,
      });
      setProductId(product?.ID);
      setSelectedImage({ ...selectedImage, selected: product?.image });
    }
    handleOpen();
  };

  const handleDeleted = async (id) => {
    const validate = confirm("Are you sure you want to delete?");
    if (validate === true) {
      try {
        const res = await api.delete(`/products/${id}`);
        toastify("success", res?.data?.message);
        await dispatch(getAllProducts({ search, limit, page }));
      } catch (error) {}
    }
    console.log(validate, id);
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
  useEffect(() => {
    dispatch(getAllProducts({ search, limit, page }));
  }, [search, limit, page]);
  return (
    <div className="lg:h-full px-1 lg:px-0 lg:w-3/4 shadow-lg font-poppins rounded-md lg:ml-[300px] mt-10">
      <TransactionsTable
        TITLE={"Your Product"}
        SUBTITLE={"These are details about the product store"}
        search={search}
        setSearch={setSearch}
        placeholder={"Search product name..."}
        // handleSearch={handleSearch}
      >
        <CardBody className="overflow-x-auto px-0">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 text-sm font-medium text-blue-gray-600"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((item, index) => {
                const isLast = index === data?.data.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={item?.ID}>
                    <td className={classes}>
                      <div className="flex gap-2 items-center">
                        <img
                          src={item?.image}
                          alt=""
                          className="max-w-14 rounded-full"
                        />
                        <p className="text-sm">{item?.name}</p>
                      </div>
                    </td>
                    <td className={classes}>
                      <p className="text-sm">{formatIDR(item?.price)}</p>
                    </td>
                    <td className={classes}>
                      <p className="text-sm">{item?.discount} %</p>
                    </td>
                    <td className={classes}>
                      <p className="text-sm">{item?.code}</p>
                    </td>
                    <td>
                      <Tooltip content="Edit">
                        <button onClick={() => handleSelectedProduct(item?.ID)}>
                          <RiEditBoxLine />
                        </button>
                      </Tooltip>
                    </td>
                    <td>
                      <Tooltip content="Delete">
                        <button onClick={() => handleDeleted(item?.ID)}>
                          <CiTrash />
                        </button>
                      </Tooltip>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </TransactionsTable>
      <FormProduct
        FORM={FORM}
        categories={categories}
        handleChange={handleChange}
        handleChangeImage={handleChangeImage}
        handleOpen={handleOpen}
        loadingUpload={loadingUpload}
        onAddProduct={onUpdateProduct}
        open={open}
        selectedImage={selectedImage}
        setValue={setValue}
        value={value}
        title={"Update product"}
      />
    </div>
  );
};

export default ManageProduct;
