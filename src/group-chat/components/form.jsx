import { useState } from "react";
import Swal from "sweetalert2";
import { cloudName, cloudPreset, lsKeyName } from "../../../config";
import { cloudImageUpload, createId } from "../../utils";
import LocalStorageUtil from "../../utils/local-storage";
import PropTypes from "prop-types";

const Form = ({ handleToggle, token }) => {
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState({
    preview: null,
    file: null,
  });
  const [loader, setLoader] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure Cloudinary environment variables are set
    if (!cloudName || !cloudPreset) {
      Swal.fire({
        icon: "error",
        title: "Cloudinary Configuration Missing",
        text: "Please check your environment variables.",
      });
      return;
    }

    // Validate required fields
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
      // Upload avatar image if selected
      if (avatar.file) {
        const avatarData = await cloudImageUpload({
          file: avatar.file,
          cloudName: cloudName,
          preset: cloudPreset,
        });
        avatarUrl = avatarData?.secure_url;
      }

      // Check if uploads were successful
      if (!avatarUrl) {
        Swal.fire({
          icon: "error",
          title: "Image Upload Error",
          text: "Failed to upload images.",
        });
        return;
      }

      // Send Data to Local Storage

      LocalStorageUtil.setItem(lsKeyName, {
        authId: createId(),
        username,
        avatar: avatarUrl,
      });

      // get data token call
      token();

      // Reset form and close modal
      setUsername("");
      handleToggle(false);
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

  const handleImageChange = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      setAvatar({ preview: URL.createObjectURL(file), file }); // Set the image data URL to state
    }
  };
  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-300"
          required
        />
      </div>
      <div>
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Profile Image
        </label>
        <div className="flex items-center space-x-4">
          <img
            src={
              avatar.preview ||
              "https://www.freeiconspng.com/uploads/no-image-icon-13.png"
            }
            alt="Profile"
            className={`w-16 h-16 rounded ${
              avatar.preview ? "object-cover" : "object-contain"
            } `}
          />
          <label className="cursor-pointer bg-blue-100 text-blue-600 py-2 px-4 rounded hover:bg-blue-200 text-xs transition-colors font-bold">
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={(e) => handleImageChange(e)}
              className="hidden"
            />
            Upload Image
          </label>
        </div>
      </div>
      <div className="flex justify-between space-x-2 mt-6">
        <button
          type="button"
          onClick={() => handleToggle(false)}
          className="px-4 py-2 rounded font-semibold text-red-600 bg-red-100 hover:bg-red-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          {loader ? "processing..." : "Submit"}
        </button>
      </div>
    </form>
  );
};
Form.propTypes = {
  handleToggle: PropTypes.func.isRequired,
  token: PropTypes.func,
};
export default Form;
