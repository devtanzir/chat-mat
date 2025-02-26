import PropTypes from "prop-types";

const ResponsiveModal = ({ open, handleToggle, children }) => {
  return (
    <div className="mx-auto min-w-72 w-fit">
      <div
        onClick={() => handleToggle(false)}
        className={`fixed z-[100] w-screen ${
          open ? "visible opacity-100" : "invisible opacity-0"
        } inset-0 grid place-items-center bg-black/20 backdrop-blur-sm duration-100`}
      >
        <div
          onClick={(e_) => e_.stopPropagation()}
          className={`absolute max-w-md rounded-lg bg-[#f7f7f7] p-6 drop-shadow-lg ${
            open ? "opacity-1 duration-300" : "scale-110 opacity-0 duration-150"
          }`}
        >
          <svg
            onClick={() => handleToggle(false)}
            className="absolute right-3 top-3 w-6 cursor-pointer fill-zinc-600 "
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z"></path>
          </svg>
          {children}
        </div>
      </div>
    </div>
  );
};

ResponsiveModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default ResponsiveModal;
