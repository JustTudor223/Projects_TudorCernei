import React from "react";
import { Outlet } from "react-router-dom";
import ClientHeader from "./ClientHeader";
import ClientSideMenu from "./ClientSideMenu";

function LayoutClient() {
  return (
    <>
      <div className="md:h-16">
        <ClientHeader />
      </div>
      <div className="grid grid-cols-12 bg-gray-100 items-baseline">
        <div className="col-span-2 h-screen sticky top-0 hidden lg:flex">
          <ClientSideMenu />
        </div>
        <Outlet />
      </div>
    </>
  );
}

export default LayoutClient;
