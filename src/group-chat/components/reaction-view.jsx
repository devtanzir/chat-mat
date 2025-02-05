import PropTypes from "prop-types";

const ReactionView = ({ reactions }) => {
  return (
    <div className="flex gap-[2px] items-center bg-purple-100 p-1 absolute rounded-lg right-0 bottom-0 translate-y-5">
      {reactions
        ?.filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.reaction === value.reaction)
        )
        .map((reaction, index) => (
          <p key={`sd${index}hf`} className="text-xs">
            {reaction.reaction}
          </p>
        ))}
      {reactions.length > 1 && (
        <span className="font-semibold text-sm text-black">
          <sub>{reactions.length}</sub>
        </span>
      )}
    </div>
  );
};

ReactionView.propTypes = {
  reactions: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ReactionView;
