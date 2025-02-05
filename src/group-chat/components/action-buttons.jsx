import PropTypes from "prop-types";
import Button from "../../components/ui/button";
import DottedSeparator from "../../components/shared/dotted-separator";
const ActionButtons = ({ handleDeleteChat, handleEditChat }) => {
  return (
    <div className="flex flex-col min-w-56">
      <Button onClick={handleEditChat} variant="secondary">
        Edit
      </Button>
      <DottedSeparator className={"space-y-1"} />
      <Button onClick={handleDeleteChat} variant="destructive">
        Delete
      </Button>
    </div>
  );
};
ActionButtons.propTypes = {
  handleDeleteChat: PropTypes.func.isRequired,
  handleEditChat: PropTypes.func.isRequired,
};

export default ActionButtons;
