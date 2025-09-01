import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";



const InputManager = ({
  state,
  setState,
  type = "text",
  label,
  placeholder,
  name,
  errorMessage,
  regex,
  customValidation,
  required = true,
  
}) => {
  const handleChange = (e) => {
    setState({ ...state, field: e.target.value });
    



  };

  const handleValidation = (e) => {
    if (regex) {
      if (regex.test(state.field)) {
        setState({ ...state, validate: "true" });
      } else {
        setState({ ...state, validate: "false" });
      }
    }
    if (customValidation) {
      customValidation(e);
    }
  };

  return (
    <div className="form-group">
      <label htmlFor={name} className="form-label">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <div className="input-group">
        <input
          type={type}
          id={name}
          placeholder={placeholder}
          value={state.field}
          onKeyUp={handleValidation}
          onChange={handleChange}
          onBlur={handleValidation}
          className={`form-control ${
            state.validate === "false" ? "is-invalid" : state.validate === "true" ? "is-valid" : ""
          }`}
        />
        <div className="input-icon">
          {state.validate && (
            <FontAwesomeIcon
              icon={state.validate === "true" ? faCheckCircle : faTimesCircle}
              className={`icon-${state.validate}`}
            />
          )}
        </div>
      </div>
      {state.validate === "false" && <span className="text-danger">{errorMessage}</span>}
    </div>
  );
};

// PropTypes para validación
InputManager.propTypes = {
  state: PropTypes.shape({
    field: PropTypes.string.isRequired,
    validate: PropTypes.oneOf(["true", "false", null]).isRequired,
  }).isRequired,
  setState: PropTypes.func.isRequired,
  type: PropTypes.string,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  name: PropTypes.string.isRequired,
  errorMessage: PropTypes.string,
  regex: PropTypes.instanceOf(RegExp),
  customValidation: PropTypes.func,
  required: PropTypes.bool,
};

// Valores por defecto
InputManager.defaultProps = {
  type: "text",
  placeholder: "",
  errorMessage: "Invalid input.",
  regex: null,
  customValidation: null,
  required: true,
};

export default InputManager;
