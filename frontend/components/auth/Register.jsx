"use client"

import { useEffect, useState } from "react"
import { register } from "../../src/utils/auth"
import { Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "../../src/RCA/auth"
import coData from "../../src/media/US_zips.json"
import apiInstance from "../../src/utils/axios"
import "./styles/Register.css"
import InputManager from "../../components/auth/InputRegisterManager"

function Register() {
  // Form state
  const [fullname, setFullname] = useState({ field: "", validate: null })
  const [email, setEmail] = useState({ field: "", validate: null })
  const [phone, setPhone] = useState({ field: "", validate: null })
  const [address, setAddress] = useState({ field: "", validate: null })
  const [business, setBusiness] = useState({ field: "", validate: null })
  const [password, setPassword] = useState({ field: "", validate: null })
  const [password2, setPassword2] = useState({ field: "", validate: null })
  const [zipCode, setZipCode] = useState({ field: "", validate: null })
  const [city, setCity] = useState("")
  const [zipError, setZipError] = useState("")
  const [options, setOptions] = useState({ businessTypes: [] })
  const [terms, setTerms] = useState(false)
  const [validForm, setValidForm] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const navigate = useNavigate()

  const regexPatterns = {
    name: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
    email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    phone: /^\d{7,14}$/,
    password: /^.{4,12}$/,
    zipcode: /^\d{4,7}$/,
    address: /^[a-zA-Z0-9À-ÿ\s.,-]{5,30}$/,
  }

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/")
    }
  }, [isLoggedIn, navigate])

  useEffect(() => {
    const fetchBusinessTypes = async () => {
      try {
        const response = await apiInstance.get("options/")
        setOptions({
          businessTypes: response.data.business_types || [],
        })
      } catch (error) {
        console.error("Error fetching business types:", error)
      }
    }

    fetchBusinessTypes()
  }, [])

  const handleZipCodeChange = (e) => {
    const zip = e.target.value
    setZipCode({ field: zip, validate: null })

    const cityData = coData.find((item) => item.Zips.split(", ").includes(zip))

    if (cityData) {
      setCity(cityData.City)
      setZipError("")
      setZipCode({ field: zip, validate: "true" })
    } else {
      setCity("")
      setZipError("Zip not found, please try again.")
      setZipCode({ field: zip, validate: "false" })
    }
  }

  const validateInput = (value, regex) => {
    return regex.test(value) ? "true" : "false"
  }

  const handleInputChange = (e, setState, regex) => {
    const { value } = e.target
    setState({
      field: value,
      validate: validateInput(value, regex),
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

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
      setIsLoading(true)

      const { error } = await register(
        fullname.field,
        email.field,
        phone.field,
        password.field,
        password2.field,
        address.field,
        city,
        business.field,
        zipCode.field,
      )

      if (error) {
        alert(JSON.stringify(error))
      } else {
        navigate("/")
        resetForm()
      }

      setIsLoading(false)
    } else {
      setValidForm(false)
    }
  }

  const resetForm = () => {
    setFullname({ field: "", validate: null })
    setEmail({ field: "", validate: null })
    setPhone({ field: "", validate: null })
    setAddress({ field: "", validate: null })
    setBusiness({ field: "", validate: null })
    setPassword({ field: "", validate: null })
    setPassword2({ field: "", validate: null })
    setZipCode({ field: "", validate: null })
    setCity("")
    setZipError("")
    setTerms(false)
    setCurrentStep(1)
  }

  const handleTermsChange = (e) => {
    setTerms(e.target.checked)
  }

  const nextStep = () => {
    if (currentStep === 1) {
      if (fullname.validate === "true" && email.validate === "true" && phone.validate === "true") {
        setCurrentStep(currentStep + 1)
      } else {
        setValidForm(false)
      }
    } else if (currentStep === 2) {
      if (address.validate === "true" && business.validate === "true" && zipCode.validate === "true" && city) {
        setCurrentStep(currentStep + 1)
      } else {
        setValidForm(false)
      }
    }
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
    setValidForm(null)
  }

  return (
    <section className="register-section">
      <div className="register-container">
        <div className="register-card">
          <div className="register-card-body">
            <h3 className="register-title">Create Your Account</h3>
            <p className="register-subtitle">
              Step {currentStep} of {totalSteps}
            </p>

            <div className="form-steps">
              {[...Array(totalSteps)].map((_, i) => (
                <div
                  key={i}
                  className={`step-indicator ${currentStep > i + 1 ? "completed" : ""} ${currentStep === i + 1 ? "active" : ""}`}
                >
                  {currentStep > i + 1 ? "✓" : i + 1}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1: Personal Information */}
              <div className={`form-step ${currentStep === 1 ? "active" : ""}`}>
                <div className="form-group">
                  <InputManager
                    state={fullname}
                    setState={setFullname}
                    label="Full Name"
                    name="fullname"
                    placeholder="Enter your full name"
                    regex={regexPatterns.name}
                    errorMessage="Name must only contain letters and spaces."
                  />
                </div>

                <div className="form-group">
                  <InputManager
                    state={email}
                    setState={setEmail}
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    regex={regexPatterns.email}
                    errorMessage="Invalid email format."
                  />
                </div>

                <div className="form-group">
                  <InputManager
                    state={phone}
                    setState={setPhone}
                    label="Phone"
                    name="phone"
                    placeholder="Enter your phone number"
                    regex={regexPatterns.phone}
                    errorMessage="Phone must be between 7 and 14 digits."
                  />
                </div>
              </div>

              {/* Step 2: Address Information */}
              <div className={`form-step ${currentStep === 2 ? "active" : ""}`}>
                <div className="form-group">
                  <InputManager
                    state={address}
                    setState={setAddress}
                    label="Address"
                    name="address"
                    placeholder="Enter your address"
                    regex={regexPatterns.address}
                    errorMessage="Address must be at least 5 characters."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="business">
                    Business Type
                  </label>
                  <select
                    id="business"
                    className={`form-select ${business.validate === "false" ? "is-invalid" : ""}`}
                    value={business.field}
                    onChange={(e) =>
                      setBusiness({ field: e.target.value, validate: e.target.value ? "true" : "false" })
                    }
                  >
                    <option value="">Select business type</option>
                    {options.businessTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <InputManager
                    state={zipCode}
                    setState={setZipCode}
                    label="Zip Code"
                    name="zip_code"
                    placeholder="Enter your zip code"
                    customValidation={handleZipCodeChange}
                    errorMessage="Invalid zip code."
                  />
                </div>

                {city && (
                  <div className="form-group">
                    <label className="form-label" htmlFor="city">
                      City
                    </label>
                    <div className="city-display">{city}</div>
                  </div>
                )}
              </div>

              {/* Step 3: Security Information */}
              <div className={`form-step ${currentStep === 3 ? "active" : ""}`}>
                <div className="form-group">
                  <InputManager
                    state={password}
                    setState={setPassword}
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    regex={regexPatterns.password}
                    errorMessage="Password must be between 4 and 12 characters."
                  />
                </div>

                <div className="form-group">
                  <InputManager
                    state={password2}
                    setState={setPassword2}
                    label="Confirm Password"
                    name="password2"
                    type="password"
                    placeholder="Confirm your password"
                    customValidation={(e) => {
                      const val = e.target.value
                      setPassword2({
                        field: val,
                        validate: val === password.field ? "true" : "false",
                      })
                    }}
                    errorMessage="Passwords must match."
                  />
                </div>

                <div className="form-checkbox">
                  <input type="checkbox" id="terms" checked={terms} onChange={handleTermsChange} />
                  <label htmlFor="terms">I accept the Terms and Conditions</label>
                </div>

                {validForm === false && (
                  <div className="alert alert-warning">Please complete all fields correctly before continuing.</div>
                )}
              </div>

              <div className="form-actions">
                {currentStep > 1 && (
                  <button type="button" className="btn btn-secondary" onClick={prevStep}>
                    Back
                  </button>
                )}

                {currentStep < totalSteps ? (
                  <button type="button" className="btn btn-primary" onClick={nextStep}>
                    Continue
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary" disabled={isLoading || !terms}>
                    {isLoading ? (
                      <>
                        <span>Submitting...</span>
                        <div className="spinner" />
                      </>
                    ) : (
                      "Complete Registration"
                    )}
                  </button>
                )}
              </div>
            </form>

            <div className="register-links">
              <p>
                Already have an account?{" "}
                <Link to="/login" className="register-link">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Register
