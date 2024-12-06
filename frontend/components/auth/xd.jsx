/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../src/RCA/auth"; // Hook personalizado para autenticación
import apiInstance from "../../src/utils/axios"; // Instancia configurada de Axios
import {
  validateField,
  validatePasswordMatch,
  validateZipCode,
  expresiones,
  errorMessages,
} from "../../src/utils/inputManager"; // Utilidades para validaciones
import coData from "../../src/media/US_zips.json"; // Datos de códigos postales
import "../../components/auth/styles/Register.css"; // Estilos CSS

const Register = () => {
  // Estado agrupado para los datos del formulario
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    password2: "",
    zipCode: "",
    city: "",
  });

  // Estado para errores en validación
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar el botón de carga
  const [businessTypes, setBusinessTypes] = useState([]); // Estado para tipos de negocio

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn); // Verificar si el usuario está autenticado
  const navigate = useNavigate(); // Hook de navegación

  // Redirigir si el usuario ya está autenticado
  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  // Obtener opciones de negocio desde la API
  useEffect(() => {
    const fetchBusinessTypes = async () => {
      try {
        const response = await apiInstance.get("/options/");
        setBusinessTypes(response.data.business_types || []);
      } catch (error) {
        console.error("Error al obtener los tipos de negocio:", error);
      }
    };

    fetchBusinessTypes();
  }, []);

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value })); // Actualizar estado de los datos

    // Validación dinámica de los campos
    switch (name) {
      case "fullname":
        setErrors((prev) => ({
          ...prev,
          fullname: validateField(expresiones.fullname, value)
            ? ""
            : errorMessages.fullname,
        }));
        break;
      case "email":
        setErrors((prev) => ({
          ...prev,
          email: validateField(expresiones.email, value)
            ? ""
            : errorMessages.email,
        }));
        break;
      case "phone":
        setErrors((prev) => ({
          ...prev,
          phone: validateField(expresiones.phone, value)
            ? ""
            : errorMessages.phone,
        }));
        break;
      case "password":
        setErrors((prev) => ({
          ...prev,
          password: validateField(expresiones.password, value)
            ? ""
            : errorMessages.password,
        }));
        break;
      case "password2":
        setErrors((prev) => ({
          ...prev,
          password2: validatePasswordMatch(formData.password, value)
            ? ""
            : errorMessages.password2,
        }));
        break;
      case "zipCode":
        const zipValidation = validateZipCode(value, coData);
        setErrors((prev) => ({
          ...prev,
          zipCode: zipValidation.isValid
            ? ""
            : "El código postal debe tener hasta 6 dígitos numéricos.",
        }));
        setFormData((prev) => ({
          ...prev,
          city: zipValidation.city || "",
        }));
        break;
      default:
        break;
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid =
      validateField(expresiones.fullname, formData.fullname) &&
      validateField(expresiones.email, formData.email) &&
      validateField(expresiones.phone, formData.phone) &&
      validateField(expresiones.password, formData.password) &&
      validatePasswordMatch(formData.password, formData.password2) &&
      validateZipCode(formData.zipCode, coData).isValid;

    if (!isValid) {
      alert("Por favor, corrige los errores antes de enviar el formulario.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiInstance.post("/user/register/", formData);
      console.log("Usuario registrado:", response.data);
      navigate("/login"); // Redirigir después del registro
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      alert("Error al registrar. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={{ marginBottom: 100, marginTop: 50 }}>
      <div className="container">
        <section>
          <div className="card">
            <div className="card-body">
              <h3>REGISTRATION FORM</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                {/* Nombre Completo */}
                <div className="form-group">
                  <label htmlFor="fullname"className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleInputChange}
                    className={`form-control ${
                      errors.fullname ? "is-invalid" : "is-valid"
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.fullname && (
                    <p className="text-danger">{errors.fullname}</p>
                  )}
                </div>

                {/* Correo Electrónico */}
                  <div className="form-group">
                  <label htmlFor="email" className="form-label" >Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`form-control ${
                      errors.email ? "is-invalid" : "is-valid"
                    }`}
                    placeholder="Enter your email adress"
                  />
                  {errors.email && <p className="text-danger">{errors.email}</p>}
                </div>

                {/* Teléfono */}
                <div className="form-group">
                  <label htmlFor="phone" className="form-label" >Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`form-control ${
                      errors.phone ? "is-invalid" : "is-valid"
                    }`}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && <p className="text-danger">{errors.phone}</p>}
                </div>

                {/* Contraseña */}
                <div className="form-group">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`form-control ${
                      errors.password ? "is-invalid" : "is-valid"
                    }`}
                    placeholder="Ingresa una contraseña"
                  />
                  {errors.password && (
                    <p className="text-danger">{errors.password}</p>
                  )}
                </div>

                {/* Confirmar Contraseña */}
                <div className="form-group">
                  <label htmlFor="password2" className="form-label" >Confirm your password</label>
                  <input
                    type="password"
                    name="password2"
                    value={formData.password2}
                    onChange={handleInputChange}
                    className={`form-control ${
                      errors.password2 ? "is-invalid" : "is-valid"
                    }`}
                    placeholder="Confirm password"
                  />
                  {errors.password2 && (
                    <p className="text-danger">{errors.password2}</p>
                  )}
                </div>

                {/* Código Postal */}
                <div className="form-group">
                  <label className="form-label" htmlFor="zipCode" >Zip Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className={`form-control ${
                      errors.zipCode ? "is-invalid" : "is-valid"
                    }`}
                    placeholder="Enter your zip code"
                  />
                  {errors.zipCode && (
                    <p className="text-danger">{errors.zipCode}</p>
                  )}
                </div>

                {/* Ciudad */}
                {formData.city && (
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      className="form-control"
                      readOnly
                    />
                  </div>
                )}

                {/* Tipos de Negocio */}
                <div className="form-group">
                  <label htmlFor="business" className="form-label" >Business Type</label>
                  <select
                    name="business"
                    value={formData.business}
                    onChange={handleInputChange}
                    className="form-control"
                  >
                    <option value="">Select your business type</option>
                    {businessTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

 
                </div>

                <div>
                <div className="text-center">
                  <p className="mt-4">
                    ¿Already have an account? <Link to="/login">Login</Link>
                  </p>
                </div>
                <div className="centered">
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Register"}
                </button>

                </div>

                </div>




              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Register;