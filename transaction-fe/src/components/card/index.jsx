import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6";
import { formatIDR } from "../../utils/formatIDR";

const Card = ({
  image,
  name,
  code,
  price,
  quantity,
  addToCart,
  onIncrement,
  onDecrement,
  discount,
}) => {
  return (
    <div className="shadow-2xl h-[250px] w-[175px] lg:w-[220px] flex flex-col justify-between bg-white lg:min-h-[350px] 3xl:w-[250px] 3xl:h-[300px] rounded-md">
      <div>
        <div className="w-full h-[100px] lg:h-[200px] rounded-md">
          <img
            src={image}
            alt=""
            className="w-full h-full object-cover rounded"
          />
        </div>
        <div className="px-3 py-1">
          <h1 className="font-semibold tracking-wider">{name}</h1>
          <p className="text-main-grey text-sm">{code}</p>
        </div>
      </div>
      <div className="py-2  px-4 bg-white">
        <div className="flex justify-between items-center mt-4">
          <p className="text-main-blue font-semibold">
            {discount > 0 ? (
              <>
                <p className="ordinal">
                  {formatIDR(price - discount * 100)}
                  <small className="line-through text-red-500 text-xs block">
                    {formatIDR(price)}
                  </small>
                </p>
              </>
            ) : (
              formatIDR(price)
            )}
          </p>
          <div className="flex gap-2">
            {quantity >= 1 && (
              <>
                <button onClick={onDecrement}>
                  <FaCircleMinus className="text-red-500" size={20} />
                </button>
                <p>{quantity}</p>
              </>
            )}
            <button onClick={quantity < 1 ? addToCart : onIncrement}>
              <FaCirclePlus className="text-blue-500" size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Card;
