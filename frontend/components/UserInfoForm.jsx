import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import coData from "../src/media/US_zips.json";
import "../styles/StartInfoCard.css"; // Keep this as your file name
import apiInstance from "../src/utils/axios";
import InputField from "../components/auth/InputRegisterManager";

function UserInfoForm() {
  const [fullname, setFullname] = useState({ field: "", validate: null });
  const [email, setEmail] = useState({ field: "", validate: null });
  const [isLoading, setIsLoading] = useState(false);
  const [business, setBusiness] = useState({ field: "", validate: null });
  const [zipCode, setZipCode] = useState({ field: "", validate: null });
  const [city, setCity] = useState("");
  const [zipError, setZipError] = useState("");
  const [options, setOptions] = useState({ businessTypes: [] });
  const [phone, setPhone] = useState({ field: "", validate: null });
  const [address, setAddress] = useState({ field: "", validate: null }); 
  const [validForm, setValidForm] = useState(null);

  const navigate = useNavigate();

  const regexPatterns = {
    name: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
    email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    phone: /^\d{7,14}$/,
    address: /^[a-zA-Z0-9\s,.'-]{3,}$/, // Adjusted regex for address validation
    zipcode: /^\d{4,7}$/,
  };

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      fullname.validate === "true" &&
      email.validate === "true" &&
      business.validate === "true" &&
      zipCode.validate === "true" &&
      phone.validate === "true" &&
      address.validate === "true" &&
      city
    ) {
      setIsLoading(true);
      try {
        const payload = {
          business_type: Number(business.field),
          full_name: fullname.field,
          email: email.field,
          city: city,
          zip_code: zipCode.field,
          phone_number: phone.field,
          address: address.field,
          areas: [],
          equipment: [],
        };
        console.log("Payload:", payload);
        const response = await apiInstance.post("invoice/", payload);
        const quoteId = response.data.quote_id;

        const selectedBusiness = options.businessTypes.find(
          (type) => type.id === Number(business.field)
        );
        const initialStep = selectedBusiness?.name.toLowerCase() === "restaurants" ? 2 : 3;

        navigate(`/quote-calculator/${quoteId}`, { state: { initialStep } });
        resetForm();
      } catch (error) {
        console.error("Error sending data to backend:", error);
        alert(`Error: ${JSON.stringify(error.response?.data)}`);
      } finally {
        setIsLoading(false);
      }
    } else {
      setValidForm(false);
    }
  };

  const resetForm = () => {
    setFullname({ field: "", validate: null });
    setEmail({ field: "", validate: null });
    setBusiness({ field: "", validate: null });
    setZipCode({ field: "", validate: null });
    setPhone({ field: "", validate: null });
    setAddress({ field: "", validate: null });
    setCity("");
    setZipError("");
  };

  return (
    <div className="start-info-container">
      <div className="start-info-card">
        <h2 className="start-info-title">Get Started</h2>
        <p style={{color: '#00aaff96', textAlign: 'center', marginBottom: '4px'}}>We need some information</p>
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
            <div className="input-group">
              <label className="input-label">Business Type</label>
              <select
                id="business"
                value={business.field}
                onChange={(e) => setBusiness({ field: e.target.value, validate: e.target.value ? "true" : "false" })}
                className={`input-field ${business.validate === "false" ? "is-invalid" : business.validate === "true" ? "is-valid" : ""}`}
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
              state={phone}
              setState={setPhone}
              label="Phone Number"
              name="phone"
              placeholder="Enter your phone number"
              regex={regexPatterns.phone}
              errorMessage="Invalid phone number."  
            />

            <InputField
              state={address}
              setState={setAddress}
              label="Address"
              name="address"
              placeholder="Enter your address"
              regex={regexPatterns.address}
              errorMessage="Invalid address format."

            />



            <InputField
              state={zipCode}
              setState={setZipCode}
              label="Zip Code"
              name="zip_code"
              placeholder="Enter your zip code"
              customValidation={handleZipCodeChange}
              errorMessage="Invalid zip code."
            />
            {city && (
              <div className="input-group">
                <label className="input-label">City</label>
                <input
                  type="text"
                  value={city}
                  readOnly
                  className="input-field"
                />
              </div>
            )}
            {zipError && <p className="error-text">{zipError}</p>}
          </div>
          {validForm === false && (
            <div className="alert-warning">
              Please complete all fields correctly before continuing.
            </div>
          )}
          <button className="submit-btn" type="submit" disabled={isLoading}>
            {isLoading ? "Processing..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserInfoForm;