import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigate } from "react-router-dom";
import myImage from "@/assets/kawula.png";
import { useAppStore } from "../store";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

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

            <TabsContent value="login">
              <LoginForm
                formData={formData}
                handleChange={handleChange}
                setUserInfo={setUserInfo}
                setRedirect={setRedirect}
              />
            </TabsContent>

            <TabsContent value="register">
              <RegisterForm
                formData={formData}
                handleChange={handleChange}
                setUserInfo={setUserInfo}
                setRedirect={setRedirect}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Auth;
