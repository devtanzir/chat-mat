import { Fragment } from "react";
import { formatTimestamp, formatTimestampToDate } from "../../utils";
import { MoreVertical } from "lucide-react";
import Tooltip from "../../components/shared/tooltip";
import Modal from "./modal";
import PropTypes from "prop-types";

import useChatArea from "../hooks/useChatArea";

const ChatArea = ({
  chatData,
  userData,
  currentId,
  setCurrentId,
  setNewMessage,
}) => {
  const {
    handleAction,
    handleDeleteChat,
    handleEditChat,
    handleToggle,
    open,
    messagesEndRef,
  } = useChatArea(chatData, setCurrentId, currentId, setNewMessage);
  return (
    <>
      <div className="flex-1 overflow-y-auto chat-scroll p-4 space-y-4 container mx-auto">
        {chatData?.map((item, index) => {
          const time = formatTimestamp(item?.createdAt);
          const date = formatTimestampToDate(item?.createdAt);
          const authenticated = item.authId === userData?.authId;

          // Get the previous message's timestamp
          const prevMessage = chatData[index - 1];
          const prevTimestamp = prevMessage ? prevMessage?.createdAt : null;

          // Calculate the time difference in minutes
          const timeDifference = prevTimestamp
            ? (item?.createdAt?.seconds - prevTimestamp?.seconds) / 60
            : null;

          // Check if we should display the date and time
          const showDateAndTime = !prevTimestamp || timeDifference > 5;

          return (
            <Fragment key={item.id}>
              {showDateAndTime && (
                <div className="space-y-2 flex items-center justify-center">
                  <p className="text-xs mt-1 opacity-75 mx-auto">
                    {date}, {time}
                  </p>
                </div>
              )}
              <div
                className={`flex ${
                  authenticated ? "justify-end pr-10" : "justify-start"
                }`}
              >
                {authenticated && (
                  <button
                    onClick={() => handleAction(item.id)}
                    className="p-2 rounded-full group translate-y-3"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-600 transition duration-300 group-hover:scale-125 group-active:scale-50" />
                  </button>
                )}
                <div
                  className={`flex items-center ${
                    authenticated && "flex-row-reverse"
                  } gap-3 max-w-[80%] sm:max-w-[70%]`}
                >
                  <img
                    className="size-7 rounded-full object-cover translate-y-3"
                    src={item.avatar}
                    alt={item.username}
                  />
                  <div className="flex flex-col gap-2">
                    <p className="font-normal text-xs pl-2">{item.username}</p>
                    <Tooltip
                      text={time}
                      position={authenticated ? "top" : "right"}
                    >
                      <div
                        className={`p-3 rounded-[18px] ${
                          authenticated
                            ? "bg-blue-500 text-white"
                            : "bg-neutral-200 text-neutral-700"
                        } `}
                      >
                        <p
                          className={`break-words ${
                            authenticated && "text-gray-200"
                          }`}
                        >
                          {item.text}
                        </p>
                      </div>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </Fragment>
          );
        })}
        <div ref={messagesEndRef} />
        <Modal open={open} handleToggle={handleToggle} options>
          <div className="flex flex-col min-w-80">
            <button
              onClick={handleEditChat}
              className="rounded w-full py-3.5 text-black font-medium hover:bg-gray-200"
            >
              Edit
            </button>
            <div className="w-full h-[1px] bg-gray-500 space-y-1" />
            <button
              onClick={handleDeleteChat}
              className="rounded w-full py-3.5 text-red-500 font-medium hover:bg-gray-200"
            >
              Delete
            </button>
          </div>
        </Modal>
      </div>
    </>
  );
};

ChatArea.propTypes = {
  chatData: PropTypes.arrayOf(PropTypes.object),
  userData: PropTypes.object,
  currentId: PropTypes.string,
  setCurrentId: PropTypes.func,
  setNewMessage: PropTypes.func,
};

export default ChatArea;
