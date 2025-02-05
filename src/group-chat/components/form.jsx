import PropTypes from "prop-types";
import useForm from "../hooks/useForm";
import Button from "../../components/ui/button";

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
        <Button variant="red-thin" onClick={() => handleToggle(false)}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {loader ? "processing..." : "Submit"}
        </Button>
      </div>
    </form>
  );
};
Form.propTypes = {
  handleToggle: PropTypes.func.isRequired,
  token: PropTypes.func,
};
export default Form;
