import { useState, useEffect } from "react";
import { createData, findRealTime, updateData } from "../firebase/models";
import LocalStorageUtil from "../utils/local-storage";
import {
  cloudName,
  cloudPreset,
  collectionName,
  lsKeyName,
} from "../../config";
import Modal from "./components/modal";
import useToggler from "../hooks/useToggler";
import { serverTimestamp } from "firebase/firestore";
import Swal from "sweetalert2";

import Header from "./components/header";
import ChatArea from "./components/chat-area";
import ChatInput from "./components/chat-input";
import { cloudImageUpload } from "../utils";

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

  const [selectedImages, setSelectedImages] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const getData = async () => {
    await findRealTime(collectionName, setChatData);
  };
  const handleSubmit = async (e, selectedImages) => {
    e.preventDefault();
    if (loader) return;
    if (newMessage.text.trim() === "" && selectedImages.length === 0) return;
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

    // Ensure Cloudinary environment variables are present
    if (!cloudName || !cloudPreset) {
      Swal.fire({
        icon: "error",
        title: "Cloudinary Configuration Missing",
        text: "Please check your environment variables.",
      });
      return;
    }

    let images = null;

    try {
      setLoader(true);
      // Upload avatar image if a file is selected
      if (selectedImages && selectedImages.length > 0) {
        const imageData = await cloudImageUpload({
          files: selectedImages,
          cloudName,
          preset: cloudPreset,
        });
        images = imageData?.map((item) => item?.secure_url);
      }

      if (!newMessage.isEditing) {
        await createData(collectionName, {
          username: userData.username,
          avatar: userData.avatar,
          text: newMessage.text,
          authId: userData?.authId,
          images: images || [],
          createdAt: serverTimestamp(),
          updatedAt: null,
        });
      }
      if (newMessage.isEditing) {
        await updateData(collectionName, currentId, {
          text: newMessage.text,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Image Upload Error",
        text: error.message,
      });
      console.log(error.message);
    } finally {
      setNewMessage({ ...initialState });
      setSelectedImages([]);
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
        selectedImages={selectedImages}
        removeImage={removeImage}
        handleImageChange={handleImageChange}
      />
    </div>
  );
};
export default GroupChat;
