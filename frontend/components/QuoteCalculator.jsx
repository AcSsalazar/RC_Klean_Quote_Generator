/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useAuthStore } from "../src/RCA/auth";
import apiInstance from "../src/utils/axios";
import "../styles/Options.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import useValidation from "./useValidator";
import { useNavigate, useLocation, useParams } from "react-router-dom";

export default function QuoteCalculator() {
  const navigate = useNavigate();
  const { quoteId } = useParams();
  const location = useLocation();
  const { initialStep } = location.state || {};
  const [step, setStep] = useState(initialStep);
  const [isCalculating, setIsCalculating] = useState(false);
  const [errors, setErrors] = useState({ general: "" });
  const [isLoggedIn, user] = useAuthStore((state) => [state.isLoggedIn, state.user]);

  const initialState = {
    businessType: { field: "", validate: null },
    areas: [{ name: { field: "", validate: null }, square_feet: { field: "", validate: null }, floor_type: { field: "", validate: null } }],
    equantity: [{ name: { field: "", validate: null }, option_type: { field: "", validate: null }, option_value: { field: "", validate: null }, quantity: { field: 0, validate: null }, validOptions: [] }],
  };
  const { fields, setFields, validateField, validateAllFields } = useValidation(initialState);

  const [options, setOptions] = useState({
    businessTypes: [],
    equipmentTypes: [],
    areaNames: [],
    floorNames: [],
    bus_qty: [],
  });

  const maxAreas = 4;
  const maxEquipment = 15;
  const SquareFeetOptions = [
    { value: 499, label: "0-500" },
    { value: 999, label: "500-1000" },
    { value: 1500, label: "More than 1000" },
  ];

  useEffect(() => {
    if (!quoteId || !initialStep) {
      navigate("/user-info");
    } else {
      const fetchInvoice = async () => {
        try {
          const response = await apiInstance.get(`invoice/${quoteId}/`);
          setFields(prev => ({
            ...prev,
            businessType: { field: String(response.data.business_type), validate: "true" },
          }));
        } catch (error) {
          console.error("Error fetching invoice:", error);
          navigate("/user-info");
        }
      };
      fetchInvoice();
    }
  }, [quoteId, initialStep, navigate]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await apiInstance.get("options/");
        setOptions({
          businessTypes: response.data.business_types || [],
          equipmentTypes: response.data.equipment_types || [],
          areaNames: response.data.area_names || [],
          floorNames: response.data.floor_types || [],
          bus_qty: response.data.bus_qty || [],
        });
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };
    fetchOptions();
  }, []);

  const handleAddArea = () => {
    if (fields.areas.length < maxAreas) {
      console.log("Adding new area. Current areas:", fields.areas.length);
      setFields({
        ...fields,
        areas: [...fields.areas, { name: { field: "", validate: null }, square_feet: { field: "", validate: null }, floor_type: { field: "", validate: null } }],
      });
    } else {
      setErrors({ ...errors, general: `You can only add up to ${maxAreas} areas.` });
    }
  };

  const handleRemoveArea = (index) => {
    const newAreas = [...fields.areas];
    newAreas.splice(index, 1);
    setFields({ ...fields, areas: newAreas });
  };

  const handleAreaChange = (index, field, value) => {
    const newAreas = [...fields.areas];
    newAreas[index][field].field = value;
    setFields({ ...fields, areas: newAreas });
  };

  const handleAreaValidate = (index, field) => {
    const newAreas = [...fields.areas];
    newAreas[index][field].validate = validateField(newAreas[index][field].field);
    setFields({ ...fields, areas: newAreas });
  };

  const handleEquantityAdd = () => {
    if (fields.equantity.length < maxEquipment) {
      setFields({
        ...fields,
        equantity: [...fields.equantity, { name: { field: "", validate: null }, option_type: { field: "", validate: null }, option_value: { field: "", validate: null }, quantity: { field: 0, validate: null }, validOptions: [] }],
      });
    } else {
      setErrors({ ...errors, general: `You can only add up to ${maxEquipment} equipment items.` });
    }
  };

  const handleEquantityRemove = (index) => {
    const newEquantity = [...fields.equantity];
    newEquantity.splice(index, 1);
    setFields({ ...fields, equantity: newEquantity });
  };

  const handleEquantityChange = (index, field, value) => {
    const newEquantity = [...fields.equantity];
    if (field === "quantity") {
      newEquantity[index][field].field = Math.max(1, Number(value));
    } else {
      newEquantity[index][field].field = value;
    }
    if (field === "name") {
      const validOptions = options.bus_qty.filter(option => option.equipment_type === Number(value));
      newEquantity[index].validOptions = validOptions;
      newEquantity[index].option_type = { field: "", validate: null };
      newEquantity[index].option_value = { field: "", validate: null };
    }
    setFields({ ...fields, equantity: newEquantity });
  };

  const handleEquantityValidate = (index, field) => {
    const newEquantity = [...fields.equantity];
    newEquantity[index][field].validate = validateField(newEquantity[index][field].field);
    setFields({ ...fields, equantity: newEquantity });
  };

  const handleOptionChange = (index, selectedOptionValue) => {
    const newEquantity = [...fields.equantity];
    const currentItem = newEquantity[index];
    currentItem.option_value.field = selectedOptionValue;
    const selectedOption = currentItem.validOptions.find(option => option.option_value.toString() === selectedOptionValue);
    currentItem.option_type.field = selectedOption ? selectedOption.option_type : "";
    setFields({ ...fields, equantity: newEquantity });
  };

  const calculateTotalPrice = async () => {
    console.log("Calculate button clicked");
    const isRestaurant = options.businessTypes.find(type => type.id === Number(fields.businessType.field))?.name.toLowerCase() === "restaurants" || fields.businessType.field.toLowerCase() === "restaurants";
    console.log("Is Restaurant:", isRestaurant, "Step:", step);
    console.log("Equantity details:", fields.equantity);
    console.log("Areas details:", fields.areas);
    const isValid = validateAllFields(fields, isRestaurant);
    console.log("Validation result:", isValid, "Fields:", fields);
    if (!isValid) {
      setErrors({ ...errors, general: "Please fill out all required fields correctly. Equipment options are required if available." });
      return;
    }

    if (isLoggedIn() && (await fetchQuotes()) >= 20) {
      setErrors({ ...errors, general: "You’ve reached the maximum of 20 saved quotes." });
      return;
    }

    setIsCalculating(true);
    try {
      const businessTypeId = options.businessTypes.find(type => type.name.toLowerCase() === fields.businessType.field.toLowerCase())?.id || Number(fields.businessType.field);
      const payload = {
        business_type: businessTypeId,
        areas: fields.areas.filter(a => a.name.field).map(area => ({
          name: Number(area.name.field),
          square_feet: Number(area.square_feet.field),
          floor_type: Number(area.floor_type.field),
        })),
        equipment: fields.equantity.filter(e => e.name.field).map(equip => ({
          name: Number(equip.name.field),
          quantity: Number(equip.quantity.field),
          option_type: equip.option_type.field,
          option_value: equip.option_value.field ? Number(equip.option_value.field) : null,
        })),
      };
      console.log("Payload being sent:", payload);
      await apiInstance.patch(`invoice/${quoteId}/update/`, payload);
      setTimeout(() => {
        setIsCalculating(false);
        navigate(`/results/${quoteId}`);
      }, 5000);
    } catch (error) {
      console.error("Error updating invoice:", error);
      setErrors({ ...errors, general: error.response?.data?.error || "Error calculating price." });
      setIsCalculating(false);
    }
  };

  const fetchQuotes = async () => {
    if (isLoggedIn()) {
      try {
        const response = await apiInstance.get("saved-quotes/");
        return response.data.length;
      } catch (error) {
        console.error("Error fetching quotes:", error);
        return 0;
      }
    }
    return 0;
  };

  const renderValidationIcon = (validateStatus) => {
    if (!validateStatus) return null;
    return <FontAwesomeIcon icon={validateStatus === "true" ? faCheckCircle : faTimesCircle} className={`icon-${validateStatus}`} />;
  };

  const renderStep = () => {
    const isCalculateDisabled = fields.equantity.some(item => 
      item.name.field && item.validOptions.length > 0 && !item.option_value.field
    );
    switch (step) {
      case 2:
        return (
          <div className="card">
            <h2>Equipment</h2>
            {fields.equantity.map((item, index) => (
              <div key={index} className="equantity-item">
                <div className="input-group">
                  <label>Equipment <span className="text-danger">*</span></label>
                  <div className="input-wrapper">
                    <select
                      value={item.name.field}
                      onChange={(e) => handleEquantityChange(index, "name", e.target.value)}
                      onBlur={() => handleEquantityValidate(index, "name")}
                      className={`form-control ${item.name.validate === "false" ? "is-invalid" : item.name.validate === "true" ? "is-valid" : ""}`}
                    >
                      <option value="">Select equipment</option>
                      {options.equipmentTypes.map((type) => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                    {renderValidationIcon(item.name.validate)}
                  </div>
                  {item.name.validate === "false" && <span className="text-danger">Please select an equipment type.</span>}
                </div>
                {item.validOptions.length > 0 && (
                  <div className="input-group">
                    <label>Options <span className="text-danger">*</span></label>
                    <div className="input-wrapper">
                      <select
                        value={item.option_value.field}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        onBlur={() => handleEquantityValidate(index, "option_value")}
                        className={`form-control ${item.option_value.validate === "false" ? "is-invalid" : item.option_value.validate === "true" ? "is-valid" : ""}`}
                      >
                        <option value="">Select size/quantity</option>
                        {item.validOptions.map((option) => (
                          <option key={option.id} value={option.option_value}>
                            {option.option_type_display} - {option.option_value_display}
                          </option>
                        ))}
                      </select>
                      {renderValidationIcon(item.option_value.validate)}
                    </div>
                    {item.option_value.validate === "false" && <span className="text-danger">This field is required.</span>}
                  </div>
                )}
                <div className="input-group">
                  <label>Quantity <span className="text-danger">*</span></label>
                  <div className="input-wrapper">
                    <input
                      type="number"
                      value={item.quantity.field}
                      onChange={(e) => handleEquantityChange(index, "quantity", e.target.value)}
                      onBlur={() => handleEquantityValidate(index, "quantity")}
                      className={`form-control ${item.quantity.validate === "false" ? "is-invalid" : item.quantity.validate === "true" ? "is-valid" : ""}`}
                      placeholder="Enter quantity"
                    />
                    {renderValidationIcon(item.quantity.validate)}
                  </div>
                  {item.quantity.validate === "false" && <span className="text-danger">Please enter a valid quantity (min 1).</span>}
                </div>
                <button onClick={() => handleEquantityRemove(index)} className="remove-btn">Remove</button>
              </div>
            ))}
            <button onClick={handleEquantityAdd} className="add-btn">Add Equipment</button>

            <h2>Areas (Optional)</h2>
            {fields.areas.map((area, index) => (
              <div key={index} className="area-item">
                <div className="input-group">
                  <label>Area Name</label>
                  <div className="input-wrapper">
                    <select
                      value={area.name.field}
                      onChange={(e) => handleAreaChange(index, "name", e.target.value)}
                      onBlur={() => handleAreaValidate(index, "name")}
                      className={`form-control ${area.name.validate === "false" ? "is-invalid" : area.name.validate === "true" ? "is-valid" : ""}`}
                    >
                      <option value="">Select area</option>
                      {options.areaNames.map((areaOption) => (
                        <option key={areaOption.id} value={areaOption.id}>{areaOption.name}</option>
                      ))}
                    </select>
                    {renderValidationIcon(area.name.validate)}
                  </div>
                  {area.name.validate === "false" && <span className="text-danger">Please select an area.</span>}
                </div>
                <div className="input-group">
                  <label>Square Feet Range</label>
                  <div className="input-wrapper">
                    <select
                      value={area.square_feet.field}
                      onChange={(e) => handleAreaChange(index, "square_feet", e.target.value)}
                      onBlur={() => handleAreaValidate(index, "square_feet")}
                      className={`form-control ${area.square_feet.validate === "false" ? "is-invalid" : area.square_feet.validate === "true" ? "is-valid" : ""}`}
                    >
                      <option value="">Select size</option>
                      {SquareFeetOptions.map((sizeOption) => (
                        <option key={sizeOption.value} value={sizeOption.value}>{sizeOption.label}</option>
                      ))}
                    </select>
                    {renderValidationIcon(area.square_feet.validate)}
                  </div>
                  {area.square_feet.validate === "false" && <span className="text-danger">Please select a size range.</span>}
                </div>
                <div className="input-group">
                  <label>Floor Type</label>
                  <div className="input-wrapper">
                    <select
                      value={area.floor_type.field}
                      onChange={(e) => handleAreaChange(index, "floor_type", e.target.value)}
                      onBlur={() => handleAreaValidate(index, "floor_type")}
                      className={`form-control ${area.floor_type.validate === "false" ? "is-invalid" : area.floor_type.validate === "true" ? "is-valid" : ""}`}
                    >
                      <option value="">Select floor type</option>
                      {options.floorNames.map((floor) => (
                        <option key={floor.id} value={floor.id}>{floor.name}</option>
                      ))}
                    </select>
                    {renderValidationIcon(area.floor_type.validate)}
                  </div>
                  {area.floor_type.validate === "false" && <span className="text-danger">Please select a floor type.</span>}
                </div>
                <button onClick={() => handleRemoveArea(index)} className="remove-btn">Remove Area</button>
              </div>
            ))}
            <button onClick={handleAddArea} className="add-btn">Add Area</button>
            <button 
              onClick={calculateTotalPrice} 
              className="calculate-btn" 
              disabled={isCalculateDisabled}
            >
              Calculate
            </button>
          </div>
        );
      case 3:
        return (
          <div className="selector-card">
            <h2>Areas</h2>
            {fields.areas.map((area, index) => (
              <div key={index} className="area-item">
                <div className="input-group">
                  <label>Area Name <span className="text-danger">*</span></label>
                  <div className="input-wrapper">
                    <select
                      value={area.name.field}
                      onChange={(e) => handleAreaChange(index, "name", e.target.value)}
                      onBlur={() => handleAreaValidate(index, "name")}
                      className={`form-control ${area.name.validate === "false" ? "is-invalid" : area.name.validate === "true" ? "is-valid" : ""}`}
                    >
                      <option value="">Select area</option>
                      {options.areaNames.map((areaOption) => (
                        <option key={areaOption.id} value={areaOption.id}>{areaOption.name}</option>
                      ))}
                    </select>
                    {renderValidationIcon(area.name.validate)}
                  </div>
                  {area.name.validate === "false" && <span className="text-danger">Please select an area.</span>}
                </div>
                <div className="input-group">
                  <label>Square Feet Range <span className="text-danger">*</span></label>
                  <div className="input-wrapper">
                    <select
                      value={area.square_feet.field}
                      onChange={(e) => handleAreaChange(index, "square_feet", e.target.value)}
                      onBlur={() => handleAreaValidate(index, "square_feet")}
                      className={`form-control ${area.square_feet.validate === "false" ? "is-invalid" : area.square_feet.validate === "true" ? "is-valid" : ""}`}
                    >
                      <option value="">Select size</option>
                      {SquareFeetOptions.map((sizeOption) => (
                        <option key={sizeOption.value} value={sizeOption.value}>{sizeOption.label}</option>
                      ))}
                    </select>
                    {renderValidationIcon(area.square_feet.validate)}
                  </div>
                  {area.square_feet.validate === "false" && <span className="text-danger">Please select a size range.</span>}
                </div>
                <div className="input-group">
                  <label>Floor Type <span className="text-danger">*</span></label>
                  <div className="input-wrapper">
                    <select
                      value={area.floor_type.field}
                      onChange={(e) => handleAreaChange(index, "floor_type", e.target.value)}
                      onBlur={() => handleAreaValidate(index, "floor_type")}
                      className={`form-control ${area.floor_type.validate === "false" ? "is-invalid" : area.floor_type.validate === "true" ? "is-valid" : ""}`}
                    >
                      <option value="">Select floor type</option>
                      {options.floorNames.map((floor) => (
                        <option key={floor.id} value={floor.id}>{floor.name}</option>
                      ))}
                    </select>
                    {renderValidationIcon(area.floor_type.validate)}
                  </div>
                  {area.floor_type.validate === "false" && <span className="text-danger">Please select a floor type.</span>}
                </div>
                <button onClick={() => handleRemoveArea(index)} className="remove-btn">Remove Area</button>
              </div>
            ))}
            <button onClick={handleAddArea} className="add-btn">Add Area</button>
            <button onClick={calculateTotalPrice} className="calculate-btn">Calculate</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="invoice-estimator">
      {isCalculating && (
        <div className="loading-overlay">
          <img src="../src/assets/3.gif" alt="Calculating" />
          <p>Calculating Price...</p>
        </div>
      )}
      {errors.general && <p className="error">{errors.general}</p>}
      {renderStep()}
    </div>
  );
}