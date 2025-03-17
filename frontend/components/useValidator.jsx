import { useState } from "react";

const useValidation = (initialState) => {
  const [fields, setFields] = useState(initialState);

  const validateField = (value, required = true) => {
    return required && (!value || value.toString().trim() === "") ? "false" : "true";
  };

  const validateAllFields = (data, isRestaurant) => {
    let allValid = true;
    const newData = { ...data };

    // Validate business type
    if (validateField(newData.businessType.field) === "false") {
      allValid = false;
      newData.businessType.validate = "false";
    } else {
      newData.businessType.validate = "true";
    }

    // Validate based on business type
    if (isRestaurant) {
      newData.equantity = newData.equantity.map(item => ({
        ...item,
        name: { ...item.name, validate: validateField(item.name.field) },
        quantity: { ...item.quantity, validate: validateField(item.quantity.field) },
        option_value: item.validOptions.length > 0 ? { ...item.option_value, validate: validateField(item.option_value.field) } : item.option_value,
      }));
      allValid = newData.equantity.every(item => 
        item.name.validate === "true" && 
        item.quantity.validate === "true" && 
        (item.validOptions.length === 0 || item.option_value.validate === "true")
      );
    } else {
      newData.areas = newData.areas.map(area => ({
        ...area,
        name: { ...area.name, validate: validateField(area.name.field) },
        square_feet: { ...area.square_feet, validate: validateField(area.square_feet.field) },
        floor_type: { ...area.floor_type, validate: validateField(area.floor_type.field) },
      }));
      allValid = newData.areas.every(area => 
        area.name.validate === "true" && 
        area.square_feet.validate === "true" && 
        area.floor_type.validate === "true"
      );
    }

    setFields(newData);
    return allValid;
  };

  return { fields, setFields, validateField, validateAllFields };
};

export default useValidation;