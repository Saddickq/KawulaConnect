import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/pages/store";
import { getColor } from "@/utils";
import axios from "axios";
import { IoIosPower } from "react-icons/io";
import { FaUserEdit } from "react-icons/fa";
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";

const ProfileBottom = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const navigate = useNavigate();
  const [redirect, setRedirect] = useState("");

  const handleLogout = async () => {
    const { data } = await axios.get("/auth/logout");
    setUserInfo("");
    setRedirect("/auth");
    toast(data.message, {
      type: "success",
      style: { backgroundColor: "#0f141e", color: "#fff", fontSize: 15 },
    });
  };

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="flex items-center justify-between h-[12vh] w-full">
      <div className="flex items-center w-full justify-between px-5 gap-4">
        <div className="flex relative items-center gap-5">
          <Avatar className="w-10 h-10 overflow-hidden rounded-full">
            {userInfo.avatar ? (
              <AvatarImage src={`http://localhost:3000/uploads/${userInfo.avatar}`} />
            ) : (
              <div
                className={`uppercase w-10 h-10 text-lg flex justify-center items-center rounded-full ${getColor(
                  userInfo.color
                )}`}
              >
                {userInfo.firstName
                  ? userInfo.firstName.split("").shift()
                  : userInfo.email.split("").shift()}
              </div>
            )}
          </Avatar>
          <div>
            {userInfo.firstName && userInfo.lastName ? (
              <span className="text-neutral-100">
                {userInfo.firstName} {userInfo.lastName}
              </span>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="flex gap-8">
          <FaUserEdit
            className="cursor-pointer hover:opacity-80 size-7 text-neutral-100"
            onClick={() => navigate("/profile")}
          />
          <IoIosPower
            onClick={handleLogout}
            className="cursor-pointer hover:opacity-80 size-7 text-red-500"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileBottom;
