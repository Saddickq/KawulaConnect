import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { AiOutlineLoading } from "react-icons/ai";
import { useState } from "react";

const RegisterForm = ({ formData, handleChange, setUserInfo, setRedirect }) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleRegister = async () => {
    if (formData.confirmPassword !== formData.password) {
      toast("Passwords do not match", {
        type: "error",
        style: { backgroundColor: "#0f141e", color: "#fff", fontSize: 15 },
      });
      return;
    }
    try {
      setIsLoading(true);
      const { data, status } = await axios.post("/auth/register", {
        email: formData.email,
        password: formData.password,
      });
      if (data.newUser && status === 201) {
        setUserInfo(data.newUser);
        setIsLoading(false);
        setRedirect("/profile");
        toast(data.message, {
          type: "success",
          style: { backgroundColor: "#0f141e", color: "#fff", fontSize: 15 },
        });
      }
      setIsLoading(false);
      toast(data.message, {
        type: "info",
        style: { backgroundColor: "#0f141e", color: "#fff", fontSize: 15 },
      });
    } catch (error) {
      setIsLoading(false);
      toast(error.response.data.message, {
        type: "error",
        style: { backgroundColor: "#0f141e", color: "#fff", fontSize: 15 },
      });
    }
  };
  return (
    <div className="space-y-2">
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
          disabled={isLoading}
          onClick={handleRegister}
        >
          {isLoading && (
            <AiOutlineLoading className="animate-spin size-5 font-bold mr-3 text-white" />
          )}
          {isLoading ? "Please wait..." : "Register"}
        </Button>
      </div>
    </div>
  );
};

export default RegisterForm;
