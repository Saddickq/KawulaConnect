import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import { useState } from "react";
import Lottie from "lottie-react";
import { getColor } from "@/utils";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import kawulaAnimation from "@/assets/kawulaAnimation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/pages/store";

const NewDM = () => {
  const [error, setError] = useState("");
  const [searchedContacts, setSearchedContacts] = useState([]);
  const [contactSearchModal, setContactSearchModal] = useState(false);
  const { setSelectedChatType, setSelectedChatData } = useAppStore();

  const searchContacts = async (searchTerm) => {
    try {
      if (searchTerm.length > 0) {
        const { data, status } = await axios.post("/api/search_contacts", {
          searchTerm,
        });
        if (status === 200 && data.contacts) {
          setSearchedContacts(data.contacts);
        } else {
          setError(data.message);
        }
      } else {
        setSearchedContacts([]);
        setError("");
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const selectChat = (contact) => {
    setContactSearchModal(false);
    setSelectedChatData(contact);
    setSelectedChatType("contact");
    setSearchedContacts([]);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-300 size-4 transition-all duration-300 hover:opacity-50"
              onClick={() => setContactSearchModal(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="text-xs">
            <p className="">start a new chat</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={contactSearchModal} onOpenChange={setContactSearchModal}>
        <DialogContent className="bg-slate-900 border-none h-[450px] text-neutral-300 flex flex-col">
          <DialogHeader>
            <DialogTitle>Please search for a contact</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              onChange={(ev) => searchContacts(ev.target.value)}
              placeholder="Search Contacts"
              className="bg-slate-700 rounded-lg px-5 border-none"
            />
          </div>

          {searchedContacts.length <= 0 ? (
            <div className="flex flex-1 h-4 flex-col justify-center items-center transition-all duration-1000">
              <div className="">
                <Lottie
                  animationData={kawulaAnimation}
                  style={{ width: "300px", height: "300px" }}
                />
              </div>
              <div className="text-opacity-60 flex flex-col mb-16 items-center justify-center transition-all duration-500">
                <h3 className="font-semibold">
                  {error ? error : "Type your search to show contacts"}
                </h3>
              </div>
            </div>
          ) : (
            <ScrollArea className="flex flex-col mt-2">
              {searchedContacts.map((contact) => {
                return (
                  <div
                    key={contact._id}
                    className="flex relative hover:bg-slate-700 rounded-lg p-2 cursor-pointer items-center gap-5"
                    onClick={() => selectChat(contact)}
                  >
                    <Avatar className="w-10 h-10 overflow-hidden rounded-full">
                      {contact.avatar ? (
                        <AvatarImage src={contact.avatar} />
                      ) : (
                        <div
                          className={`uppercase w-10 h-10 text-lg flex justify-center items-center cursor-pointer rounded-full ${getColor(
                            contact.color
                          )}`}
                        >
                          {contact.firstName
                            ? contact.firstName.split("").shift()
                            : contact.email.split("").shift()}
                        </div>
                      )}
                    </Avatar>
                    <div className="flex flex-col">
                      <span>
                        {contact.firstName && contact.lastName ? (
                          <span className="text-neutral-100">
                            {contact.firstName} {contact.lastName}
                          </span>
                        ) : (
                          ""
                        )}
                      </span>
                      <span className="text-xs">{contact.email}</span>
                    </div>
                  </div>
                );
              })}
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDM;
