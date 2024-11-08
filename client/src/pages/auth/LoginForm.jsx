import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";

const LoginForm = ({ formData, handleChange, setUserInfo, setRedirect }) => {

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
        <Button onClick={handleLogin} className="w-full font-semibold mt-4">
          login
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;
