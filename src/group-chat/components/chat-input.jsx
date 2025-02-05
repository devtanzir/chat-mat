import Tooltip from "../../components/shared/tooltip";
import { Smile } from "lucide-react";
import { Loader } from "lucide-react";
import { Paperclip, Send, X } from "lucide-react";
import PropTypes from "prop-types";
import EmojiPicker from "emoji-picker-react";
import useToggler from "../../hooks/useToggler";
import { useRef } from "react";
import { useEffect } from "react";

const ChatInput = ({
  handleSubmit,
  newMessage,
  setNewMessage,
  loader,
  selectedImages,
  removeImage,
  handleImageChange,
  chatData,
}) => {
  const { handleToggle, open } = useToggler();
  const emojiPickerRef = useRef(null);

  const handleEmojiClick = (emojiData) => {
    setNewMessage((prev) => ({
      ...prev,
      text: prev.text + emojiData.emoji, // Append emoji to input
    }));
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        handleToggle();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, handleToggle]);

  return (
    <div className="relative container mx-auto">
      {/* Preview selected images above the input field with horizontal scrolling */}
      {selectedImages.length > 0 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 px-4 absolute top-0 left-0 w-full -translate-y-[65px] z-0">
          {selectedImages.map((image, index) => (
            <div key={index} className="relative w-16 h-16 flex-shrink-0">
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                loading="lazy"
                className="w-full h-full object-cover rounded-lg shadow"
              />
              <button
                className="absolute top-0 right-0 bg-black bg-opacity-50 rounded-full p-1"
                onClick={() => removeImage(index)}
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
      {newMessage.isEditing &&
        chatData.images.length > 0 &&
        selectedImages.length === 0 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 px-4 absolute top-0 left-0 w-full -translate-y-[65px] z-0">
            {chatData.images.map((image, index) => (
              <div
                key={index}
                className="w-16 h-16 flex-shrink-0 cursor-pointer"
              >
                <img
                  src={image}
                  alt="preview"
                  loading="lazy"
                  className="w-full h-full object-cover rounded-lg shadow"
                />
              </div>
            ))}
          </div>
        )}

      <form
        onSubmit={handleSubmit}
        className="bg-transparent backdrop-blur-[1px] p-4 flex items-center space-x-2 sm:space-x-4 container mx-auto"
      >
        <Tooltip text="Upload Images" position="top">
          <label className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
            <Paperclip className="w-5 h-5 text-gray-600" />
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </Tooltip>
        <Tooltip text="Emoji" position="top">
          <div className="relative">
            <button
              onClick={handleToggle}
              type="button"
              className="transition duration-300 active:scale-90"
            >
              <Smile className="w-5 h-5 text-gray-600" />
            </button>
            {open && (
              <div
                ref={emojiPickerRef}
                className="absolute bottom-12 sm:bottom-10 left-2 sm:right-0 !z-50"
              >
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  autoFocusSearch={false}
                  emojiStyle="native"
                  className="!w-64 !h-96 sm:!w-[350px] sm:!h-[450px]"
                />
              </div>
            )}
          </div>
        </Tooltip>

        <input
          type="text"
          readOnly={loader}
          value={newMessage.text}
          onChange={(e) =>
            setNewMessage((prev) => ({
              ...prev,
              text: e.target.value,
            }))
          }
          placeholder="Type a message..."
          className={`flex-1 py-2.5 px-4 border-none ${
            newMessage.isEditing ? "bg-green-100" : "bg-neutral-200"
          }  rounded-full focus:outline-none text-sm sm:text-base`}
        />

        <button
          type="submit"
          disabled={loader}
          onMouseDown={(e) => e.preventDefault()}
          className={`${
            loader
              ? "bg-neutral-200 text-neutral-700 cursor-not-allowed"
              : "bg-sky-500 text-white cursor-pointer hover:bg-sky-600"
          } p-2.5 rounded-full transition`}
        >
          {loader ? (
            <Loader className="size-5 animate-spin" />
          ) : (
            <Send className="size-5 pointer-events-none" />
          )}
        </button>
      </form>
    </div>
  );
};

ChatInput.propTypes = {
  handleSubmit: PropTypes.func,
  newMessage: PropTypes.object,
  setNewMessage: PropTypes.func,
  loader: PropTypes.bool,
  selectedImages: PropTypes.array,
  removeImage: PropTypes.func,
  handleImageChange: PropTypes.func,
  chatData: PropTypes.object,
};

export default ChatInput;
