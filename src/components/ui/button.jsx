import PropTypes from "prop-types";
import { cn } from "../../utils";

const Button = ({
  children,
  onClick,
  variant = "default",
  className = "",
  type = "button",
}) => {
  const variants = {
    default: "bg-black rounded py-2 px-3 text-white hover:bg-black/80",
    secondary: "rounded w-full py-3.5 text-black font-medium hover:bg-gray-200",
    destructive:
      "rounded w-full py-3.5 text-red-500 font-medium hover:bg-gray-200",
    "red-thin":
      "px-4 py-2 rounded font-semibold text-red-600 bg-red-100 hover:bg-red-200 transition-colors",
    primary:
      "px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors",
    icon: "p-2 rounded-full hover:bg-gray-100",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(variants[variant], className)}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf([
    "default",
    "red-thin",
    "secondary",
    "destructive",
    "primary",
    "icon",
  ]),
  className: PropTypes.string,
};

export default Button;
