import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, MoreVertical } from "lucide-react";
import {
  createData,
  deleteData,
  findRealTime,
  updateData,
} from "../firebase/models";
import LocalStorageUtil from "../utils/local-storage";
import { lsKeyName } from "../../config";
import Modal from "./components/modal";
import useToggler from "../hooks/useToggler";
import { serverTimestamp } from "firebase/firestore";
import { formatTimestamp, formatTimestampToDate } from "../utils";
import Swal from "sweetalert2";
import { LogOut } from "lucide-react";
import { Fragment } from "react";
import Tooltip from "../components/shared/tooltip";

export default function ClassicGroupChat() {
  const initialState = {
    text: "",
    isEditing: false,
  };
  const [newMessage, setNewMessage] = useState({
    ...initialState,
  });
  const messagesEndRef = useRef(null);
  const [chatData, setChatData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const { open: token, handleToggle: handleToken } = useToggler();
  const [currentId, setCurrentId] = useState("");
  const { open, handleToggle } = useToggler();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, []);

  const getData = async () => {
    await findRealTime("chats", setChatData);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage.text.trim() === "") return;
    if (!userData) {
      Swal.fire({
        icon: "error",
        title: "Unauthorized",
        text: "Please Submit Your Information.",
      });
      setModalOpen(true);
      return;
    }
    if (userData.username.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unauthorize!",
      });
      return;
    }
    if (userData.avatar.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unauthorize!",
      });
      return;
    }

    try {
      if (!newMessage.isEditing) {
        await createData("chats", {
          username: userData.username,
          avatar: userData.avatar,
          text: newMessage.text,
          authId: userData?.authId,
          createdAt: serverTimestamp(),
          updatedAt: null,
        });
      }
      if (newMessage.isEditing) {
        await updateData("chats", currentId, {
          text: newMessage.text,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setNewMessage({ ...initialState });
    }
  };
  const handleAction = (id) => {
    setCurrentId(id);
    handleToggle();
  };
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
        Swal.fire("Deleted!", "Your chat has been deleted.", "success");
        deleteData("chats", currentId);
        handleToggle();
      }
    });
  };
  const handleEditChat = () => {
    handleToggle();
    const updatedMsg = chatData.find((item) => item.id === currentId);
    setNewMessage({
      text: updatedMsg.text,
      isEditing: true,
    });
  };
  const clearLs = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Log Out!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Logged Out!", "You have been logged out.", "success");
        LocalStorageUtil.removeItem(lsKeyName);
        handleToken();
      }
    });
  };
  useEffect(() => {
    getData();
    const item = LocalStorageUtil.exists(lsKeyName);
    if (!item) {
      setModalOpen(true);
      setUserData(null);
    } else {
      const userInfo = LocalStorageUtil.getItem(lsKeyName);
      setUserData(userInfo);
    }
  }, [token]);
  return (
    <div className="flex flex-col h-screen bg-chat-bg">
      {modalOpen && (
        <Modal
          open={modalOpen}
          handleToggle={setModalOpen}
          token={handleToken}
        />
      )}
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <div className="flex items-center gap-x-3">
          <img
            src={
              userData
                ? userData.avatar
                : "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/no-profile-picture-icon.png"
            }
            className="size-16 object-cover rounded"
            alt="user-photo"
          />
          <h1 className="text-xl font-semibold">
            {userData ? userData.username : "Guest User"}
          </h1>
        </div>
        {userData && (
          <div className="flex space-x-4">
            <Tooltip text="Log Out" position="left">
              <button
                onClick={clearLs}
                className="p-2 rounded-full hover:bg-gray-100"
                title="Log Out"
              >
                <LogOut className="w-5 h-5 text-gray-600" />
              </button>
            </Tooltip>
          </div>
        )}
      </header>

      {/* Chat Area */}
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

      {/* Message Input */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border-t border-gray-200 p-4 flex items-center space-x-2 sm:space-x-4"
      >
        <Tooltip text="Coming Soon!" position="right">
          <button type="button" className="p-2 rounded-full hover:bg-gray-100">
            <Paperclip className="w-5 h-5 text-gray-600" />
          </button>
        </Tooltip>

        <input
          type="text"
          value={newMessage.text}
          onChange={(e) =>
            setNewMessage((prev) => ({
              ...prev,
              text: e.target.value,
            }))
          }
          placeholder="Type a message..."
          className="flex-1 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-2 rounded-full hover:bg-blue-600 transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
