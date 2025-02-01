import PropTypes from "prop-types";
import useForm from "../hooks/useForm";

const Form = ({ handleToggle, token }) => {
  const {
    avatar,
    handleImageChange,
    handleSubmit,
    loader,
    username,
    handleInputChange,
  } = useForm(handleToggle, token);
  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-300"
          required
        />
      </div>
      <div>
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Profile Image
        </label>
        <div className="flex items-center space-x-4">
          <img
            src={
              avatar.preview ||
              "https://www.freeiconspng.com/uploads/no-image-icon-13.png"
            }
            alt="Profile"
            className={`size-16 rounded ${
              avatar.preview ? "object-cover" : "object-contain"
            } `}
          />
          <label className="cursor-pointer bg-blue-100 text-blue-600 py-2 px-4 rounded hover:bg-blue-200 text-xs transition-colors font-bold">
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={(e) => handleImageChange(e)}
              className="hidden"
            />
            Upload Image
          </label>
        </div>
      </div>
      <div className="flex justify-between space-x-2 mt-6">
        <button
          type="button"
          onClick={() => handleToggle(false)}
          className="px-4 py-2 rounded font-semibold text-red-600 bg-red-100 hover:bg-red-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          {loader ? "processing..." : "Submit"}
        </button>
      </div>
    </form>
  );
};
Form.propTypes = {
  handleToggle: PropTypes.func.isRequired,
  token: PropTypes.func,
};
export default Form;
