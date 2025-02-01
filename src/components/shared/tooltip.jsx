import PropTypes from "prop-types";

const Tooltip = ({ text, children, position = "top" }) => {
  const positionClasses = {
    top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
    left: "right-full mr-2 top-1/2 -translate-y-1/2",
    right: "left-full ml-2 top-1/2 -translate-y-1/2",
  };

  return (
    <div className="relative group inline-block">
      {children}
      <div
        className={`absolute ${positionClasses[position]} w-max max-w-xs bg-gray-900 text-white text-sm rounded-lg py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg`}
      >
        {text}
      </div>
    </div>
  );
};

Tooltip.propTypes = {
  text: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  position: PropTypes.oneOf(["top", "bottom", "left", "right"]),
};

export default Tooltip;
