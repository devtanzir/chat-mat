import axios from "axios";
import { Month } from "./constants/month";

/**
 * Creates a deep copy of an object using JSON methods.
 *
 * @param {Object} obj - The object to be deeply copied.
 * @returns {Object} The deep copy of the object.
 */
export const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));

/**
 * Uploads image files to Cloudinary.
 *
 * @param {Object} params - The parameters for the upload.
 * @param {Array|File} params.files - The files to be uploaded (can be a single file or an array of files).
 * @param {string} params.cloudName - The Cloudinary cloud name.
 * @param {string} params.preset - The upload preset configured in Cloudinary.
 * @returns {Promise<Array>} Resolves to an array of uploaded image data.
 */
export const cloudImageUpload = async ({ files, cloudName, preset }) => {
  const filesArray = Array.isArray(files) ? files : [files]; // Ensure it's always an array
  const uploadPromises = filesArray.map(async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData
    );
    return response.data; // Returns the uploaded image data
  });

  return Promise.all(uploadPromises); // Waits for all images to upload
};

/**
 * Formats a timestamp into a time string (HH:MM AM/PM).
 *
 * @param {Object} timestamp - The timestamp object with a 'seconds' field.
 * @returns {string} The formatted time string in the format "HH:MM AM/PM".
 */
export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp?.seconds * 1000);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )} ${ampm}`;
};

/**
 * Formats a timestamp into a date string according to the given format.
 *
 * @param {Object} timestamp - The timestamp object with a 'seconds' field.
 * @param {string} [format="DD-MM-YYYY"] - The desired date format. Options: "MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD", "DD-MM-YYYY".
 * @returns {string} The formatted date string.
 * @throws {Error} Throws an error if the provided format is invalid.
 */
export const formatTimestampToDate = (timestamp, format = "DD-MM-YYYY") => {
  const date = new Date(timestamp?.seconds * 1000);

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  switch (format) {
    case "MM/DD/YYYY":
      return `${String(month).padStart(2, "0")}/${String(day).padStart(
        2,
        "0"
      )}/${year}`;
    case "DD/MM/YYYY":
      return `${String(day).padStart(2, "0")}/${String(month).padStart(
        2,
        "0"
      )}/${year}`;
    case "YYYY-MM-DD":
      return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
        2,
        "0"
      )}`;
    case "DD-MM-YYYY":
      return `${String(day).padStart(2, "0")} ${Month[month - 1]} ${year}`;
    default:
      throw new Error("Invalid date format");
  }
};

/**
 * Generates a unique identifier string.
 * The ID is a combination of timestamp, machine ID, process ID, and counter.
 *
 * @returns {string} The generated unique ID.
 */
export const createId = () => {
  const timestamp = ((new Date().getTime() / 1000) | 0).toString(16);
  const machineId = "xxxxxxxxxxxx".replace(/[x]/g, function () {
    return ((Math.random() * 16) | 0).toString(16);
  });
  const processId = (Math.floor(Math.random() * 1000) % 1000)
    .toString(16)
    .padStart(3, "0");
  const counter = ((Math.random() * 16777216) | 0)
    .toString(16)
    .padStart(6, "0");

  return timestamp + machineId + processId + counter;
};

/**
 * Utility function for conditional class name concatenation.
 * Filters out falsy values and joins the remaining values into a string.
 *
 * @param {...string} classes - The class names to be concatenated.
 * @returns {string} The concatenated class names string.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
