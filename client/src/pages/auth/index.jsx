import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import myImage from "@/assets/kawula.png";
import axios from "axios";
import { useAppStore } from "../store";

const Auth = () => {
  const { setUserInfo } = useAppStore();
  const [redirect, setRedirect] = useState(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const handleRegister = async () => {
    if (formData.confirmPassword !== formData.password) {
      toast("Passwords do not match", {
        type: "error",
        style: { backgroundColor: "#0f141e", color: "#fff", fontSize: 15 },
      });
      return;
    }
    try {
      const { data } = await axios.post("/auth/register", {
        email: formData.email,
        password: formData.password,
      });
      setUserInfo(data.newUser);
      setRedirect("/profile");
      toast(data.message, {
        type: "info",
        style: { backgroundColor: "#0f141e", color: "#fff", fontSize: 15 },
      });
    } catch (error) {
      toast(error.response.data.message, {
        type: "error",
        style: { backgroundColor: "#0f141e", color: "#fff", fontSize: 15 },
      });
    }
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      toast("Please provide all Credentials", {
        type: "error",
        style: { backgroundColor: "#0f141e", color: "#fff", fontSize: 15 },
      });
      return;
    }
    try {
      const { data, status } = await axios.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      if (status === 200) {
        setUserInfo(data.user);
        setRedirect("/chat");
        toast(data.message, {
            type: "success",
            style: { backgroundColor: "#0f141e", color: "#fff", fontSize: 15 },
          });
      } else {
        toast(data.message, {
            type: "error",
            style: { backgroundColor: "#0f141e", color: "#fff", fontSize: 15 },
          });
      }
    } catch (error) {
      toast(error.response.data.message, {
        type: "error",
        style: { backgroundColor: "#0f141e", color: "#fff", fontSize: 15 },
      });
    }
  };

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="shadow-xl p-6 w-[85vw] md:p-10 md:w-[55vw] lg:p-12 lg:w-[40vw] rounded-2xl flex flex-col justify-center items-center gap-3">
        <div className="flex items-end gap-2">
          <h1 className="text-3xl -mb-2 text-slate-800">Kawula</h1>
          <img src={myImage} alt="Kawula" className="size-10" />
        </div>
        <p className="">Sign in to chat with friends</p>
        <div className="w-full">
          <Tabs defaultValue="login" className="flex gap-2 flex-col">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-slate-800 data-[state=active]:text-white transition-all duration-300"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="data-[state=active]:bg-slate-800 data-[state=active]:text-white transition-all duration-300"
              >
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-2">
              <Input
                placeholder="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <Input
                placeholder="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <div>
                <Button
                  onClick={handleLogin}
                  className="w-full font-semibold mt-4"
                >
                  login
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="register" className="space-y-2">
              <Input
                placeholder="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <Input
                placeholder="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <Input
                placeholder="Confirm password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <div className="">
                <Button
                  className="w-full font-semibold mt-2"
                  onClick={handleRegister}
                >
                  register
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Auth;
