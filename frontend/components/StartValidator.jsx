import { useState } from "react";

const StartValidation = (initialState) => {
  const [fields, setFields] = useState(initialState);

  const validateField = (value, fieldName, required = true) => {
    if (!required) return "true"; // Non-required fields are always valid
    if (!value || value.toString().trim() === "") return "false"; // Empty or whitespace
    if (fieldName === "email" && !/\S+@\S+\.\S+/.test(value)) return "false"; // Basic email validation
    return "true";
  };

  const validateAllFields = (data) => {
    let allValid = true;
    const newData = { ...data };

    // Validate each field
    Object.keys(newData).forEach((key) => {
      const isValid = validateField(newData[key].field, key, true); // All fields are required
      newData[key].validate = isValid;
      if (isValid === "false") allValid = false;
    });

    setFields(newData);
    return allValid;
  };

  return { fields, setFields, validateField, validateAllFields };
};

export default StartValidation;
