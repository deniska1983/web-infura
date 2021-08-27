import { useState, ChangeEvent } from "react";

export const useInput = (initialValue: string | number) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.type === "number" ? parseFloat(event.target.value) : event.target.value);
  };

  return {
    value,
    onChange: handleChange
  };
};