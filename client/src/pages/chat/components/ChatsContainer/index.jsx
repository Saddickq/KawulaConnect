import Lottie from "lottie-react";
import kawulaAnimation from "@/assets/kawulaAnimation.json";

const ChatsContainer = () => {
  return (
    <div className="hidden md:flex flex-1 h-screen flex-col justify-center items-center transition-all duration-1000">
      <div className="">
        <Lottie animationData={kawulaAnimation} />
      </div>
      <div className="text-opacity-60 flex flex-col items-center justify-center transition-all duration-500">
        <h3>
          Welcome to <span className="text-2xl font-bold ">Kawula</span> chat
          App
        </h3>
      </div>
    </div>
  );
};
export default ChatsContainer;
