import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatIDR, parseIDR } from "../utils/formatIDR";
import {
  addProducts,
  getAllProducts,
  uploadImageProduct,
} from "../configs/redux/features/productSlice";
import { toastify } from "../components/base/toastify";

const useProductForm = ({ search, limit, page }) => {
  const dispatch = useDispatch();
  const { loadingAdd, loadingUpload } = useSelector((state) => state.product);

  const [selectedImage, setSelectedImage] = useState({
    selected: null,
    file: null,
  });

  const [value, setValue] = useState({
    name: "",
    price: null,
    image: "",
    discount: 0,
    category_id: null,
  });

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "price") {
      value = value.replace(/\D/g, "");
      value = formatIDR(value);
    } else if (name === "discount") {
      if (value === "") {
        value = 0;
      }
      value = parseInt(value);
    }
    setValue((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };

  const handleChangeImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage({ selected: event.target.result, file });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const price = parseIDR(value.price);
    let newData = { ...value, price };
    const res = await dispatch(addProducts(newData));
    await dispatch(getAllProducts({ search, limit, page }));
    if (!loadingAdd) {
      toastify("success");
    }
  };

  useEffect(() => {
    const uploadImage = async () => {
      const res = await dispatch(uploadImageProduct(selectedImage.file));
      if (res.type !== "product/uploadImage/fulfilled") {
        toastify("error", res.payload.response.data);
      }
      if (res.payload.url) {
        setValue((prevValue) => ({ ...prevValue, image: res.payload.url }));
      }
    };
    if (selectedImage.file) {
      uploadImage();
    }
  }, [selectedImage, dispatch]);

  return {
    value,
    handleChange,
    handleChangeImage,
    handleSubmit,
    loadingAdd,
    loadingUpload,
    selectedImage,
    setValue,
    setSelectedImage,
  };
};

export default useProductForm;
