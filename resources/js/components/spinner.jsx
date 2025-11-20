import React from "react";

const Spinner = () => {
  return (
    <div className="flex items-center justify-center">
      <div
        className="w-10 h-10 border-4 border-os-primary border-t-transparent rounded-full animate-spin"
        role="status"
      ></div>
    </div>
  );
};

export default Spinner;
