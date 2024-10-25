import { useEffect, useState } from "react";
import { register } from "../../utils/auth";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import coData from "../../../public/media/co.json"

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
    const uniqueDepartments = [...new Set(coData.map(item => item.Departamento))];
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
    const filteredCities = coData.filter(item => item.Departamento === dept);
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
    <>
      <main className="" style={{ marginBottom: 100, marginTop: 50 }}>
        <div className="container">
          {/* Section: Login form */}
          <section className="">
            <div className="row d-flex justify-content-center">
              <div className="col-xl-5 col-md-8">
                <div className="card rounded-5">
                  <div className="card-body p-4">
                    <h3 className="text-center">Formulario de registro</h3>
                    <br />

                    <div className="tab-content">
                      <div
                        className="tab-pane fade show active"
                        id="pills-login"
                        role="tabpanel"
                        aria-labelledby="tab-login"
                      >
                        <form onSubmit={handleSubmit}>
                          {/* Full Name input */}
                          <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="Full Name">
                              Nombre y Apellidos
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
                          {/* Email input */}
                          <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="loginName">
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

                          {/* Mobile Number input */}
                          <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="loginName">
                              Numero de telefono movil
                            </label>
                            <input
                              type="text"
                              id="phone"
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="Igrese su numero de celular"
                              required
                              className="form-control"
                            />
                          </div>

                          {/* Department dropdown */}
                          <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="department">
                              Departamento
                            </label>
                            <select
                              id="department"
                              onChange={handleDepartmentChange}
                              value={state}
                              className="form-control"
                              required
                            >
                              <option value="">Seleccione un Departamento</option>
                              {departments.map((dept, index) => (
                                <option key={index} value={dept}>
                                  {dept}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* City dropdown */}
                          <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="city">
                              Ciudad
                            </label>
                            <select
                              id="city"
                              onChange={handleCityChange}
                              value={city}
                              className="form-control"
                              required
                            >
                              <option value="">Seleccione una Ciudad</option>
                              {cities.map((city, index) => (
                                <option key={index} value={city.Ciudad}>
                                  {city.Ciudad}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Password input */}
                          <div className="form-outline mb-4">
                            <label
                              className="form-label"
                              htmlFor="loginPassword"
                            >
                              Contraseña
                            </label>
                            <input
                              type="password"
                              id="password"
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Ingrese una contraseña"
                              className="form-control"
                            />
                          </div>
                          
                          {/* Confirm Password input */}
                          <div className="form-outline mb-4">
                            <label
                              className="form-label"
                              htmlFor="confirm-password"
                            >
                              Confirmar contraseña
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
                          <p className="fw-bold text-danger">
                            {password2 !== password
                              ? "Las contraseñas no coinciden"
                              : ""}
                          </p>

                          <button
                            className="btn btn-primary w-100"
                            type="submit"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <span className="mr-2 ">Procesando espero un instante...</span>
                                <i className="fas fa-spinner fa-spin" />
                              </>
                            ) : (
                              <>
                                <span className="mr-2">Registrarse </span>
                                <i className="fas fa-user-plus" />
                              </>
                            )}
                          </button>

                          <div className="text-center">
                            <p className="mt-4">
                              Ya tiene una cuenta, ingrese aquí?{" "}
                              <Link to="/login">Iniciar sesion</Link>
                            </p>
                          </div>
                        </form>

                      </div>
                    </div>
                    {/* Pills content */}
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Section: Login form */}
        </div>
      </main>
    </>
  );
}

export default Register;
