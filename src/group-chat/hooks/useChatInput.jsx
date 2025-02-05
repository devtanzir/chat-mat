import { useRef } from "react";
import useToggler from "../../hooks/useToggler";
import { useEffect } from "react";

/**
 * Custom hook to manage chat input functionality, including emoji picker toggle and click outside handling.
 *
 * @param {Function} setNewMessage - Function to update the chat input state.
 * @returns {Object} - Returns the emoji picker state, toggle function, emoji click handler, and ref.
 */
const useChatInput = (setNewMessage) => {
  const { handleToggle, open } = useToggler(); // Manages the toggle state of the emoji picker
  const emojiPickerRef = useRef(null); // Ref to track emoji picker component

  /**
   * Handles emoji selection and appends it to the input text.
   *
   * @param {Object} emojiData - The selected emoji data object.
   */
  const handleEmojiClick = (emojiData) => {
    setNewMessage((prev) => ({
      ...prev,
      text: prev.text + emojiData.emoji, // Append emoji to input
    }));
  };

  /**
   * Effect to handle closing the emoji picker when clicking outside.
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        handleToggle(); // Close the emoji picker when clicking outside
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, handleToggle]);

  return { open, handleToggle, handleEmojiClick, emojiPickerRef };
};

export default useChatInput;
