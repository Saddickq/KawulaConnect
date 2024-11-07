import { useAppStore } from "@/pages/store";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/utils";

const ContactList = ({ contacts, isChannel = false }) => {
  const {
    setSelectedChatType,
    selectedChatData,
    setSelectedChatData,
    setSelectedChatMessages,
  } = useAppStore();

  const handleClick = (contact) => {
    if (isChannel) setSelectedChatType("channel");
    else setSelectedChatType("contact");
    setSelectedChatData(contact);
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };
  return (
    <div className="mt-5">
      {contacts.map((contact) => {
        return (
          <div
            key={contact._id}
            className={`pl-10 cursor-pointer mx-5 my-2 p-1 flex rounded-xl items-center gap-4 duration-500 transition-all ${
              selectedChatData && selectedChatData._id === contact._id
                ? "bg-white text-neutral-900"
                : "text-neutral-200 hover:bg-slate-600"
            }`}
            onClick={() => handleClick(contact)}
          >
            {!isChannel && (
              <Avatar className="w-8 h-8 overflow-hidden rounded-full">
                {contact.image ? (
                  <AvatarImage src={contact.image} alt="profile" />
                ) : (
                  <div
                    className={`uppercase w-8 h-8 text-lg flex justify-center items-center cursor-pointer rounded-full ${getColor(
                      contact.color
                    )}`}
                  >
                    {contact.firstName
                      ? contact.firstName.split("").shift()
                      : contact.email.split("").shift()}
                  </div>
                )}
              </Avatar>
            )}
            {isChannel && (
              <div className="text-slate-900 h-8 w-8 flex items-center justify-center bg-white font-semibold rounded-full">
                #
              </div>
            )}
            {isChannel ? (
              <span>{contact.name}</span>
            ) : (
              <span>{`${contact.firstName} ${contact.lastName}`}</span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ContactList;
