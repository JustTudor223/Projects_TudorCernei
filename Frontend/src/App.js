import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Store from "./pages/Store";
import Sales from "./pages/Sales";
import StoresMapPage from "./pages/StoresMap";
import PurchaseDetails from "./pages/PurchaseDetails";
import StatisticsPage from "./pages/Statistics";
import HomePageClient from "./pages/HomePageClient";
import StoresMapClient from "./pages/StoresMapClient";
import StorePageClient from "./pages/StoreClient";
import ProductsClient from "./pages/ProductsClient";
import NoPageFound from "./pages/NoPageFound";
import Layout from "./components/Layout";
import LayoutClient from "./components/LayoutClient";
import AuthContext from "./AuthContext";
import ProtectedWrapper from "./ProtectedWrapper";
import "./index.css";

const App = () => {
  const [user, setUser] = useState("");
  const [loader, setLoader] = useState(true);
  const myLoginUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (myLoginUser) {
      setUser(myLoginUser._id);
      setLoader(false);
    } else {
      setUser("");
      setLoader(false);
    }
  }, [myLoginUser]);

  const signin = (newUser, callback) => {
    setUser(newUser);
    callback();
  };

  const signout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = { user, signin, signout };

  if (loader) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1>LOADING...</h1>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedWrapper>
                <Layout />
              </ProtectedWrapper>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/purchase-details" element={<PurchaseDetails />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/manage-store" element={<Store />} />
            <Route path="/stores-map" element={<StoresMapPage />} />
            <Route path="/statistics" element={<StatisticsPage />} />
          </Route>
          <Route
            path="/client"
            element={
              <ProtectedWrapper>
                <LayoutClient />
              </ProtectedWrapper>
            }
          >
            <Route index element={<HomePageClient />} />
            <Route path="map" element={<StoresMapClient />} />
            <Route path="products" element={<ProductsClient />} />
            <Route path="stores" element={<StorePageClient />} />
          </Route>
          <Route path="*" element={<NoPageFound />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
