import { useEffect, useState } from "react";
import { login } from "../../src/utils/auth";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../src/RCA/auth";
import { Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setUsername("");
    setPassword("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await login(username, password);
    if (error) {
      alert(error);
    } else {
      navigate("/");
      resetForm();
    }
    setIsLoading(false);
  };

  return (
    <section>
      <main >
        <div className="container">
          <section className="">
            <div className="row d-flex justify-content-center">
              <div className="col-xl-5 col-md-8">
                <div className="card rounded-5">
                  <div className="card-body p-4">
                    <h3 className="text-center">Inicio de sesion</h3>
                    <br />
                    <div className="tab-content">
                      <div
                        className="tab-pane fade show active"
                        id="pills-login"
                        role="tabpanel"
                        aria-labelledby="tab-login"
                      >
                        <form onSubmit={handleLogin}>
                          <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="Full Name">
                              Correo Electrónico
                            </label>
                            <input
                              type="text"
                              id="username"
                              name="username"
                              placeholder="Ingrese su e-mail"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              className="form-control"
                            />
                          </div>
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
                              name="password"
                              value={password}
                              placeholder="Ingrese su contraseña"
                              onChange={(e) => setPassword(e.target.value)}
                              className="form-control"
                            />
                          </div>
                          <button
                            className="btn btn-primary w-100"
                            type="submit"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <span className="mr-2 ">Procesando...</span>
                                <i className="fas fa-spinner fa-spin" />
                              </>
                            ) : (
                              <>
                                <span className="mr-2">Iniciar</span>
                                <i className="fas fa-sign-in-alt" />
                              </>
                            )}
                          </button>
                          <div className="text-center">
                            <p className="mt-4">
                              No ha creado una cuenta ?{" "}
                              <Link to="/register">Registrese ahora</Link>
                            </p>
                            <p className="mt-0">
                              <Link
                                to="/forgot-password"
                                className="text-danger"
                              >
                                Olvidó su contraseña ?
                              </Link>
                            </p>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </section>
  );
};

export default Login;
