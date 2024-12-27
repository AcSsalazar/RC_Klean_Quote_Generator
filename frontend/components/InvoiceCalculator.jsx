/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useAuthStore } from "../src/RCA/auth"; // For userdata
import apiInstance from "../src/utils/axios";  // Importación actualizada
import "../styles/InvoiceCalculator.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFireBurner, faBroom, faKitchenSet, faFilter, faTableCells, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { useParams } from "react-router-dom";




export default function InvoiceEstimator() {
  const param = useParams("");

  const [businessType, setBusinessType] = useState({ field: "", validate: null });
  const [areas, setAreas] = useState([
    { name: { field: "", validate: null }, square_feet: { field: "", validate: null }, floor_type: { field: "", validate: null } },
  ]);
  const [equantity, setEquantity] = useState([
    { name: { field: "", validate: null }, option_type: { field: "", validate: null }, option_value: { field: "", validate: null }, quantity: { field: 0, validate: null }, validOptions: [] },
  ]);
  
  const [totalPrice, setTotalPrice] = useState(0);
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [invoiceId, setInvoiceId] = useState(null);
  const [options, setOptions] = useState({ 
    businessTypes: [],
    equipmentTypes: [],
    areaNames: [],
    floorNames: [],
    bus_qty: [],
  });

  const [errors, setErrors] = useState({
    general: ""
  });

  const maxAreas = 4;
  const maxEquipment = 15;
  const SquareFeetOptions = [
    { value: 499, label: "0-500" },
    { value: 999, label: "500-1000" },
    { value: 1500, label: "More than 1000" },
  ];

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

  // Función genérica de validación: revisa si es requerido y si el valor es válido
  const validateField = (value, required = true) => {
    if (required && (!value || value.toString().trim() === "")) {
      return "false";
    } else {
      return "true";
    }
  };

  const handleBusinessTypeChange = (e) => {
    setBusinessType({ ...businessType, field: e.target.value });
  };

  const handleBusinessTypeValidate = () => {
    setBusinessType({ ...businessType, validate: validateField(businessType.field, true) });
  };

  // Manejo de areas:
  const handleAddArea = () => {
    if (areas.length < maxAreas) {
      setAreas([...areas, { name: { field: "", validate: null }, square_feet: { field: "", validate: null }, floor_type: { field: "", validate: null } }]);
    } else {
      setErrors({ ...errors, general: `You can only add up to ${maxAreas} areas.` });
    } 
  };

  const handleRemoveArea = (index) => {
    const newAreas = [...areas];
    newAreas.splice(index, 1);
    setAreas(newAreas);
  };

  const handleAreaChange = (index, field, value) => {
    const newAreas = [...areas];
    newAreas[index][field].field = value;
    setAreas(newAreas);
  };

  const handleAreaValidate = (index, field) => {
    const newAreas = [...areas];
    newAreas[index][field].validate = validateField(newAreas[index][field].field, true);
    setAreas(newAreas);
  };

  // Manejo del equipment:
  const handleEquantityAdd = () => {
    if (equantity.length < maxEquipment) {
      setEquantity([...equantity, { name: { field: "", validate: null }, option_type: { field: "", validate: null }, option_value: { field: "", validate: null }, quantity: { field: 0, validate: null }, validOptions: [] }]);
    } else {
      setErrors({ ...errors, general: `You can only add up to  ${maxEquipment} equipment items.`});
    }
  };

  const handleEquantityRemove = (index) => {
    const newEquantity = [...equantity];
    newEquantity.splice(index, 1);
    setEquantity(newEquantity);
  };

  const handleEquantityChange = (index, field, value) => {
    const newEquantity = [...equantity];
  
    if (field === "quantity") {
      newEquantity[index][field].field = Math.max(1, Number(value));
    } else {
      newEquantity[index][field].field = value;
    }
  
    // Si el campo que cambió es "name", significa que se seleccionó un tipo de equipo
    if (field === "name") {
      // Filtra las opciones válidas para este tipo de equipo
      const validOptions = options.bus_qty.filter(
        (option) => option.equipment_type === Number(value)
      );
  
      // Asigna validOptions al equipo actual
      newEquantity[index].validOptions = validOptions;
  
      // Reinicia option_type y option_value ya que es un nuevo equipo seleccionado
      newEquantity[index].option_type = { field: "", validate: null };
      newEquantity[index].option_value = { field: "", validate: null };
    }
  
    setEquantity(newEquantity);
  };

  const handleEquantityValidate = (index, field, required = true) => {
    const newEquantity = [...equantity];
    newEquantity[index][field].validate = validateField(newEquantity[index][field].field, required);
    setEquantity(newEquantity);
  };

  const handleOptionChange = (index, selectedOptionValue) => {
    const newEquantity = [...equantity];
    const currentItem = newEquantity[index];
    currentItem.option_value.field = selectedOptionValue;
    const selectedOption = currentItem.validOptions.find(
      (option) => option.option_value.toString() === selectedOptionValue
    );
    if (selectedOption) {
      currentItem.option_type.field = selectedOption.option_type;
    } else {
      currentItem.option_type.field = '';
    }
    setEquantity(newEquantity);
  };

  const fetchInvoiceDetails = async () => {
    try {
      const response = await apiInstance.get(`/invoice/${invoiceId}/`);
      setInvoiceDetails(response.data);
    } catch (error) {
      console.error("Error fetching invoice details:", error);
    }
  };

  const validateAllFields = () => {
    // Validar businessType
    let allValid = true;
    if (validateField(businessType.field, true) === "false") {
      allValid = false;
      setBusinessType({ ...businessType, validate: "false" });
    }

    // Validar areas
    const newAreas = [...areas];
    for (let i = 0; i < newAreas.length; i++) {
      for (const field of ["name", "square_feet", "floor_type"]) {
        if (validateField(newAreas[i][field].field, true) === "false") {
          newAreas[i][field].validate = "false";
          allValid = false;
        } else {
          if (newAreas[i][field].validate !== "true") {
            newAreas[i][field].validate = "true";
          }
        }
      }
    }
    setAreas(newAreas);

    // Validar equipment
    const newEquantity = [...equantity];
    for (let i = 0; i < newEquantity.length; i++) {
      // Por simplicidad, se asume que todos son requeridos (depende de tu lógica real)
      for (const field of ["name", "quantity"]) {
        if (validateField(newEquantity[i][field].field, true) === "false") {
          newEquantity[i][field].validate = "false";
          allValid = false;
        } else {
          if (newEquantity[i][field].validate !== "true") {
            newEquantity[i][field].validate = "true";
          }
        }
      }
      // Si el equipo requiere options:
      if (newEquantity[i].validOptions.length > 0) {
        if (validateField(newEquantity[i].option_value.field, true) === "false") {
          newEquantity[i].option_value.validate = "false";
          allValid = false;
        } else {
          newEquantity[i].option_value.validate = "true";
        }
      }
    }
    setEquantity(newEquantity);

    if (!allValid) {
      setErrors({ ...errors, general: "Please complete all fields" });
    } else {
      setErrors({ ...errors, general: "" });
    }

    return allValid;
  };

  const validatePayload = (payload) => {
    const validEquantity = payload.equipment
      .map((equip) => {
        if (!equip.name) return false;
        // Check extra options if required
        if (equip.option_type || equip.option_value) {
          if (!equip.option_type || !equip.option_value) return false;
        }
        return equip;
      })
      .filter(Boolean);
    return { ...payload, equipment: validEquantity };
  };

  const calculateTotalPrice = async () => {
    if (!validateAllFields()) {
      return; // Si no todos los campos son válidos, no continuar
    }

    try {
      let payload = {
        business_type: Number(businessType.field),
        areas: areas.map((area) => ({
          name: Number(area.name.field),
          square_feet: Number(area.square_feet.field),
          floor_type: Number(area.floor_type.field),
        })),
        equipment: equantity.map((equip) => ({
          name: Number(equip.name.field),
          quantity: Number(equip.quantity.field),
          option_type: equip.option_type.field,
          option_value: equip.option_value.field ? Number(equip.option_value.field) : null,
        })),
      };

      payload = validatePayload(payload);

      const response = await apiInstance.post("invoice/", payload);
      setTotalPrice(response.data.total_price);
      setInvoiceId(response.data.id);
    } catch (error) {
      console.error("Error calculating total price:", error);
    }
  };

  // Función para renderizar ícono de validación
  const renderValidationIcon = (validateStatus) => {
    if (!validateStatus) return null;
    return (
      <FontAwesomeIcon
        icon={validateStatus === "true" ? faCheckCircle : faTimesCircle}
        className={`icon-${validateStatus}`}
      />
    );
  };


  // User info (City,Name,Business type,Email) for printable invoice : 


  
  const [isLoggedIn, user] = useAuthStore((state) => [
    state.isLoggedIn,
    state.user
    ]);
    console.log("User data:", user());
    console.log("isLoggedIn:", isLoggedIn());



    const GetUserName = (fullName) => {

      if (!fullName) return "";
      return fullName.split("")[1];



    };




  return (
    <div className="invoice-estimator">
      <div className="estimator-container">
        <h1 className="title">Invoice Estimator - RC Klean</h1>
        <div className="form-container">
          <div className="form-row">
            {/* Business Type */}
            <div className="form-section">
              <h2>Business Details</h2>
              <FontAwesomeIcon icon={faFilter} className="icons-form" />
              <div className="input-group">
                <label htmlFor="business-type">
                  Business Type <span className="text-danger">*</span>
                </label>
                <div className="input-wrapper">
                  <select
                    id="business-type"
                    value={businessType.field}
                    onChange={handleBusinessTypeChange}
                    onBlur={handleBusinessTypeValidate}
                    onKeyUp={handleBusinessTypeValidate}
                    className={`form-control ${
                      businessType.validate === "false" ? "is-invalid" : businessType.validate === "true" ? "is-valid" : ""
                    }`}
                  >
                    <option value="">Select business type</option>
                    {options.businessTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                  <div className="input-icon">
                    {renderValidationIcon(businessType.validate)}
                  </div>
                </div>
                {businessType.validate === "false" && (
                  <span className="text-danger">Please select a business type.</span>
                )}
              </div>
            </div>

            {/* Equipment */}
            <div className="form-section">
              <h2>Equipment: Quantity and Sizes</h2>
              {equantity.map((item, index) => (
                <div key={index} className="equantity-item">
                  <div className="input-group-t">
                    <label htmlFor={`equantity-name-${index}`}>
                      Equipment <span className="text-danger">*</span>
                    </label>
                    <div className="input-wrapper">
                      <select
                        id={`equantity-name-${index}`}
                        value={item.name.field}
                        onChange={(e) => handleEquantityChange(index, "name", e.target.value)}
                        onBlur={() => handleEquantityValidate(index, "name")}
                        onKeyUp={() => handleEquantityValidate(index, "name")}
                        className={`form-control ${
                          item.name.validate === "false" ? "is-invalid" : item.name.validate === "true" ? "is-valid" : ""
                        }`}
                      >
                        <option value="">Select equipment</option>
                        {options.equipmentTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                      <div className="input-icon">
                        {renderValidationIcon(item.name.validate)}
                      </div>
                    </div>
                    {item.name.validate === "false" && (
                      <span className="text-danger">Please select an equipment type.</span>
                    )}
                  </div>

                  {item.validOptions && item.validOptions.length > 0 && (
                    <div className="input-group-n">
                      <label htmlFor={`equipment-option-${index}`}>
                        Options <span className="text-danger">*</span>
                      </label>
                      <div className="input-wrapper">
                        <select
                          id={`equipment-option-${index}`}
                          value={item.option_value.field || ''}
                          onChange={(e) => {
                            handleOptionChange(index, e.target.value);
                          }}
                          onBlur={() => handleEquantityValidate(index, "option_value")}
                          onKeyUp={() => handleEquantityValidate(index, "option_value")}
                          className={`form-control ${
                            item.option_value.validate === "false" ? "is-invalid" : item.option_value.validate === "true" ? "is-valid" : ""
                          }`}
                        >
                          <option value="">Select: size / quantity</option>
                          {item.validOptions.map((option) => (
                            <option key={option.id} value={option.option_value}>
                              {option.option_type_display} - {option.option_value_display}
                            </option>
                          ))}
                        </select>
                        <div className="input-icon">
                          {renderValidationIcon(item.option_value.validate)}
                        </div>
                      </div>
                      {item.option_value.validate === "false" && (
                        <span className="text-danger">This field is required.</span>
                      )}
                    </div>
                  )}

                  <div className="input-group-n">
                    <label htmlFor={`equipment-quantity-${index}`}>
                      Quantity <span className="text-danger">*</span>
                    </label>
                    <div className="input-wrapper">
                      <input
                        id={`equipment-quantity-${index}`}
                        type="number"
                        value={item.quantity.field}
                        onChange={(e) => handleEquantityChange(index, "quantity", e.target.value)}
                        onBlur={() => handleEquantityValidate(index, "quantity")}
                        onKeyUp={() => handleEquantityValidate(index, "quantity")}
                        className={`form-control ${
                          item.quantity.validate === "false" ? "is-invalid" : item.quantity.validate === "true" ? "is-valid" : ""
                        }`}
                        placeholder="Enter quantity"
                      />
                      <div className="input-icon">
                        {renderValidationIcon(item.quantity.validate)}
                      </div>
                    </div>
                    {item.quantity.validate === "false" && (
                      <span className="text-danger">Please enter a valid quantity (min 1).</span>
                    )}
                  </div>

                  <button onClick={() => handleEquantityRemove(index)} className="remove-btn">
                    Remove
                  </button>
                  <button onClick={handleEquantityAdd} className="add-btn">
                    Add Equipment Option
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Areas */}
          <div className="form-section">
            <h2>Areas and Floor Types</h2>
            <FontAwesomeIcon icon={faBroom} className="icons-form" />
            {areas.map((area, index) => (
              <div key={index} className="area-item">
                <div className="input-group">
                  <label htmlFor={`area-name-${index}`}>
                    Area Name <span className="text-danger">*</span>
                  </label>
                  <div className="input-wrapper">
                    <select
                      id={`area-name-${index}`}
                      value={area.name.field}
                      onChange={(e) => handleAreaChange(index, "name", e.target.value)}
                      onBlur={() => handleAreaValidate(index, "name")}
                      onKeyUp={() => handleAreaValidate(index, "name")}
                      className={`form-control ${
                        area.name.validate === "false" ? "is-invalid" : area.name.validate === "true" ? "is-valid" : ""
                      }`}
                    >
                      <option value="">Select area</option>
                      {options.areaNames.map((areaOption) => (
                        <option key={areaOption.id} value={areaOption.id}>
                          {areaOption.name}
                        </option>
                      ))}
                    </select>
                    <div className="input-icon">
                      {renderValidationIcon(area.name.validate)}
                    </div>
                  </div>
                  {area.name.validate === "false" && (
                    <span className="text-danger">Please select an area.</span>
                  )}
                </div>

                <div className="input-group">
                  <label htmlFor={`area-size-${index}`}>
                    Square Feet Range <span className="text-danger">*</span>
                  </label>
                  <div className="input-wrapper">
                    <select
                      id={`area-size-${index}`}
                      value={area.square_feet.field}
                      onChange={(e) => handleAreaChange(index, "square_feet", e.target.value)}
                      onBlur={() => handleAreaValidate(index, "square_feet")}
                      onKeyUp={() => handleAreaValidate(index, "square_feet")}
                      className={`form-control ${
                        area.square_feet.validate === "false" ? "is-invalid" : area.square_feet.validate === "true" ? "is-valid" : ""
                      }`}
                    >
                      <option value="">Select size</option>
                      {SquareFeetOptions.map((sizeOption) => (
                        <option key={sizeOption.value} value={sizeOption.value}>
                          {sizeOption.label}
                        </option>
                      ))}
                    </select>
                    <div className="input-icon">
                      {renderValidationIcon(area.square_feet.validate)}
                    </div>
                  </div>
                  {area.square_feet.validate === "false" && (
                    <span className="text-danger">Please select a size range.</span>
                  )}
                </div>

                <div className="input-group">
                  <label htmlFor={`floor-type-${index}`}>
                    Floor Type <span className="text-danger">*</span>
                  </label>
                  <div className="input-wrapper">
                    <select
                      id={`floor-type-${index}`}
                      value={area.floor_type.field}
                      onChange={(e) => handleAreaChange(index, "floor_type", e.target.value)}
                      onBlur={() => handleAreaValidate(index, "floor_type")}
                      onKeyUp={() => handleAreaValidate(index, "floor_type")}
                      className={`form-control ${
                        area.floor_type.validate === "false" ? "is-invalid" : area.floor_type.validate === "true" ? "is-valid" : ""
                      }`}
                    >
                      <option value="">Select floor type</option>
                      {options.floorNames.map((floor) => (
                        <option key={floor.id} value={floor.id}>
                          {floor.name}
                        </option>
                      ))}
                    </select>
                    <div className="input-icon">
                      {renderValidationIcon(area.floor_type.validate)}
                    </div>
                  </div>
                  {area.floor_type.validate === "false" && (
                    <span className="text-danger">Please select a floor type.</span>
                  )}
                </div>

                <button
                  onClick={() => handleRemoveArea(index)}
                  className="remove-btn"
                >
                  Remove Area
                </button>
              </div>
            ))}
            <button onClick={handleAddArea} className="add-btn">Add Area</button>
          </div>

          {errors.general && <p className="error">{errors.general}</p>}

          <div className="form-section">
            <button onClick={calculateTotalPrice} className="calculate-btn">
              Calculate Estimate
            </button>

            {totalPrice > 0 && (
              <>
                <div className="total-price">
                  <h2>The estimated price is between: ${((totalPrice * 0.80).toFixed(2))}
                    and ${((totalPrice * 1.20).toFixed(2))} </h2>
                </div>

                <button onClick={fetchInvoiceDetails} className="details-btn">
                  View your Invoice Details
                </button>



                {invoiceDetails && (

                <div>

                  {isLoggedIn() ? (
                    <>
                    <li className="user-greeting">Name: {GetUserName(user().full_name)}</li>
                    <li className="user-greeting">Email: {GetUserName(user().email)}</li>
                    <li className="user-greeting">City: {GetUserName(user().city)}</li>
                    <li className="user-greeting">Business Type: {GetUserName(user().business_type)}</li> 

                    </>
                  ) : 
                  
                  ( 
                    <>
                    <li className="user-greeting">Hi Anonymous user, download your ivoice details here: </li>
                    
                    </>

                  )}



                  <div className="invoice-details">
                    <h3>Invoice Details</h3>
                    <p>Business Type: {invoiceDetails.business_type.name}</p>
                    <p>Estimated price: ${invoiceDetails.total_price}</p>
                    <h4>Areas:</h4>
                    {invoiceDetails.areas.map((area, index) => (
                      <p key={index}>
                        {area.name.name} - {area.square_feet} sq ft
                      </p>
                    ))}
                    <h4>Equipment:</h4>
                    {invoiceDetails.equipment.map((equip, index) => (
                      <p key={index}>
                        {equip.name.name} - Quantity: {equip.quantity}
                      </p>
                    ))}
                  </div>
                  </div>
                )}
              </>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}