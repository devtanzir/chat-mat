import { useState, useEffect } from "react";
import useToggler from "../../hooks/useToggler";
import {
  cloudName,
  cloudPreset,
  collectionName,
  lsKeyName,
} from "../../../config";
import { createData, findRealTime, updateData } from "../../firebase/models";
import Swal from "sweetalert2";
import { cloudImageUpload } from "../../utils";
import { serverTimestamp } from "firebase/firestore";
import LocalStorageUtil from "../../utils/local-storage";

/**
 * Custom hook to manage group chat functionality.
 * Handles real-time chat data, image uploads, and user authentication.
 * @returns {Object} - Chat state and functions for managing chat operations.
 */
const useGroupChat = () => {
  const initialState = {
    text: "",
    isEditing: false,
  };

  const [newMessage, setNewMessage] = useState({ ...initialState });
  const [chatData, setChatData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const { open: token, handleToggle: handleToken } = useToggler();
  const [currentId, setCurrentId] = useState("");
  const [loader, setLoader] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  /**
   * Handles image selection for chat messages.
   * @param {Event} e - The file input change event.
   */
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages((prev) => [...prev, ...files]);
  };

  /**
   * Removes a selected image from the preview list.
   * @param {number} index - The index of the image to remove.
   */
  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  /**
   * Fetches real-time chat data from Firestore.
   */
  const getData = async () => {
    await findRealTime(collectionName, setChatData);
  };

  /**
   * Handles message submission and image uploads.
   * Creates a new message or updates an existing one.
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loader) return;

    // Validate user authentication
    if (!userData) {
      Swal.fire({
        icon: "error",
        title: "Unauthorized",
        text: "Please Submit Your Information.",
      });
      setModalOpen(true);
      return;
    }
    if (!userData.username.trim() || !userData.avatar.trim()) {
      Swal.fire({ icon: "error", title: "Error", text: "Unauthorized!" });
      return;
    }

    // Validate Cloudinary configuration
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
      // Upload images if selected
      if (selectedImages.length > 0) {
        const imageData = await cloudImageUpload({
          files: selectedImages,
          cloudName,
          preset: cloudPreset,
        });
        images = imageData?.map((item) => item?.secure_url);
      }

      // Creating a new message
      if (!newMessage.isEditing) {
        if (!images && newMessage.text.trim() === "") return;
        await createData(collectionName, {
          username: userData.username,
          avatar: userData.avatar,
          text: newMessage.text,
          authId: userData.authId,
          images: images || [],
          createdAt: serverTimestamp(),
          updatedAt: null,
        });
      }
      // Updating an existing message
      if (newMessage.isEditing) {
        if (!images) {
          const curData = chatData.find((item) => item.id === currentId);
          images = curData?.images;
        }
        await updateData(collectionName, currentId, {
          text: newMessage.text ?? "",
          images: images || [],
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Image Upload Error",
        text: error.message,
      });
      console.error(error.message);
    } finally {
      setNewMessage({ ...initialState });
      setSelectedImages([]);
      setLoader(false);
    }
  };

  // Fetch initial data and handle user authentication state
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

  return {
    newMessage,
    setNewMessage,
    chatData,
    modalOpen,
    setModalOpen,
    userData,
    currentId,
    setCurrentId,
    handleImageChange,
    removeImage,
    handleSubmit,
    handleToken,
    loader,
    selectedImages,
  };
};

export default useGroupChat;
