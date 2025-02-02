import Tooltip from "../../components/shared/tooltip";
import { Paperclip } from "lucide-react";
import { Send } from "lucide-react";
import PropTypes from "prop-types";

const ChatInput = ({ handleSubmit, newMessage, setNewMessage, loader }) => {
  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-transparent backdrop-blur-[1px] p-4 flex items-center space-x-2 sm:space-x-4 container mx-auto"
      >
        <Tooltip text="Coming Soon!" position="right">
          <button
            onMouseDown={(e) => e.preventDefault()}
            type="button"
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Paperclip className="w-5 h-5 text-gray-600" />
          </button>
        </Tooltip>

        <input
          type="text"
          value={loader ? "" : newMessage.text}
          onChange={(e) =>
            setNewMessage((prev) => ({
              ...prev,
              text: e.target.value,
            }))
          }
          placeholder="Type a message..."
          className="flex-1 py-2.5 px-4 border-none bg-neutral-200 rounded-full focus:outline-none text-sm sm:text-base"
        />
        <button
          type="submit"
          disabled={loader}
          onMouseDown={(e) => e.preventDefault()}
          className={`${
            loader
              ? "bg-neutral-200 text-neutral-700 cursor-not-allowed"
              : "bg-sky-500 text-white cursor-pointer"
          }   p-2.5 rounded-full hover:bg-sky-600 transition`}
        >
          <Send className="size-5 pointer-events-none" />
        </button>
      </form>
    </>
  );
};

ChatInput.propTypes = {
  handleSubmit: PropTypes.func,
  newMessage: PropTypes.object,
  setNewMessage: PropTypes.func,
  loader: PropTypes.bool,
};

export default ChatInput;
