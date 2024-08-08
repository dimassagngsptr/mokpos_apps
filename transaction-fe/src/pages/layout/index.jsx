import { Outlet } from "react-router-dom";
import { Navbar } from "../../components/navbar";

const Layout = () => {
  return (
    <div className="bg-gray-100 lg:flex">
      <Navbar />
      <Outlet />  
    </div>
  );
};

export default Layout;
