import { Option, Select } from "@material-tailwind/react";
import Input from "../../base/input";
import Modal from "../../modal";
import Spinner from "../../base/spinner";

const FormProduct = ({
  open,
  handleOpen,
  onAddProduct,
  loadingUpload,
  value,
  FORM,
  categories,
  setValue,
  selectedImage,
  handleChange,
  handleChangeImage,
  title
}) => {
  return (
    <Modal
      isOpen={open}
      onClose={handleOpen}
      title={title}
      onSubmit={onAddProduct}
      btnTitle={!loadingUpload ? "Submit" : <Spinner />}
      disabled={
        value?.image === "" || value?.name === "" || value?.category_id === 0
      }
    >
      {FORM.map((item, idx) => (
        <div key={idx} className="mt-3">
          <Input
            label={item?.label}
            placeholder={item?.placeholder}
            name={item?.name}
            value={item?.value}
            type={item?.type}
            onChange={handleChange}
            required="required"
            className="border border-gray-300 p-2 rounded-md outline-none"
            style="text-gray-500"
          />
        </div>
      ))}
      <div className="w-full mt-3">
        <Select
          variant="outlined"
          size="lg"
          className="outline-gray-300"
          label="Select Category"
          value={value?.category_id}
          onChange={(val) => setValue({ ...value, category_id: val })}
        >
          {categories?.data?.map((item) => (
            <Option key={item?.ID} value={item?.ID}>
              {item?.name}
            </Option>
          ))}
        </Select>
      </div>
      <div
        className="relative h-[200px] w-[330px] lg:w-[400px] lg:h-[150px] rounded-md mt-2 border border-gray-300 flex justify-center items-center"
        style={{
          backgroundImage: `url(${selectedImage?.selected})`,
          backgroundSize: " cover",
          backgroundPosition: "center",
          opacity: 0.7,
        }}
      >
        <Input
          name="file"
          onChange={handleChangeImage}
          type="file"
          placeholder="Input images"
          className="absolute top-0 left-0 w-full lg:w-full opacity-0 h-[200px] lg:h-[150px] z-10 cursor-pointer"
        />
        {!selectedImage?.selected ? (
          <p className="text-center">
            Upload images
            <span className="block text-xs">Format: png/jpg/jpeg, max 2MB</span>
          </p>
        ) : null}
      </div>
    </Modal>
  );
};

export default FormProduct;
