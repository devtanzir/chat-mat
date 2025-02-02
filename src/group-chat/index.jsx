import { useState, useEffect } from "react";
import { createData, findRealTime, updateData } from "../firebase/models";
import LocalStorageUtil from "../utils/local-storage";
import { lsKeyName } from "../../config";
import Modal from "./components/modal";
import useToggler from "../hooks/useToggler";
import { serverTimestamp } from "firebase/firestore";
import Swal from "sweetalert2";

import Header from "./components/header";
import ChatArea from "./components/chat-area";
import ChatInput from "./components/chat-input";

const GroupChat = () => {
  const initialState = {
    text: "",
    isEditing: false,
  };
  const [newMessage, setNewMessage] = useState({
    ...initialState,
  });
  const [chatData, setChatData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const { open: token, handleToggle: handleToken } = useToggler();
  const [currentId, setCurrentId] = useState("");
  const [loader, setLoader] = useState(false);

  const getData = async () => {
    await findRealTime("chats", setChatData);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loader) return;
    if (newMessage.text.trim() === "") return;
    if (!userData) {
      Swal.fire({
        icon: "error",
        title: "Unauthorized",
        text: "Please Submit Your Information.",
      });
      setModalOpen(true);
      return;
    }
    if (userData.username.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unauthorize!",
      });
      return;
    }
    if (userData.avatar.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unauthorize!",
      });
      return;
    }

    try {
      setLoader(true);
      if (!newMessage.isEditing) {
        await createData("chats", {
          username: userData.username,
          avatar: userData.avatar,
          text: newMessage.text,
          authId: userData?.authId,
          createdAt: serverTimestamp(),
          updatedAt: null,
        });
      }
      if (newMessage.isEditing) {
        await updateData("chats", currentId, {
          text: newMessage.text,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setNewMessage({ ...initialState });
      setLoader(false);
    }
  };

  useEffect(() => {
    getData();
    const item = LocalStorageUtil.exists(lsKeyName);
    if (!item) {
      setModalOpen(true);
      setUserData(null);
    } else {
      const userInfo = LocalStorageUtil.getItem(lsKeyName);
      setUserData(userInfo);
    }
  }, [token]);
  return (
    <div className="flex flex-col h-screen bg-chat-bg">
      <Modal open={modalOpen} handleToggle={setModalOpen} token={handleToken} />

      {/* Header */}
      <Header
        userData={userData}
        handleToken={handleToken}
        setModalOpen={setModalOpen}
      />
      {/* Chat Area */}
      <ChatArea
        chatData={chatData}
        userData={userData}
        currentId={currentId}
        setCurrentId={setCurrentId}
        setNewMessage={setNewMessage}
      />
      {/* Message Input */}
      <ChatInput
        handleSubmit={handleSubmit}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        loader={loader}
      />
    </div>
  );
};
export default GroupChat;
