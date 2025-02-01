import { useState } from "react";

const useToggler = () => {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  return { open, handleToggle };
};
export default useToggler;
