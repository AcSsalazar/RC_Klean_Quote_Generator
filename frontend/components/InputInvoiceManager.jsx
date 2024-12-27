/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";



const InputInvoiceManager = ({
  state,
  setState,
  errorMessage,
  required = true,
  
}) => {
  const handleChange = (e) => {
    setState({ ...state, field: e.target.value });
  };

  const handleValidation = (e) => {
    
      if (required==true) {
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


          //placeholder={placeholder}
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
InputInvoiceManager.propTypes = {

  state: PropTypes.shape({

    validate: PropTypes.oneOf(["true", "false", null]).isRequired,
  }).isRequired,
  setState: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  customValidation: PropTypes.func,
  required: PropTypes.bool,
};

// Valores por defecto
InputInvoiceManager.defaultProps = {

  errorMessage: "Invalid input.",
  customValidation: null,
  required: true,
};

export default InputInvoiceManager;
