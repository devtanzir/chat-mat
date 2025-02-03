import axios from "axios";
import { Month } from "./constants/month";

export const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));

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
export const formatTimestampToDate = (timestamp, format = "DD-MM-YYYY") => {
  // Convert seconds to a Date object
  const date = new Date(timestamp?.seconds * 1000);

  // Extract day, month, and year
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero-indexed (0 = January)
  const year = date.getFullYear();

  // Format the date based on the specified format
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
