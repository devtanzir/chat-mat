import Modal from "./modal";
import PropTypes from "prop-types";

import useChatArea from "../hooks/useChatArea";
import Chats from "./chats";
import ActionButtons from "./action-buttons";

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
    showPicker,
    setShowPicker,
    handleReactionSelect,
    handleShowReaction,
  } = useChatArea(chatData, setCurrentId, currentId, setNewMessage);
  return (
    <>
      <div className="flex-1" />
      <div className="overflow-y-auto overflow-x-hidden chat-scroll p-4 space-y-4 container mx-auto">
        {chatData?.map((item, index) => (
          <Chats
            key={item.id}
            chatItem={item}
            index={index}
            chatData={chatData}
            userDataAuthId={userData?.authId}
            handleAction={handleAction}
            handleShowReaction={handleShowReaction}
            handleReactionSelect={handleReactionSelect}
            showPicker={showPicker}
            setShowPicker={setShowPicker}
          />
        ))}
        <div ref={messagesEndRef} />
        <Modal open={open} handleToggle={handleToggle} options>
          <ActionButtons
            handleDeleteChat={handleDeleteChat}
            handleEditChat={handleEditChat}
          />
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
