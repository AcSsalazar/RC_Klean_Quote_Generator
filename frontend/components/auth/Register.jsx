import { useEffect, useState } from "react";
import { register } from "../../src/utils/auth";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../src/RCA/auth";
import coData from "../../src/media/US.json"
import "../../components/auth/styles/Register.css"

function Register() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [cities, setCities] = useState([]);
  const [state, setState] = useState("");
  const [city, setCity] = useState("");


  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/");
    }
    // Cargar departamentos únicos desde el archivo JSON
    const uniqueDepartments = [...new Set(coData.map(item => item.State))];
    setDepartments(uniqueDepartments);
  }, [isLoggedIn, navigate]);

  const resetForm = () => {
    setFullname("");
    setEmail("");
    setPhone("");
    setPassword("");
    setPassword2("");
    setState("");
    setCity("");
  };

  const handleDepartmentChange = (event) => {
    const dept = event.target.value;
    setState(dept);
    const filteredCities = coData.filter(item => item.State === dept);
    setCities(filteredCities);
    setCity(""); // Resetear ciudad seleccionada al cambiar de departamento
  };

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Set isLoading to true when the form is submitted
    setIsLoading(true);
    console.log({ fullname, email, phone, password, password2, state, city });
    const { error } = await register(
      fullname,
      email,
      phone,
      password,
      password2,
      state, // Incluye departamento seleccionado
      city // Incluye ciudad seleccionada
    );
    if (error) {
      alert(JSON.stringify(error));
    } else {
      navigate("/");
      resetForm();
    }

    // Reset isLoading to false when the operation is complete
    setIsLoading(false);
  };

  return (
    <main style={{ marginBottom: 100, marginTop: 50 }}>
      <div className="container">
        <section>
          <div className="card">
            <div className="card-body">
              <h3>Start Form </h3>

              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  {/* Nombre Completo */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="fullname">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullname"
                      onChange={(e) => setFullname(e.target.value)}
                      placeholder="Ingrese su nombre completo"
                      required
                      className="form-control"
                    />
                  </div>

                  {/* Email */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Ingrese correo electrónico"
                      required
                      className="form-control"
                    />
                  </div>

                  {/* Número de Teléfono */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="phone">
                      Phone number
                    </label>
                    <input
                      type="text"
                      id="phone"
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ingrese su número de celular"
                      required
                      className="form-control"
                    />
                  </div>

                  {/* Departamento */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="department">
                      State
                    </label>
                    <select
                      id="department"
                      onChange={handleDepartmentChange}
                      value={state}
                      className="form-control"
                      required
                    >
                      <option value="">select your state</option>
                      {departments.map((dept, index) => (
                        <option key={index} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Ciudad */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="city">
                      City
                    </label>
                    <select
                      id="city"
                      onChange={handleCityChange}
                      value={city}
                      className="form-control"
                      required
                    >
                      <option value="">Select your city</option>
                      {cities.map((city, index) => (
                        <option key={index} value={city.City}>
                          {city.City}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Contraseña */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="password">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Ingrese una contraseña"
                      className="form-control"
                    />
                  </div>

                  {/* Confirmar Contraseña */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="confirm-password">
                      Confirm your password
                    </label>
                    <input
                      type="password"
                      id="confirm-password"
                      onChange={(e) => setPassword2(e.target.value)}
                      placeholder="Escriba nuevamente su contraseña"
                      required
                      className="form-control"
                    />
                  </div>
                </div>

                <p className="fw-bold text-danger text-center">
                  {password2 !== password ? "Las contraseñas no coinciden" : ""}
                </p>

                <button
                  className="btn"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span>In progress...</span>
                      <i className="fas fa-spinner fa-spin" />
                    </>
                  ) : (
                    <>
                      <span>Register</span>
                      <i className="fas fa-user-plus" />
                    </>
                  )}
                </button>
                <div className="text-center">
                  <p className="mt-4">
                    ¿Have you already account ?{" "}
                    <Link to="/login">Login</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Register;