import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  Input,
} from "@material-tailwind/react";
import { CiSearch } from "react-icons/ci";
import { formatedDate } from "../../utils/formatedDate";
import { formatIDR } from "../../utils/formatIDR";


export default function TransactionsTable({
  search,
  setSearch,
  handleSearch,
  children,
  placeholder,
  TITLE,
  SUBTITLE
}) {
  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <Typography variant="h5" color="blue-gray">
             {TITLE}
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              {SUBTITLE}
            </Typography>
          </div>
          <div className="flex w-full shrink-0 gap-2 md:w-max">
            <div className="w-full md:w-72">
              <Input
                label={placeholder}
                icon={
                  <CiSearch
                    className="h-5 w-5 cursor-pointer"
                    onClick={handleSearch}
                  />
                }
                name="search"
                value={search}
                type="search"
                onChange={(e) => setSearch(e?.target?.value)}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      {children}
    </Card>
  );
}
