import React, { useEffect, useState } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Auth from "./pages/auth";
import Profile from "./pages/profile";
import Chat from "./pages/chat";
import axios from "axios";
import { Toaster } from "@/components/ui/sonner";
import { useAppStore } from "./pages/store";
import kawula from "../public/KawulaConnect.png";


const ProtectedRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/auth" replace />,
  },
  {
    path: "/auth",
    element: (
      <Auth />
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/chat",
    element: (
      <ProtectedRoute>
        <Chat />
      </ProtectedRoute>
    ),
  },
]);
// "http://localhost:3000"
axios.defaults.baseURL = "https://kawula-connect.onrender.com";
axios.defaults.withCredentials = true;

const App = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);

  const getUserInfo = async () => {
    try {
      await axios.get("/api/v1/profile").then(({ data }) => {
        setUserInfo(data);
      });
    } catch (error) {
      console.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userInfo) {
      getUserInfo();
    } else {
      setLoading(false);
    }
  }, [userInfo]);

  if (loading) {
    return (
      <div className="h-full w-full text-slate-800 fixed top-0 z-[100] left-0 bg-white/20 flex gap-4 items-center justify-center flex-col backdrop-blur-lg">
        <div className="w-72 h-72">
          <img src={kawula} alt="loading logo" className="animate-pulse"/>
        </div>
      </div>
    );
  }
  return (
    <div>
      <RouterProvider router={router} />
      <Toaster />
    </div>
  );
};

export default App;
