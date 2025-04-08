import { useState } from "react";

const useValidation = (initialState) => {
  const [fields, setFields] = useState(initialState);

  const validateField = (value, required = true) => {
    return required && (!value || value.toString().trim() === "") ? "false" : "true";
  };

  const validateAllFields = (fields, isRestaurant) => {
    if (isRestaurant) { // Step 2
      const equipmentValid = fields.equantity.every(item => 
        (!item.name.field && !item.quantity.field && !item.option_value.field) || // Empty item
        (item.name.validate === "true" && 
        item.quantity.validate === "true" && 
         (item.validOptions.length === 0 || item.option_value.validate === "true")) // Option required only if options exist
      );
      const areasValid = fields.areas.every(area => 
        (!area.name.field && !area.square_feet.field && !area.floor_type.field) || // Empty area
        (area.name.validate === "true" && 
        area.square_feet.validate === "true" && 
        area.floor_type.validate === "true")
      );
      return equipmentValid && areasValid;
    } else { // Step 3
      return fields.areas.every(area => 
        area.name.validate === "true" && 
        area.square_feet.validate === "true" && 
        area.floor_type.validate === "true"
      );
    }
  };

  return { fields, setFields, validateField, validateAllFields };
};

export default useValidation;