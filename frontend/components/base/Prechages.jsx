import React, { useState, useEffect } from "react";
import { useAuthStore } from "../src/RCA/auth";
import apiInstance from "../src/utils/axios";
import "../styles/InvoiceCalculator.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { IconBuildingCog, IconMicrowave, IconStackForward } from '@tabler/icons-react';

export default function InvoiceEstimator() {
  const [step, setStep] = useState(1); // 1: Business Type, 2: Equipment/Areas, 3: Result
  const [businessType, setBusinessType] = useState({ field: "", validate: null });
  const [areas, setAreas] = useState([{ name: { field: "", validate: null }, square_feet: { field: "", validate: null }, floor_type: { field: "", validate: null } }]);
  const [equantity, setEquantity] = useState([{ name: { field: "", validate: null }, option_type: { field: "", validate: null }, option_value: { field: "", validate: null }, quantity: { field: 0, validate: null }, validOptions: [] }]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [options, setOptions] = useState({ businessTypes: [], equipmentTypes: [], areaNames: [], floorNames: [], bus_qty: [] });

  useEffect(() => {
    const fetchOptions = async () => {
      const response = await apiInstance.get("options/");
      setOptions({
        businessTypes: response.data.business_types || [],
        equipmentTypes: response.data.equipment_types || [],
        areaNames: response.data.area_names || [],
        floorNames: response.data.floor_types || [],
        bus_qty: response.data.bus_qty || [],
      });
    };
    fetchOptions();
  }, []);

  const validateField = (value, required = true) => {
    return required && (!value || value.toString().trim() === "") ? "false" : "true";
  };

  const handleNext = () => {
    if (step === 1 && validateField(businessType.field) === "true") {
      setBusinessType({ ...businessType, validate: "true" });
      const selectedBusiness = options.businessTypes.find(type => type.id === Number(businessType.field));
      if (selectedBusiness?.name.toLowerCase() === "restaurants") {
        setStep(2); // Go to Equipment
      } else {
        setStep(3); // Go to Areas
      }
    } else {
      setBusinessType({ ...businessType, validate: "false" });
    }
  };

  const calculateTotalPrice = async () => {
    if (!validateAllFields()) return;
    setIsCalculating(true);
    setTimeout(async () => {
      const payload = {
        business_type: Number(businessType.field),
        areas: step === 3 ? areas.map(area => ({
          name: Number(area.name.field),
          square_feet: Number(area.square_feet.field),
          floor_type: Number(area.floor_type.field),
        })) : [],
        equipment: step === 2 ? equantity.map(equip => ({
          name: Number(equip.name.field),
          quantity: Number(equip.quantity.field),
          option_type: equip.option_type.field,
          option_value: equip.option_value.field ? Number(equip.option_value.field) : null,
        })) : [],
      };
      const response = await apiInstance.post("invoice/", payload);
      setTotalPrice(response.data.total_price);
      setIsCalculating(false);
      setStep(4); // Show result
    }, 5000); // 5-second delay
  };

  const renderValidationIcon = (validateStatus) => {
    if (!validateStatus) return null;
    return <FontAwesomeIcon icon={validateStatus === "true" ? faCheckCircle : faTimesCircle} className={`icon-${validateStatus}`} />;
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="card">
            <h2>Business Type</h2>
            <IconBuildingCog stroke={1.75} />
            <select value={businessType.field} onChange={e => setBusinessType({ ...businessType, field: e.target.value })} className={`form-control ${businessType.validate === "false" ? "is-invalid" : ""}`}>
              <option value="">Select business type</option>
              {options.businessTypes.map(type => <option key={type.id} value={type.id}>{type.name}</option>)}
            </select>
            {businessType.validate === "false" && <span className="text-danger">Please select a business type.</span>}
            <button onClick={handleNext} className="next-btn">Next</button>
          </div>
        );
      case 2:
        return (
          <div className="card">
            <h2>Equipment</h2>
            <IconMicrowave stroke={1.75} />
            {/* Render Equipment Inputs Here (similar to original) */}
            <button onClick={calculateTotalPrice} className="calculate-btn">Finish & Calculate</button>
          </div>
        );
      case 3:
        return (
          <div className="card">
            <h2>Areas</h2>
            <IconStackForward />
            {/* Render Areas Inputs Here (similar to original) */}
            <button onClick={calculateTotalPrice} className="calculate-btn">Calculate</button>
          </div>
        );
      case 4:
        return (
          <div className="card">
            <h2>Result</h2>
            <p>Estimated Price: ${totalPrice * 0.80} - ${totalPrice * 1.20}</p>
            {/* Add Download Button Here */}
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
          <img src="/path/to/loading.gif" alt="Calculating..." />
          <p>Calculating Price...</p>
        </div>
      )}
      {renderStep()}
    </div>
  );
}