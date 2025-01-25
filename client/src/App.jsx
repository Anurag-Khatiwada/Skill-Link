import React from "react";
import "./App.css"
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import Add from "./pages/add/Add"
import Gig from "./pages/gig/Gig"
import Gigs from "./pages/gigs/Gigs"
import Login from "./pages/login/Login"
import Message from "./pages/message/Message"
import Messages from "./pages/messages/Messages"
import MyGigs from "./pages/myGigs/MyGigs"
import Orders from "./pages/orders/Orders"
import Register from "./pages/register/Register"
import Pay from "./pages/pay/Pay"
import Success from "./pages/success/Success"
import Profile from "./pages/profile/Profile";
import Chatbot from "./components/chatbot/Chatbot";
import PaymentSuccess from "./pages/payment-success/PaymentSuccess"
import PaymentFailure from "./pages/payment-failure/PaymentFailure"



import {
  createBrowserRouter,
  RouterProvider,
  Outlet
} from "react-router-dom";

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'

function App() {

  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  const queryClient = new QueryClient()


  const Layout = () => {
    return (
      <div className="app">
        <QueryClientProvider client={queryClient}>
          <Navbar />
          <Outlet />
          {
            currentUser && !currentUser.isFreelancer && <Chatbot />
          }
          <Footer />
        </QueryClientProvider>

      </div>
    )
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />
        },
        {
          path: "/add",
          element: <Add />
        },
        {
          path: "/gigs",
          element: <Gigs />
        },
        {
          path: "/gig/:id",
          element: <Gig />
        },
        {
          path: "/login",
          element: <Login />
        },
        {
          path: "/message/:id",
          element: <Message />
        },
        {
          path: "/messages",
          element: <Messages />
        },   {
          path: "/myGigs",
          element: <MyGigs />
        },
        {
          path: "/orders",
          element: <Orders />
        },  
        {
          path: "/register",
          element: <Register />
        },
        {
          path: "/pay/:id",
          element: <Pay />
        },
        {
          path: "/success",
          element: <Success />
        },
        {
          path: "/profile/:id",
          element: <Profile/>
        },
        {
          path: "/payment-success",
          element: <PaymentSuccess/>
        },
        {
          path: "/payment-failure",
          element: <PaymentFailure/>
        },

      ]
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
