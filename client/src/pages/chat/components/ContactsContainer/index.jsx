import { useEffect } from "react";
import NewDM from "./NewDM";
import ProfileBottom from "./ProfileFooter";
import axios from "axios";
import { useAppStore } from "@/pages/store";
import ContactList from "./ContactList";

const ContactsContainer = () => {
  const { setDirectMessageContacts, directMessageContacts } = useAppStore();
  useEffect(() => {
    const getContactList = async () => {
      try {
        const { data, status } = await axios.get("/api/get_contacts_list");
        if (data.contacts && status === 200) {
          setDirectMessageContacts(data.contacts);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getContactList();
  }, []);
  return (
    <div className="bg-slate-800  w-full h-full">
      <div className="h-[10vh] flex items-center">
        <h1 className="text-3xl font-bold text text-neutral-50 pl-5">logo</h1>
      </div>
      <div className="my-8 ">
        <div className="flex items-center justify-between pr-10">
          <Title text="direct messages" />
          <NewDM />
        </div>
        <div className="overflow-y-auto">
            <ContactList contacts={directMessageContacts} />
        </div>
      </div>
      <div className="">
        <div className="flex items-center justify-between pr-10">
          <Title text="channels" />
          <NewDM />
        </div>
      </div>
      <div className="">
        <ProfileBottom />
      </div>
    </div>
  );
};

export default ContactsContainer;

const Title = ({ text }) => {
  return (
    <h5 className="tracking-widest uppercase pl-10 text-neutral-50 font-light text-sm text-opacity-80">
      {text}
    </h5>
  );
};
