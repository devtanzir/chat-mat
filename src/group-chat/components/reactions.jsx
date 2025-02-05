import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { reactions } from "../constants/reaction";

const ReactionPicker = ({ onSelect, isOpen, onClose }) => {
  const pickerRef = useRef(null);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={pickerRef}
      className="absolute bottom-[50px] right-0 translate-x-[116px] bg-blue-100 shadow-xl p-2 rounded-lg flex gap-2"
    >
      {reactions.map((emoji) => (
        <button
          key={emoji}
          onClick={() => onSelect(emoji)}
          className="text-xl hover:scale-125 transition-transform duration-200"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

ReactionPicker.propTypes = {
  onSelect: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ReactionPicker;
