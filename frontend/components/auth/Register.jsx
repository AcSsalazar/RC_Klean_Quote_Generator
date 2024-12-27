import { useEffect, useState } from "react";
import { register } from "../../src/utils/auth";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../src/RCA/auth";
import coData from "../../src/media/US_zips.json";
import "../../components/auth/styles/Register.css";
import apiInstance from "../../src/utils/axios";
import InputField from "./InputRegisterManager";

function Register() {
  const [fullname, setFullname] = useState({ field: "", validate: null });
  const [email, setEmail] = useState({ field: "", validate: null });
  const [phone, setPhone] = useState({ field: "", validate: null });
  const [address, setAddress] = useState({ field: "", validate: null });
  const [business, setBusiness] = useState({ field: "", validate: null });
  const [password, setPassword] = useState({ field: "", validate: null });
  const [password2, setPassword2] = useState({ field: "", validate: null });
  const [zipCode, setZipCode] = useState({ field: "", validate: null });
  const [city, setCity] = useState("");
  const [zipError, setZipError] = useState("");
  const [options, setOptions] = useState({ businessTypes: [] });
  const [terms, setTerms] = useState(false);
  const [validForm, setValidForm] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const navigate = useNavigate();

  const regexPatterns = {
    name: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
    email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    phone: /^\d{7,14}$/,
    password: /^.{4,12}$/,
    zipcode: /^\d{4,7}$/,
    address: /^[a-zA-Z0-9À-ÿ\s.,-]{5,30}$/,
    
  };

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const fetchBusinessTypes = async () => {
      try {
        const response = await apiInstance.get("options/");
        setOptions({
          businessTypes: response.data.business_types || [],
        });
      } catch (error) {
        console.error("Error fetching business types:", error);
      }
    };

    fetchBusinessTypes();
  }, []);



  const handleZipCodeChange = (e) => {
    const zip = e.target.value;
    setZipCode({ field: zip, validate: null });
    const cityData = coData.find((item) => item.Zips.split(", ").includes(zip));
    if (cityData) {
      setCity(cityData.City);
      setZipError("");
      setZipCode({ field: zip, validate: "true" });
    } else {
      setCity("");
      setZipError("Zip not found, please try again.");
      setZipCode({ field: zip, validate: "false" });
    }

    console.log("Zip Code:", zip);
    console.log("City Data:", cityData);

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted!");
    console.log("Form state before submission:", {
      fullname,
      email,
      phone,
      address,
      business,
      password,
      password2,
      zipCode,
      city,
      terms,
    });

    if (
      fullname.validate === "true" &&
      email.validate === "true" &&
      phone.validate === "true" &&
      address.validate === "true" &&
      business.validate === "true" &&
      password.validate === "true" &&
      password2.validate === "true" &&
      zipCode.validate === "true" &&
      city &&
      terms
    ) {
      setIsLoading(true);
      const { error } = await register(
        fullname.field,
        email.field,
        phone.field,
        password.field,
        password2.field,
        address.field,
        city,
        business.field,
        zipCode.field
      );


      if (error) {
        alert(JSON.stringify(error));
      } else {
        navigate("/");
        resetForm();
      }
      setIsLoading(false);
    } else {
      setValidForm(false);
    }
  };

  const resetForm = () => {
    setFullname({ field: "", validate: null });
    setEmail({ field: "", validate: null });
    setPhone({ field: "", validate: null });
    setAddress({ field: "", validate: null });
    setBusiness({ field: "", validate: null });
    setPassword({ field: "", validate: null });
    setPassword2({ field: "", validate: null });
    setZipCode({ field: "", validate: null });
    setCity("");
    setZipError("");
    setTerms(false);
  };

  const handleTermsChange = (e) => {
    setTerms(e.target.checked);
  };

  return (
    <main style={{ marginBottom: 100, marginTop: 50 }}>
      <div className="container">
        <section>
          <div className="card">
            <div className="card-body">
              <h3>Register Form</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <InputField
                    state={fullname}
                    setState={setFullname}
                    label="Full Name"
                    name="fullname"
                    placeholder="Enter your full name"
                    regex={regexPatterns.name}
                    errorMessage="Name must only contain letters and spaces."
                  />
                  <InputField
                    state={email}
                    setState={setEmail}
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    regex={regexPatterns.email}
                    errorMessage="Invalid email format."
                  />
                  <InputField
                    state={phone}
                    setState={setPhone}
                    label="Phone"
                    name="phone"
                    placeholder="Enter your phone number"
                    regex={regexPatterns.phone}
                    errorMessage="Phone must be between 7 and 14 digits."
                  />
                  <InputField
                    state={address}
                    setState={setAddress}
                    label="Address"
                    name="address"
                    placeholder="Enter your address"
                    regex={regexPatterns.address}
                    errorMessage="Address must be at least 5 characters"
  
                  />
                  <div className="form-group">
                    <label htmlFor="business">Business Type</label>
                    <select
                      id="business"
                      value={business.field}
                      onChange={(e) => setBusiness({ field: e.target.value, validate: "true" })}
                      className={`form-control ${
                        business.validate === "false" ? "is-invalid" : ""
                      }`}
                    >
                      <option value="">Select business type</option>
                      {options.businessTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <InputField
                    state={zipCode}
                    setState={setZipCode}
                    label="Zip Code"
                    name="zip_code"
                    placeholder="Enter your zip code"
                    customValidation={handleZipCodeChange}
                    errorMessage="Invalid zip code."
                  />
                  <p className="text-danger">{zipError}</p>
                  {city && (
                    <div className="form-group">
                      <label htmlFor="city">City</label>
                      <input type="text" id="city" value={city} readOnly className="form-control" />
                    </div>
                  )}
                  <InputField
                    state={password}
                    setState={setPassword}
                    label="Password"
                    name="password"
                    type="password"
                    regex={regexPatterns.password}
                    errorMessage="Password must be between 4 and 12 characters."
                  />
                  <InputField
                    state={password2}
                    setState={setPassword2}
                    label="Confirm Password"
                    name="password2"
                    type="password"
                    customValidation={() =>
                      setPassword2({
                        ...password2,
                        validate: password.field === password2.field ? "true" : "false",
                      })
                    }
                    errorMessage="Passwords must match."
                  />
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        name="terms"
                        checked={terms}
                        onChange={handleTermsChange}
                      />{" "}
                      Accept Terms and Conditions
                    </label>
                  </div>
                </div>
                {validForm === false && (
                  <div className="alert alert-warning" role="alert">
                    Please complete all fields correctly before continuing.
                  </div>
                )}
                <button className="btn" type="submit" disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Register"}
                </button>
                <div className="text-center">
                  <p className="mt-4">
                    Already have an account? <Link to="/login">Login</Link>
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
