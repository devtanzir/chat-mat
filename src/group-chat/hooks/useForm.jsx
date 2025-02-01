import { useState } from "react";
import { cloudName, cloudPreset, lsKeyName } from "../../../config";
import Swal from "sweetalert2";
import { cloudImageUpload, createId } from "../../utils";
import LocalStorageUtil from "../../utils/local-storage";

/**
 * Custom hook for managing form state, submission, and image upload logic.
 * @param {Function} handleToggle - Function to toggle visibility of modal
 * @param {Function} token - Callback function to be executed after form submission
 * @returns {Object} - Contains form data, handlers, and loader state
 */
const useForm = (handleToggle, token) => {
  // State for username, avatar image, and loader
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState({ preview: null, file: null });
  const [loader, setLoader] = useState(false);

  /**
   * Handle form submission
   * Validates fields, uploads avatar, and stores data in localStorage
   * @param {Event} e - The form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure Cloudinary environment variables are present
    if (!cloudName || !cloudPreset) {
      Swal.fire({
        icon: "error",
        title: "Cloudinary Configuration Missing",
        text: "Please check your environment variables.",
      });
      return;
    }

    // Validate username input
    if (!username) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Author name is required.",
      });
      return;
    }

    let avatarUrl = null;

    try {
      setLoader(true);

      // Upload avatar image if a file is selected
      if (avatar.file) {
        const avatarData = await cloudImageUpload({
          file: avatar.file,
          cloudName,
          preset: cloudPreset,
        });
        avatarUrl = avatarData?.secure_url;
      }

      // Handle upload failure
      if (!avatarUrl) {
        Swal.fire({
          icon: "error",
          title: "Image Upload Error",
          text: "Failed to upload images.",
        });
        return;
      }

      // Store user data in local storage
      LocalStorageUtil.setItem(lsKeyName, {
        authId: createId(),
        username,
        avatar: avatarUrl,
      });

      // Trigger token callback
      token();

      // Reset form and close modal
      setUsername("");
      handleToggle(false);

      // Show success alert
      Swal.fire({
        title: "Done!",
        icon: "success",
      });
    } catch (error) {
      console.error("Error during submission:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Error",
        text: "An error occurred while processing your request.",
      });
    } finally {
      setLoader(false);
    }
  };

  /**
   * Handle image selection and preview
   * @param {Event} event - The input change event
   */
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Create image preview URL and update avatar state
      setAvatar({ preview: URL.createObjectURL(file), file });
    }
  };

  /**
   * Handle username input change
   * @param {Event} event - The input change event
   */
  const handleInputChange = (event) => {
    setUsername(event.target.value);
  };

  return {
    username,
    avatar,
    handleSubmit,
    handleImageChange,
    loader,
    handleInputChange,
  };
};

export default useForm;
