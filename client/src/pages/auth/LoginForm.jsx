import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { useState } from "react";

import { AiOutlineLoading } from "react-icons/ai";

const LoginForm = ({ formData, handleChange, setUserInfo, setRedirect }) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      toast("Please provide all Credentials", {
        type: "error",
        style: { backgroundColor: "#0f141e", color: "#fff", fontSize: 15 },
      });
      return;
    }
    try {
      setIsLoading(true);
      const { data, status } = await axios.post("/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      if (status === 200 && data.token) {
        localStorage.setItem("token", data.token)
        setUserInfo(data.user);
        setIsLoading(false);
        setRedirect("/chat");
        toast(data.message, {
          type: "success",
          style: { backgroundColor: "#0f141e", color: "#fff", fontSize: 15 },
        });
      } else {
        setIsLoading(false);
        toast(data.message, {
          type: "error",
          style: { backgroundColor: "#0f141e", color: "#fff", fontSize: 15 },
        });
      }
    } catch (error) {
      setIsLoading(false);
      toast(error.response.data.message, {
        type: "error",
        style: { backgroundColor: "#0f141e", color: "#fff", fontSize: 15 },
      });
    }
  };

  return (
    <div className="space-y-3">
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
          className="w-full font-semibold mt-4 flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading && (
            <AiOutlineLoading className="animate-spin size-5 font-bold mr-3 text-white" />
          )}
          {isLoading ? "Please wait..." : "Login"}
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;
