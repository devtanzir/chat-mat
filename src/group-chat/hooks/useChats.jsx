import { formatTimestamp, formatTimestampToDate } from "../../utils";

/**
 * Custom hook to process chat messages and extract relevant information.
 *
 * @param {Object} chatItem - The chat message object.
 * @param {string} userDataAuthId - Authenticated user ID.
 * @param {Array} chatData - Array of chat messages.
 * @param {number} index - Index of the current chat message in the chatData array.
 * @returns {Object} - Processed chat message data including timestamps, authentication status, and display conditions.
 */
const useChats = (chatItem, userDataAuthId, chatData, index) => {
  const { createdAt, authId, images, text, id, avatar, username, reactions } =
    chatItem;

  const time = formatTimestamp(createdAt); // Formatted chat time
  const date = formatTimestampToDate(createdAt); // Formatted chat date
  const authenticated = authId === userDataAuthId; // Check if the message is from the authenticated user
  const photoExist = images && images.length > 0; // Check if images exist in the message

  // Get the previous message's timestamp
  const prevMessage = chatData[index - 1];
  const prevTimestamp = prevMessage ? prevMessage?.createdAt : null;

  // Calculate the time difference in minutes
  const timeDifference = prevTimestamp
    ? (createdAt?.seconds - prevTimestamp?.seconds) / 60
    : null;

  // Check if we should display the date and time
  const showDateAndTime = !prevTimestamp || timeDifference > 5;

  return {
    text,
    id,
    images,
    avatar,
    username,
    reactions,
    time,
    date,
    authenticated,
    photoExist,
    showDateAndTime,
  };
};

export default useChats;
