/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import apiInstance from "../src/utils/axios";  // Importación actualizada
import "../styles/InvoiceCalculator.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFireBurner, faBroom, faKitchenSet, faFilter } from '@fortawesome/free-solid-svg-icons';

export default function InvoiceEstimator() {
  const [businessType, setBusinessType] = useState("");
  const [areas, setAreas] = useState([{ name: "", square_feet: 0 }]);
  const [equipment, setEquipment] = useState([{ name: "", quantity: 0 }]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [invoiceId, setInvoiceId] = useState(null);
  const [options, setOptions] = useState({
    businessTypes: [],
    equipmentTypes: [],
    areaNames: [],
  });

  // Fetch options for dropdowns on component mount
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await apiInstance.get("options/");  // Usando apiInstance
        setOptions({
          businessTypes: response.data.business_types || [],
          equipmentTypes: response.data.equipment_types || [],
          areaNames: response.data.area_names || [],
        });
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  const handleAddArea = () => {
    setAreas([...areas, { name: "", square_feet: 0 }]);
  };

  const handleRemoveArea = (index) => {
    const newAreas = [...areas];
    newAreas.splice(index, 1);
    setAreas(newAreas);
  };

  const handleAreaChange = (index, field, value) => {
    const newAreas = [...areas];
    newAreas[index][field] = field === "square_feet" ? Number(value) : value;
    setAreas(newAreas);
  };

  const handleAddEquipment = () => {
    setEquipment([...equipment, { name: "", quantity: 0 }]);
  };

  const handleRemoveEquipment = (index) => {
    const newEquipment = [...equipment];
    newEquipment.splice(index, 1);
    setEquipment(newEquipment);
  };

  const handleEquipmentChange = (index, field, value) => {
    const newEquipment = [...equipment];
    newEquipment[index][field] = field === "quantity" ? Number(value) : value;
    setEquipment(newEquipment);
  };

  // Function to get invoice details after calculation
  const fetchInvoiceDetails = async () => {
    try {
      const response = await apiInstance.get(`/invoice/${invoiceId}/`);  // Usando apiInstance
      setInvoiceDetails(response.data);
    } catch (error) {
      console.error("Error fetching invoice details:", error);
    }
  };

  const calculateTotalPrice = async () => {
    try {
      const response = await apiInstance.post("invoice/", {  // Usando apiInstance
        business_type: businessType,
        areas: areas.map((area) => ({
          name: area.name,
          square_feet: area.square_feet,
        })),
        equipment: equipment.map((equip) => ({
          name: equip.name,
          quantity: equip.quantity,
        })),
      });
      setTotalPrice(response.data.total_price);
      setInvoiceId(response.data.id);
    } catch (error) {
      console.error("Error calculating total price:", error);
    }
  };

  return (
    <div className="invoice-estimator">
      <div className="estimator-container">
        <h1 className="title">Invoice Estimator - RC Klean</h1>
        <div className="form-container">
          <div className="form-section">
            <h2>Business Details</h2>
            <FontAwesomeIcon icon={faFilter} className="icons-form" />
            <div className="input-group">
              <label htmlFor="business-type">Business Type</label>
              <select
                id="business-type"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
              >
                <option value="">Select business type</option>
                {options.businessTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-section">
            <h2>Areas</h2>
            <FontAwesomeIcon icon={faBroom} className="icons-form" />
            {areas.map((area, index) => (
              <div key={index} className="area-item">
                <div className="input-group">
                  <label htmlFor={`area-name-${index}`}>Area Name</label>
                  <select
                    id={`area-name-${index}`}
                    value={area.name}
                    onChange={(e) =>
                      handleAreaChange(index, "name", e.target.value)
                    }
                  >
                    <option value="">Select area</option>
                    {options.areaNames.map((name) => (
                      <option key={name.id} value={name.id}>
                        {name.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label htmlFor={`area-size-${index}`}>Square Feet</label>
                  <input
                    id={`area-size-${index}`}
                    type="number"
                    value={area.square_feet}
                    onChange={(e) =>
                      handleAreaChange(index, "square_feet", e.target.value)
                    }
                    placeholder="Enter size"
                  />
                </div>
                <button
                  onClick={() => handleRemoveArea(index)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            ))}
            <button onClick={handleAddArea} className="add-btn">
              Add Area
            </button>
          </div>

          <div className="form-section">
            <h2>Kitchen Equipment</h2>
            <FontAwesomeIcon icon={faKitchenSet} className="icons-form"/>
            {equipment.map((item, index) => (
              <div key={index} className="equipment-item">
                <div className="input-group">
                  <label htmlFor={`equipment-name-${index}`}>Equipment</label>
                  <select
                    id={`equipment-name-${index}`}
                    value={item.name}
                    onChange={(e) =>
                      handleEquipmentChange(index, "name", e.target.value)
                    }
                  >
                    <option value="">Select equipment</option>
                    {options.equipmentTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label htmlFor={`equipment-quantity-${index}`}>
                    Quantity
                  </label>
                  <input
                    id={`equipment-quantity-${index}`}
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleEquipmentChange(index, "quantity", e.target.value)
                    }
                    placeholder="Enter quantity"
                  />
                </div>
                <button
                  onClick={() => handleRemoveEquipment(index)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            ))}
            <button onClick={handleAddEquipment} className="add-btn">
              Add Equipment
            </button>
          </div>
        </div>

        <button onClick={calculateTotalPrice} className="calculate-btn">
          Calculate Estimate
        </button>

        {totalPrice > 0 && (
          <>
            <div className="total-price">
              <h2>Estimated Total</h2>
              <p>${totalPrice.toFixed(2)}</p>
            </div>

            <button onClick={fetchInvoiceDetails} className="details-btn">
              View Invoice Details
            </button>

            {invoiceDetails && (
              <div className="invoice-details">
                <h3>Invoice Details</h3>
                <p>Business Type: {invoiceDetails.business_type.name}</p>
                <p>Total Price: ${invoiceDetails.total_price}</p>
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
            )}
          </>
        )}
      </div>
    </div>
  );
}
