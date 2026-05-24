import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./styles/layout.css";

import Login from "./pages/Login";

import Home from "./pages/Home";
import DiseaseDetection from "./pages/DiseaseDetection";
import YieldImpact from "./pages/YieldImpact";
import Weather from "./pages/Weather";
import Market from "./pages/MarketPrices";
import Regression from "./pages/Regression";
import TimeSeries from "./pages/TimeSeries";
import Insights from "./pages/Insights";
import Profile from "./pages/Profile";

import ConsumerHome from "./pages/ConsumerHome";
import Marketplace from "./pages/Marketplace";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";

import Orders from "./pages/Orders";
import AddProduct from "./pages/AddProduct";
import MyProducts from "./pages/MyProducts";

const isLoggedIn = () =>
  localStorage.getItem("userId");

/* 🔐 PROTECTED ROUTE */
function Protected({ children }) {

  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

/* 🚀 APP */
export default function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* ROOT */}
        <Route
          path="/"
          element={
            isLoggedIn()
              ? (
                  <Navigate
                    to="/home"
                    replace
                  />
                )
              : (
                  <Navigate
                    to="/login"
                    replace
                  />
                )
          }
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* 🔥 FARMER ROUTES */}

        <Route
          path="/home"
          element={
            <Protected>
              <Home />
            </Protected>
          }
        />

        <Route
          path="/disease"
          element={
            <Protected>
              <DiseaseDetection />
            </Protected>
          }
        />

        <Route
          path="/yield"
          element={
            <Protected>
              <YieldImpact />
            </Protected>
          }
        />

        <Route
          path="/weather"
          element={
            <Protected>
              <Weather />
            </Protected>
          }
        />

        <Route
          path="/market"
          element={
            <Protected>
              <Market />
            </Protected>
          }
        />

        <Route
          path="/regression"
          element={
            <Protected>
              <Regression />
            </Protected>
          }
        />

        <Route
          path="/timeseries"
          element={
            <Protected>
              <TimeSeries />
            </Protected>
          }
        />

        <Route
          path="/insights"
          element={
            <Protected>
              <Insights />
            </Protected>
          }
        />

        <Route
          path="/profile"
          element={
            <Protected>
              <Profile />
            </Protected>
          }
        />

        <Route
          path="/my-products"
          element={
            <Protected>
              <MyProducts />
            </Protected>
          }
        />

        <Route
          path="/orders"
          element={
            <Protected>
              <Orders />
            </Protected>
          }
        />

        <Route
          path="/add-products"
          element={
            <Protected>
              <AddProduct />
            </Protected>
          }
        />

        {/* 🔥 CONSUMER ROUTES */}

        <Route
          path="/consumer"
          element={
            <Protected>
              <ConsumerHome />
            </Protected>
          }
        />

        <Route
          path="/marketplace"
          element={
            <Protected>
              <Marketplace />
            </Protected>
          }
        />

        <Route
          path="/cart"
          element={
            <Protected>
              <Cart />
            </Protected>
          }
        />

        <Route
          path="/checkout"
          element={
            <Protected>
              <Checkout />
            </Protected>
          }
        />

        <Route
          path="/my-orders"
          element={
            <Protected>
              <MyOrders />
            </Protected>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}