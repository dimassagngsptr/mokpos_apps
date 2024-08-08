import { useEffect, useState } from "react";
import { api } from "../../configs/api";
import BarChart from "../../components/chart";
import { formatedDate } from "../../utils/formatedDate";
import TransactionsTable from "../../components/table";
import { useNavigate } from "react-router-dom";
import { CardBody, Typography } from "@material-tailwind/react";
import { formatIDR } from "../../utils/formatIDR";

const TABLE_HEAD = [
  "Code",
  "Date",
  "Customer",
  "Item Quantity",
  "Subtotal",
  "Discount",
  "Shipping fee",
  "Total",
  "",
];
const Transactions = () => {
  const params = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const code = params.get("code") || "";
  const [search, setSearch] = useState("");
  const handleSearch = () => {
    navigate(`/transaction?code=${search}`);
  };
  const [transaction, setTransaction] = useState();
  const getTransactions = async (code) => {
    try {
      const res = await api.get("/transactions", {
        params: {
          code,
        },
      });
      setTransaction(res?.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getTransactions(code);
  }, [code]);
  console.log(transaction);

  return (
    <div className="px-3 lg:px-0 lg:h-full py-5 lg:w-full">
      <BarChart transactions={transaction?.data} />
      <div className="lg:h-full px-1 lg:px-0 lg:w-3/4 shadow-lg font-poppins rounded-md lg:ml-[300px] mt-10">
        <TransactionsTable
          TITLE={"Recent Transactions"}
          SUBTITLE={"These are details about the last transactions"}
          search={search}
          setSearch={setSearch}
          placeholder={"Search code transactions..."}
          handleSearch={handleSearch}
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
                {transaction?.data?.map((item, index) => {
                  const isLast = index === transaction.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={item?.ID}>
                      <td className={classes}>
                        <p className="text-sm">{item?.code}</p>
                      </td>
                      <td className={classes}>
                        <p className="text-sm">{formatedDate(item?.date)}</p>
                      </td>
                      <td className={classes}>
                        <p className="text-sm">{item?.Customer?.name}</p>
                      </td>
                      <td className={classes}>
                        <p className="text-sm">{item?.detail?.length}</p>
                      </td>
                      <td className={classes}>
                        <p className="text-sm">{formatIDR(item?.subtotal)}</p>
                      </td>
                      <td className={classes}>
                        <p className="text-sm">{formatIDR(item?.discount)}</p>
                      </td>
                      <td className={classes}>
                        <p className="text-sm">
                          {formatIDR(item?.shipping_price)}
                        </p>
                      </td>
                      <td className={classes}>
                        <p className="text-sm">
                          {formatIDR(item?.total_payment)}
                        </p>
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <td colSpan="7" className="p-4 font-semibold text-sm">
                    Grand Total
                  </td>
                  <td className="p-4 font-semibold text-sm">
                    {formatIDR(
                      transaction?.data?.reduce(
                        (total, item) => total + item?.total_payment,
                        0
                      )
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </CardBody>
        </TransactionsTable>
      </div>
    </div>
  );
};
export default Transactions;
