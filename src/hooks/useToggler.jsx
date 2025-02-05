import { useState } from "react";

/**
 * A custom hook to toggle a boolean state.
 * It manages the state of a boolean flag and provides a method to toggle its value.
 *
 * @returns {Object} The state object containing the `open` state and the `handleToggle` function.
 * @property {boolean} open - The current state of the toggle (true or false).
 * @property {Function} handleToggle - A function that toggles the value of `open`.
 */
const useToggler = () => {
  // Declare a state variable `open` initialized to `false`
  const [open, setOpen] = useState(false);

  /**
   * Toggles the `open` state between true and false.
   * This function is used to flip the state of the toggle.
   */
  const handleToggle = () => {
    setOpen(!open);
  };

  // Return the `open` state and the `handleToggle` function for external usage
  return { open, handleToggle };
};

export default useToggler;
