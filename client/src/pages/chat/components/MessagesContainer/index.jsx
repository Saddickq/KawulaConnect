import MessageBar from "./MessageBar";
import MessageField from "./MessagesField";
import MessageHeader from "./MessagesHeader";

const MessagesContainer = () => {
  return (
    <div className="flex absolute flex-col w-full h-full">
      <MessageHeader />
      <MessageField />
      <MessageBar />
    </div>
  );
};

export default MessagesContainer;
