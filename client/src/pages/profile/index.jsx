import axios from "axios";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useAppStore } from "../store";
import { colors, getColor } from "@/utils";
import { IoArrowBack } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaTrash, FaPlus } from "react-icons/fa";
import { Navigate, useNavigate } from "react-router-dom";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const Profile = () => {
    const { userInfo, setUserInfo } = useAppStore();
  const navigate = useNavigate();
  
  const [image, setImage] = useState(null);
  const [redirect, setRedirect] = useState("");
  const [lastName, setLastName] = useState("");
  const [hovered, setHovered] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [selectedColor, setSelectedColor] = useState(0);
  
//   useEffect(() => {
//     if (userInfo.profileSetup === true) {
//       navigate("/chat");
//     }
//   }, []);

  const saveChanges = async () => {
    if (!firstName || !lastName) {
      toast("Please provide all Credentials to proceed", {
        type: "error",
        style: { backgroundColor: "#0f141e", color: "#fff", fontSize: 15 },
      });
      return;
    }

    try {
      await axios
        .put("/api/v1/updateUser", { firstName, lastName, selectedColor })
        .then(({ data }) => {
          setUserInfo(data);
          setRedirect("/chat");
        });
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
    <div className="h-[100vh] flex justify-center items-center flex-col">
      <div className="flex flex-col gap-10 w-[80vw] md:w-[45vw]">
        <div>
          <IoArrowBack
            onClick={() => navigate("/auth")}
            className="size-8 text-slate-700 cursor-pointer hover:bg-slate-600 rounded-full p-1"
          />
        </div>
        <div className="grid grid-cols-2">
          <div
            className={`w-32 h-32 md:w-40 md:h-40 border-2 rounded-full flex justify-center cursor-pointer items-center p-4 ${getColor(
              selectedColor
            )}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="justify-center items-center">
              {image ? (
                <AvatarImage src={image} />
              ) : (
                <div className="text-4xl uppercase">
                  {firstName
                    ? firstName.split("").shift()
                    : userInfo.email.split("").shift()}
                </div>
              )}
            </Avatar>
            {hovered && (
              <>
                <div className="absolute w-32 h-32 md:w-40 md:h-40 insert-0 flex justify-center items-center cursor-pointer bg-black/50 rounded-full">
                  {image ? (
                    <FaTrash className="text-3xl text-white" />
                  ) : (
                    <FaPlus className="text-3xl text-white" />
                  )}
                </div>
                <input className="hidden" type="file" />
              </>
            )}
          </div>
          <div className="space-y-3 md:space-y-5">
            <Input disabled placeholder={userInfo.email} />
            <Input
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <div className="flex gap-3 w-full">
              {colors.map((color, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => setSelectedColor(index)}
                    className={`h-8 w-8 ${color} rounded-full cursor-pointer 
                    ${
                      selectedColor === index
                        ? "outline outline-1 outline-white"
                        : ""
                    }`}
                  ></div>
                );
              })}
            </div>
          </div>
        </div>
        <Button onClick={saveChanges}>Save Changes</Button>
      </div>
    </div>
  );
};

export default Profile;
