import { LogOut } from "lucide-react";
import Tooltip from "../../components/shared/tooltip";
import Swal from "sweetalert2";
import LocalStorageUtil from "../../utils/local-storage";
import { lsKeyName } from "../../../config";
import PropTypes from "prop-types";
import { LogIn } from "lucide-react";

const Header = ({ userData, handleToken, setModalOpen }) => {
  const clearLs = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Log Out!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Logged Out!", "You have been logged out.", "success");
        LocalStorageUtil.removeItem(lsKeyName);
        handleToken();
      }
    });
  };
  return (
    <>
      <header className="bg-transparent backdrop-blur-[1px] p-4 flex justify-between items-center container mx-auto">
        <div className="flex items-center gap-x-3">
          <img
            src={
              userData
                ? userData.avatar
                : "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/no-profile-picture-icon.png"
            }
            className="size-10 object-cover rounded"
            alt="user-photo"
          />
          <h1 className="text-xl font-semibold">
            {userData ? userData.username : "Guest User"}
          </h1>
        </div>
        {userData ? (
          <div className="flex space-x-4">
            <Tooltip text="Log Out" position="left">
              <button
                onClick={clearLs}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <LogOut className="w-5 h-5 text-gray-600" />
              </button>
            </Tooltip>
          </div>
        ) : (
          <div className="flex space-x-4">
            <Tooltip text="Log In" position="left">
              <button
                onClick={() => setModalOpen(true)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <LogIn className="w-5 h-5 text-gray-600" />
              </button>
            </Tooltip>
          </div>
        )}
      </header>
    </>
  );
};

Header.propTypes = {
  userData: PropTypes.object,
  handleToken: PropTypes.func.isRequired,
  setModalOpen: PropTypes.func,
};

export default Header;
