import { useState } from "react";

const useValidation = (initialState) => {
  const [fields, setFields] = useState(initialState);

  const validateField = (value, required = true) => {
    return required && (!value || value.toString().trim() === "")
      ? false
      : true;
  };

  // Función legacy - mantener para compatibilidad pero mejorada
  const validateAllFields = (fields, isRestaurant) => {
    // Validar áreas: cada área debe estar completamente vacía O completamente llena y válida
    const areasValid = fields.areas.every((area) => {
      const hasAnyContent =
        area.name.field || area.square_feet.field || area.floor_type.field;

      if (!hasAnyContent) {
        return false; // Área completamente vacía NO es válida
      }

      // Si tiene contenido, todos los campos deben estar llenos y ser válidos
      return (
        area.name.field &&
        area.name.validate === true &&
        area.square_feet.field &&
        area.square_feet.validate === true &&
        area.floor_type.field &&
        area.floor_type.validate === true
      );
    });

    // Todas las areas deben estar completas una área debe estar completamente llena
    const hasAtLeastOneCompleteArea = fields.areas.every(
      (area) =>
        area.name.field &&
        area.name.validate === true &&
        area.square_feet.field &&
        area.square_feet.validate === true &&
        area.floor_type.field &&
        area.floor_type.validate === true
    );

    if (isRestaurant) {
      // Step 2 - Restaurantes
      // Validar equipos: cada equipo debe estar completamente completamente lleno y válido
      // Initial state has field = 1, validate = true, in order to make valide the dafult value = 1.
      const equipmentValid = fields.equantity.every((item) => {
        const hasAnyContent = item.name.field || item.quantity.field > 1;

        if (!hasAnyContent) {
          return false; // Equipo completamente vacío NO es válido
        }

        // Si tiene contenido, verificar campos requeridos
        const nameValid = item.name.field && item.name.validate === true;
        const quantityValid = item.quantity.validate === true;
        const optionValid =
          item.validOptions.length === 0 ||
          (item.option_value.field && item.option_value.validate === true);

        return nameValid && quantityValid && optionValid;
      });

      return areasValid && equipmentValid && hasAtLeastOneCompleteArea;
    } else {
      // Step 3 - No restaurantes
      return areasValid && hasAtLeastOneCompleteArea;
    }
  };

  // Nueva función más robusta para validar un elemento específico
  const validateItem = (item, requiredFields = []) => {
    const hasAnyContent = Object.values(item).every(
      (field) => field.field && field.field !== ""
    );

    if (!hasAnyContent) return { isValid: true, isEmpty: true };

    const invalidFields = requiredFields.filter(
      (fieldName) => !item[fieldName] || item[fieldName].validate !== true
    );

    return {
      isValid: invalidFields.length === 0,
      isEmpty: false,
      invalidFields,
    };
  };

  return { fields, setFields, validateField, validateAllFields, validateItem };
};

export default useValidation;
