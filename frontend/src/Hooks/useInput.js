import React, { useState } from "react";

function useInput(initialValue) {
  const [state, setState] = useState(initialValue);
  const clearState = () => {
    setState(initialValue);
  };
  return [state, clearState, setState];
}

export default useInput;
