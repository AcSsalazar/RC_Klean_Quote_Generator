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
import QtySelector from "./QtySelector";


export default function QuoteCalculator() {
  const navigate = useNavigate();
  const { quoteId } = useParams();
  const location = useLocation();
  const { initialStep } = location.state || {};
  const [step, setStep] = useState(initialStep);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isFormValid, setIsFormValid] = useState(null);
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
      setFields({
        ...fields,
        areas: [...fields.areas, { name: { field: "", validate: null }, square_feet: { field: "", validate: null }, floor_type: { field: "", validate: null } }],
      });
    } else {
      setIsFormValid(false);
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
      setIsFormValid(false);
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
    const isRestaurant = options.businessTypes.find(type => type.id === Number(fields.businessType.field))?.name.toLowerCase() === "restaurants" || fields.businessType.field.toLowerCase() === "restaurants";
    
    // Verificar si hay al menos un área o un equipo con datos
    const hasAreas = fields.areas.some(area => area.name.field && area.square_feet.field && area.floor_type.field);
    const hasEquipment = fields.equantity.some(equip => equip.name.field && (equip.validOptions.length === 0 || equip.option_value.field) && equip.quantity.field > 0);
    
    if (!hasAreas && !hasEquipment) {
      setIsFormValid(false);
      return;
    }

    const isValid = validateAllFields(fields, isRestaurant);
    if (!isValid) {
      setIsFormValid(false);
      return;
    }

    if (isLoggedIn() && (await fetchQuotes()) >= 20) {
      setIsFormValid(false);
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
      await apiInstance.patch(`invoice/${quoteId}/update/`, payload);
      setTimeout(() => {
        setIsCalculating(false);
        navigate(`/results/${quoteId}`);
      }, 4000);
    } catch (error) {
      console.error("Error updating invoice:", error);
      setIsFormValid(false);
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

  const renderStep = () => {
    const isCalculateDisabled = fields.equantity.some(item => 
      item.name.field && item.validOptions.length > 0 && !item.option_value.field
    );
    switch (step) {
      case 2:
        return (
          <div className="card">
            {isFormValid === false && (
              <div className="alert-warning">
                Please provide at least one area or equipment item to proceed with the calculation.
              </div>
            )}
            <h2>Equipment</h2>
            {fields.equantity.map((item, index) => (
              
              <div key={index} className="equantity-selector">
                <div className="input-group">
                  <label>Equipment <span className="text-danger">*</span></label>
                  <div className="input-wrapper">
                    <select
                      value={item.name.field}
                      onChange={(e) => handleEquantityChange(index, "name", e.target.value)}
                      onBlur={() => handleEquantityValidate(index, "name")}
                      className={`selector-input ${item.name.validate === "false" ? "is-invalid" : item.name.validate === "true" ? "is-valid" : ""}`}
                    >
                      <option value="">Select equipment</option>
                      {options.equipmentTypes.map((type) => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
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
                        className={`form-control-options ${item.option_value.validate === "false" ? "is-invalid" : item.option_value.validate === "true" ? "is-valid" : ""}`}
                      >
                        <option value="">Select size/quantity</option>
                        {item.validOptions.map((option) => (
                          <option key={option.id} value={option.option_value}>
                            {option.option_type_display} - {option.option_value_display}
                          </option>
                        ))}
                      </select>
                    </div>
                    {item.option_value.validate === "false" && <span className="text-danger">This field is required.</span>}
                  </div>
                )}
                <div className="input-group">
                  <label>Quantity <span className="text-danger">*</span></label>
                  <div className="input-wrapper">
<QtySelector
  initial={item.quantity.field || 1}
  min={1}
  max={10}   // o el tope que tú quieras
  onChange={(value) => {
    handleEquantityChange(index, "quantity", value);
    handleEquantityValidate(index, "quantity");
  }}
/>
{item.quantity.validate === "false" && (
  <span className="text-danger">Please enter a valid quantity (min 1).</span>
)}
                  </div>
                  {item.quantity.validate === "false" && <span className="text-danger">Please enter a valid quantity (min 1).</span>}
                </div>
                <button onClick={() => handleEquantityRemove(index)} className="remove-btn remove-equipment-btn">Remove</button>
              </div>
            ))}
            <button onClick={handleEquantityAdd} className="add-btn">Add Equipment</button>
            <span style={{marginTop: '2px'}}></span>

            <h2>Areas</h2>
            {fields.areas.map((area, index) => (
              <div key={index} className="area-item">
                <div className="input-group">
                  <label>Area Name</label>
                  <div className="input-wrapper">
                    <select
                      value={area.name.field}
                      onChange={(e) => handleAreaChange(index, "name", e.target.value)}
                      onBlur={() => handleAreaValidate(index, "name")}
                      className={`selector-input selector-area ${area.name.validate === "false" ? "is-invalid" : area.name.validate === "true" ? "is-valid" : ""}`}
                    >
                      <option value="">Select area</option>
                      {options.areaNames.map((areaOption) => (
                        <option key={areaOption.id} value={areaOption.id}>{areaOption.name}</option>
                      ))}
                    </select>
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
                      className={`selector-input selector-squarefeet ${area.square_feet.validate === "false" ? "is-invalid" : area.square_feet.validate === "true" ? "is-valid" : ""}`}
                    >
                      <option value="">Select size</option>
                      {SquareFeetOptions.map((sizeOption) => (
                        <option key={sizeOption.value} value={sizeOption.value}>{sizeOption.label}</option>
                      ))}
                    </select>
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
                      className={`selector-input selector-floor ${area.floor_type.validate === "false" ? "is-invalid" : area.floor_type.validate === "true" ? "is-valid" : ""}`}
                    >
                      <option value="">Select floor type</option>
                      {options.floorNames.map((floor) => (
                        <option key={floor.id} value={floor.id}>{floor.name}</option>
                      ))}
                    </select>
                  </div>
                  {area.floor_type.validate === "false" && <span className="text-danger">Please select a floor type.</span>}
                </div>
                <button onClick={() => handleRemoveArea(index)} className="remove-btn">Remove Area</button>
              </div>
            ))}
            <button onClick={handleAddArea} className="add-btn">Add Area</button>
            <p></p>
            <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
              <button 
                onClick={calculateTotalPrice} 
                className="calculate-button" 
                disabled={isCalculateDisabled}
              >
                Calculate
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="selector-card">
            {isFormValid === false && (
              <div className="alert-warning">
                Please provide at least one area to proceed with the calculation.
              </div>
            )}
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
                      className={`selector-input selector-area ${area.name.validate === "false" ? "is-invalid" : area.name.validate === "true" ? "is-valid" : ""}`}
                    >
                      <option value="">Select area</option>
                      {options.areaNames.map((areaOption) => (
                        <option key={areaOption.id} value={areaOption.id}>{areaOption.name}</option>
                      ))}
                    </select>
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
                      className={`selector-input squarefeet ${area.square_feet.validate === "false" ? "is-invalid" : area.square_feet.validate === "true" ? "is-valid" : ""}`}
                    >
                      <option value="">Select size</option>
                      {SquareFeetOptions.map((sizeOption) => (
                        <option key={sizeOption.value} value={sizeOption.value}>{sizeOption.label}</option>
                      ))}
                    </select>
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
                      className={`selector-input selector-floor ${area.floor_type.validate === "false" ? "is-invalid" : area.floor_type.validate === "true" ? "is-valid" : ""}`}
                    >
                      <option value="">Select floor type</option>
                      {options.floorNames.map((floor) => (
                        <option key={floor.id} value={floor.id}>{floor.name}</option>
                      ))}
                    </select>
                  </div>
                  {area.floor_type.validate === "false" && <span className="text-danger">Please select a floor type.</span>}
                </div>
                <button onClick={() => handleRemoveArea(index)} className="remove-btn">Remove Area</button>
              </div>
            ))}
            <button onClick={handleAddArea} className="add-btn">Add Area</button>
            <button onClick={calculateTotalPrice} className="calculate-btn areas">Calculate</button>
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
      {renderStep()}
    </div>
  );
}