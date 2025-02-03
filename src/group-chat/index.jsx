import Modal from "./components/modal";

import Header from "./components/header";
import ChatArea from "./components/chat-area";
import ChatInput from "./components/chat-input";
import useGroupChat from "./hooks/useGroupChat";

const GroupChat = () => {
  const {
    newMessage,
    setNewMessage,
    chatData,
    modalOpen,
    setModalOpen,
    userData,
    currentId,
    setCurrentId,
    handleImageChange,
    removeImage,
    handleSubmit,
    handleToken,
    selectedImages,
    loader,
  } = useGroupChat();
  return (
    <div className="flex flex-col h-screen bg-chat-bg">
      <Modal open={modalOpen} handleToggle={setModalOpen} token={handleToken} />

      {/* Header */}
      <Header
        userData={userData}
        handleToken={handleToken}
        setModalOpen={setModalOpen}
      />
      {/* Chat Area */}
      <ChatArea
        chatData={chatData}
        userData={userData}
        currentId={currentId}
        setCurrentId={setCurrentId}
        setNewMessage={setNewMessage}
      />
      {/* Message Input */}
      <ChatInput
        handleSubmit={handleSubmit}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        loader={loader}
        selectedImages={selectedImages}
        removeImage={removeImage}
        handleImageChange={handleImageChange}
        chatData={chatData.find((item) => item.id === currentId)}
      />
    </div>
  );
};
export default GroupChat;
