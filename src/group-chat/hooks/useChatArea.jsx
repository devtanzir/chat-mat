import { useRef, useEffect } from "react";
import useToggler from "../../hooks/useToggler";
import Swal from "sweetalert2";
import { deleteData } from "../../firebase/models";
import { collectionName } from "../../../config";

/**
 * Custom hook to handle chat area actions, including scroll-to-bottom behavior,
 * editing and deleting chats, and managing modal state.
 *
 * @param {Array} chatData - The array of chat messages.
 * @param {Function} setCurrentId - The function to set the current selected chat ID.
 * @param {string} currentId - The current selected chat ID.
 * @param {Function} setNewMessage - The function to set a new message when editing.
 * @returns {Object} - Returns necessary functions and state for handling chat actions and modal visibility.
 */
const useChatArea = (chatData, setCurrentId, currentId, setNewMessage) => {
  // Hook to manage modal toggle state
  const { open, handleToggle } = useToggler();

  // Reference to the element where chat messages end for smooth scrolling
  const messagesEndRef = useRef(null);

  /**
   * Scroll the chat area to the bottom.
   * This is typically called after new messages are added or when the component mounts.
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to the bottom whenever chatData changes (i.e., when new messages are added)
  useEffect(() => {
    scrollToBottom();
  }, [chatData]);

  /**
   * Handles the action when the user clicks on a chat message (e.g., to edit or delete).
   * It sets the current chat ID and toggles the modal visibility.
   *
   * @param {string} id - The ID of the chat message to perform an action on.
   */
  const handleAction = (id) => {
    setCurrentId(id); // Set the current selected chat ID
    handleToggle(); // Toggle the modal visibility
  };

  /**
   * Prompts the user with a confirmation modal to delete the selected chat message.
   * If confirmed, the message is deleted, and the modal is closed.
   */
  const handleDeleteChat = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Delete the chat message from Firebase if the user confirms
        Swal.fire("Deleted!", "Your chat has been deleted.", "success");
        deleteData(collectionName, currentId); // Call the function to delete data from Firebase
        handleToggle(); // Close the modal after deletion
      }
    });
  };

  /**
   * Allows the user to edit the selected chat message.
   * It sets the current message as the new message in edit mode.
   */
  const handleEditChat = () => {
    handleToggle(); // Toggle the modal visibility
    const updatedMsg = chatData.find((item) => item.id === currentId); // Find the selected chat message
    setNewMessage({
      text: updatedMsg.text, // Set the text of the message for editing
      isEditing: true, // Mark the state as editing
    });
  };

  // Return all necessary values and functions for use in the component
  return {
    open,
    messagesEndRef,
    handleToggle,
    scrollToBottom,
    handleAction,
    handleDeleteChat,
    handleEditChat,
  };
};

export default useChatArea;
