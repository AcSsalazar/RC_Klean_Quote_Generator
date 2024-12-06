import { useEffect, useState } from "react";
import { register } from "../../src/utils/auth";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../src/RCA/auth";
import coData from "../../src/media/US_zips.json";
import "../../components/auth/styles/Register.css";
import  apiInstance from "../../src/utils/axios";


function Register() {
  const [fullname, setFullname] = useState({field:"", validate:null});
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [business, setBusiness] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [zipError, setZipError] = useState("");
  const [options, setOptions] = useState({businessTypes: [],});

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);



  useEffect(() => {
    const fetchbusiness = async () => {
      try {
        const response = await apiInstance.get("options/");
        setOptions({
          businessTypes: response.data.business_types || [],


        });
      } catch (error) {
        console.error("Error fetching business types:", error);
      }
    };

    fetchbusiness();
  }, []);

  const handleZipCodeChange = (e) => {
    const zip = e.target.value;
    setZipCode(zip);

    // Buscar el código postal en el archivo JSON
    const cityData = coData.find((item) => item.Zips.split(", ").includes(zip));
    if (cityData) {
      setCity(cityData.City);
      setZipError(""); // Limpiar error si se encuentra la ciudad
    } else {
      setCity(""); // Limpiar ciudad si no se encuentra
      setZipError("Zip not found, please try again"); // Mostrar error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await register(
      fullname,
      email,
      phone,
      password,
      password2,
      city, 
      address,
      business,
      zipCode,
    );

    if (error) {
      alert(JSON.stringify(error));
    } else {
      navigate("/");
      resetForm();
    }

    setIsLoading(false);
  };

  const resetForm = () => {
    setFullname("");
    setEmail("");
    setPhone("");
    setPassword("");
    setPassword2("");
    setZipCode("");
    setCity("");
    setAddress("");
    setZipError("");
    setBusiness("");
  };

  return (
    <main style={{ marginBottom: 100, marginTop: 50 }}>
      <div className="container">
        <section>
          <div className="card">
            <div className="card-body">
              <h3>Start Form</h3>

              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  {/* Nombre Completo */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="fullname">Full Name</label>
                    <input
                      type="text"
                      id="fullname"
                      onChange={(e) => setFullname(e.target.value)}
                      placeholder="Enter your full name"
                      required
                      className="form-control"
                    />
                  </div>

                  {/* Código Postal */}
                  <div className="form-group">
                    
                    <label className="form-label" htmlFor="zipcode">Zip Code</label>
                    <input
                      type="text"
                      id="zip_code"
                      value={zipCode}
                      onChange={handleZipCodeChange}
                      placeholder="Enter your zip code"
                      required
                      className="form-control"
                    />
                    <p className="text-danger">{zipError}</p>
                  </div>

                  {/* Ciudad */}
                  {city && (
                    <div className="form-group">
                      <label className="form-label" htmlFor="city">City</label>
                      <input
                        type="text"
                        id="city"
                        value={city}
                        required
                        className="form-control"
                      />
                    </div>
                  )}

                  
                  {/* Address*/}
                  
                    <div className="form-group">
                      <label className="form-label" htmlFor="address">Address</label>
                      <input
                        type="text"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter your address"
                        required
                        className="form-control"
                      />
                    </div>
                  

                  {/* Businnes Type */}

                  <div className="form-group">
                    <label className="form-label" htmlFor="business">Business Type</label>
                    <select
                  id="business_type"
                  value={business}
                  onChange={(e) => setBusiness(e.target.value)}
                >
                  <option value="">Select business type</option>
                  {options.businessTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
            

                  {/* Email */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Ingrese correo electrónico"
                      required
                      className="form-control"
                    />
                  </div>

                  {/* Teléfono */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="phone">Phone number</label>
                    <input
                      type="text"
                      id="phone"
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone number"
                      required
                      className="form-control"
                    />
                  </div>

                  {/* Contraseña */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="password">Password</label>
                    <input
                      type="password"
                      id="password"
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Insert a new password"
                      className="form-control"
                    />
                  </div>

                  {/* Confirmar Contraseña */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="confirm-password">Confirm your password</label>
                    <input
                      type="password"
                      id="confirm-password"
                      onChange={(e) => setPassword2(e.target.value)}
                      placeholder="Confirm your password"
                      required
                      className="form-control"
                    />
                  </div>
                </div>

                <p className="fw-bold text-danger text-center">
                  {password2 !== password ? "Las contraseñas no coinciden" : ""}
                </p>

                <button className="btn" type="submit" disabled={isLoading}>
                  {isLoading ? "In progress..." : "Register"}
                </button>

                <div className="text-center">
                  <p className="mt-4">
                    ¿Have you already an account? <Link to="/login">Login</Link>
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