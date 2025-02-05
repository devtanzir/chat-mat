import PropTypes from "prop-types";
import { Fragment } from "react";
import { MoreVertical } from "lucide-react";
import Tooltip from "../../components/shared/tooltip";
import CardSlider from "../../components/shared/card-slider";
import ReactionView from "./reaction-view";
import ReactionPicker from "./reactions";
import { Smile } from "lucide-react";
import useChats from "../hooks/useChats";
const Chats = ({
  chatItem,
  index,
  chatData,
  userDataAuthId,
  handleAction,
  handleShowReaction,
  handleReactionSelect,
  showPicker,
  setShowPicker,
}) => {
  const {
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
  } = useChats(chatItem, userDataAuthId, chatData, index);

  return (
    <Fragment>
      {showDateAndTime && (
        <div className="space-y-2 flex items-center justify-center">
          <p className="text-xs mt-1 opacity-75 mx-auto">
            {date}, {time}
          </p>
        </div>
      )}
      <div
        className={`flex ${authenticated ? "justify-end" : "justify-start"}`}
      >
        {authenticated && (
          <button
            onClick={() => handleAction(id)}
            className="p-2 rounded-full group translate-y-3"
          >
            <MoreVertical className="w-5 h-5 text-gray-600 transition duration-300 group-hover:scale-125 group-active:scale-50" />
          </button>
        )}

        <div
          className={`flex items-end ${
            authenticated && "flex-row-reverse"
          } gap-3 ${
            photoExist
              ? "max-w-[258px] sm:max-w-[310px] lg:max-w-[360px] xl:max-w-[410px]"
              : "max-w-[80%] sm:max-w-[70%]"
          } `}
        >
          <img
            className="size-7 rounded-full object-cover -translate-y-3"
            loading="lazy"
            src={avatar}
            alt={username}
          />
          <div className="flex flex-col gap-2">
            <p
              className={`font-normal text-xs pl-2 ${
                authenticated && "text-right"
              }`}
            >
              {username}
            </p>
            <Tooltip text={time} position={authenticated ? "top" : "right"}>
              {photoExist && (
                <div className="relative">
                  <CardSlider images={images} authenticated={authenticated} />
                  {!text && reactions && <ReactionView reactions={reactions} />}
                </div>
              )}
              {text && (
                <div
                  className={`p-3 rounded-[18px] w-fit relative ${
                    authenticated
                      ? "bg-blue-500 text-white ml-auto"
                      : "bg-neutral-200 text-neutral-700 mr-auto"
                  } `}
                >
                  <p
                    className={`break-words break-all whitespace-normal ${
                      authenticated && "text-gray-200"
                    }`}
                  >
                    {text}
                  </p>
                  {reactions && <ReactionView reactions={reactions} />}
                </div>
              )}
            </Tooltip>
          </div>
          {!authenticated && (
            <Tooltip text="Reactions" position="top">
              <div className="relative -translate-y-3">
                <button
                  onClick={() => handleShowReaction(id)}
                  type="button"
                  className="transition duration-300 active:scale-90"
                >
                  <Smile className="w-5 h-5 text-gray-600" />
                </button>
                {showPicker === id && (
                  <ReactionPicker
                    onSelect={(reaction) =>
                      handleReactionSelect(
                        reaction,
                        userDataAuthId,
                        id,
                        reactions
                      )
                    }
                    isOpen={showPicker === id}
                    onClose={() => setShowPicker(null)}
                  />
                )}
              </div>
            </Tooltip>
          )}
        </div>
      </div>
    </Fragment>
  );
};

Chats.propTypes = {
  chatItem: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  chatData: PropTypes.array.isRequired,
  handleAction: PropTypes.func.isRequired,
  handleShowReaction: PropTypes.func.isRequired,
  handleReactionSelect: PropTypes.func.isRequired,
  showPicker: PropTypes.string,
  setShowPicker: PropTypes.func.isRequired,
  userDataAuthId: PropTypes.string.isRequired,
};

export default Chats;
