
  // Mensajes de error para cada campo
  export const errorMessages = {
    fullname: "El nombre completo solo debe contener letras y espacios.",
    email: "El correo electrónico no es válido.",
    phone: "El teléfono debe contener entre 7 y 14 números.",
    password: "La contraseña debe tener entre 4 y 12 caracteres.",
    password2: "Las contraseñas no coinciden.",
    zipCode: "Código postal no encontrado, o errado.",
  };
  
  // Validar un campo con su expresión regular
  export const validateField = (expresion, value) => expresion.test(value);
  
  // Validar contraseñas
  export const validatePasswordMatch = (password, password2) =>
    password === password2;
  
  // Validar código postal y obtener ciudad
  export const validateZipCode = (zip, coData) => {
    const cityData = coData.find((item) => item.Zips.split(", ").includes(zip));
    return cityData ? { isValid: true, city: cityData.City } : { isValid: false, city: "" };
  };
  