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

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
};

const ProtectedRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const router = createBrowserRouter([
  {
    path: "/auth",
    element: (
    //   <AuthRoute>
        <Auth />
    //   </AuthRoute>
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
    return <div>Loading...</div>;
  }
  return (
    <div>
      <RouterProvider router={router} />
      <Toaster />
    </div>
  );
};

export default App;
