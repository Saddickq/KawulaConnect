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
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/pages/store";
import { Button } from "@/components/ui/button";

const NewChannel = () => {
  const { setSelectedChatType, setSelectedChatData, addChannels, setChannels } =
    useAppStore();
  const [error, setError] = useState("");
  const [channelModal, setChannelModal] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [channelName, setChannelName] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        const { data, status } = await axios.get("api/get_all_contacts");
        if (data.contacts && status === 200) {
          setAllContacts(data.contacts);
        }
        setError(data.message);
      } catch (error) {
        setError(error);
      }
    };
    getData();
  }, []);

  const animatedComponents = makeAnimated();

  const customStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "#374151",
      border: "none",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#4b5563" : "#374151",
      color: "white",
    }),
  };

  const createChannel = async () => {
    try {
      const { data, status } = await axios.post("/api/channels", {
        name: channelName,
        members: selectedContacts.map((contact) => contact.value),
      });
      if (data.channel && (status === 201)) {
        setChannelName("");
        setSelectedContacts([]);
        setChannelModal(false);
        addChannels(data.channel);
      }
    } catch (error) {}
  };
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-300 size-4 transition-all duration-300 hover:opacity-50"
              onClick={() => setChannelModal(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="text-xs">
            <p className="">Create New Channel</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={channelModal} onOpenChange={setChannelModal}>
        <DialogContent className="bg-slate-900 border-none h-[450px] text-neutral-300 flex flex-col">
          <DialogHeader>
            <DialogTitle>Create A New Channel</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              onChange={(ev) => setChannelName(ev.target.value)}
              value={channelName}
              placeholder="Channel Name"
              className="bg-slate-700 rounded-lg px-5 border-none"
            />
          </div>
          <div>
            <Select
              closeMenuOnSelect={false}
              components={animatedComponents}
              defaultValue={selectedContacts}
              onChange={setSelectedContacts}
              isMulti
              styles={customStyles}
              placeholder="Select friends to create channel"
              options={allContacts}
            />
          </div>
          <div>
            <Button
              onClick={createChannel}
              className="bg-neutral-100 hover:bg-neutral-400 text-slate-800 font-semibold transition-all duration-300 w-full"
            >
              Create Channel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewChannel;
