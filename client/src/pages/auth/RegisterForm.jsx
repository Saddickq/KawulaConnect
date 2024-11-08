import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";

const RegisterForm = ({ formData, handleChange, setUserInfo, setRedirect }) => {
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
        <Button className="w-full font-semibold mt-2" onClick={handleRegister}>
          register
        </Button>
      </div>
    </div>
  );
};

export default RegisterForm;
