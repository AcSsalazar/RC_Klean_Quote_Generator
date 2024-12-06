/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useAuthStore } from "../src/RCA/auth"; // For userdata
import apiInstance from "../src/utils/axios";  // Importación actualizada
import "../styles/InvoiceCalculator.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFireBurner, faBroom, faKitchenSet, faFilter, faTableCells } from '@fortawesome/free-solid-svg-icons';
import { useParams } from "react-router-dom";



export default function InvoiceEstimator() {
  
  const param = useParams("");
  //const [userInfo, setUserInfo] = useState([{name:"", business_type:"", city: ""}]);
  const [businessType, setBusinessType] = useState("");
  const [equantity, setEquantity] = useState([{ name: "", option_type: "", option_value: "", quantity: 0, validOptions: [] },]);
  const [areas, setAreas] = useState([{ name: "", square_feet: "", floor_type: "" }]);
  const [equipment, setEquipment] = useState([{ name: "", quantity: 0 }]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [floors, setFloors] = useState([{ name: ""}]);
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
    businessType: "",
    areas: [],
    equipment: [],
  });



// User log state
    const [isLoggedIn, user] = useAuthStore((state) => [
      state.isLoggedIn,
      state.user
    ]);
    
// Permitir que value y type options no esten presentes: 
    const validatePayload = (payload) => {
      const validEquantity = payload.equipment.map((equip) => {
        if (!equip.name) {
          console.error("Invalid equipment: name is required", equip);
          return false; // Exclude incomplete equipment
        }
    
        // Check for extra options only if required
        if (equip.option_type || equip.option_value) {
          if (!equip.option_type || !equip.option_value) {
            console.error(
              `Invalid extra options for equipment ${equip.name}:`,
              equip
            );
            return false; // Exclude equipment with invalid extra options
          }
        }
    
        return equip; // Valid equipment
      }).filter(Boolean); // Exclude invalid entries
    
      return { ...payload, equipment: validEquantity };
    };
    
/*   Cuadrar esta monda en diciembre xd  useEffect(() => {
      const UserData = async () => {
        try {
          const response = await apiInstance.get(`profile/${param.slug}/`); 
          setOptions({
            name: response.data.name,
            business_type: response.data.business_type,
            city: response.data.city,

  
          });
        } catch (error) {
          console.error("Error fetching userdata: ", error);
        }
      };

      UserData();
      console.log("user data is:", UserData)
    }, []);
 */





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
//Areas setiitngs options:

const SquareFeetOptions = [

  { value: 499, label: "0-500" },
  { value: 999, label: "500-1000" },
  { value: 1500, label: "More than 1000" },

]



;
  const handleAddArea = () => {
    setAreas([...areas, { name: "", square_feet: "", floor_type: "" }])
  };

  const handleRemoveArea = (index) => {
    const newAreas = [...areas];
    newAreas.splice(index, 1);
    setAreas(newAreas);
  };

  const handleAreaChange = (index, field, value) => {
    const newAreas = [...areas ];
    newAreas[index][field] = value; // Actualiza el campo correspondiente (name, square_feet o floor_type)
    setAreas(newAreas);
  };


//Floor types handle funtions: 

const handleAddFloor = () => {
  setFloors([...floors, { name: ""}]);
};

const handleRemoveFloor = (index) => {
  const newFloor = [...floors];
  newFloor.splice(index, 1);
  setFloors(newFloor);
};

const handleChangeFloor = (index, field, value) => {
  const newFloor = [...floors];
  newFloor[index][field] = value;
  setFloors(newFloor);
};


// Equantity handle funtions:



const handleEquantityAdd = () => {
  setEquantity([
    ...equantity,
    { name: "", option_type: "", option_value: "", quantity: 0, validOptions: [] },
  ]);
};

const handleEquantityRemove = (index) => {
  const newEquantity = [...equantity];
  newEquantity.splice(index, 1);
  setEquantity(newEquantity);
};

const handleEquantityChange = (index, field, value) => {
  const newEquantity = [...equantity];

  if (field === "name") {
    // Update the equipment selected
    newEquantity[index][field] = value;

    // Check if this equipment has extra options
    const validOptions = options.bus_qty.filter(
      (option) => option.equipment_type === Number(value)
    );

    newEquantity[index].validOptions = validOptions;

    // Reset extra option fields if the equipment has no valid options
    if (validOptions.length === 0) {
      newEquantity[index].option_type = "";
      newEquantity[index].option_value = "";
    }
  } else {
    newEquantity[index][field] = value;
  }

  setEquantity(newEquantity);
};







// Handle equipements funtions:
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

  const fetchInvoiceDetails = async () => {
    try {
      const response = await apiInstance.get(`/invoice/${invoiceId}/`);
      setInvoiceDetails(response.data);
    } catch (error) {
      console.error("Error fetching invoice details:", error);
    }
  };


  const handleOptionChange = (index, selectedOptionValue) => {
    const newEquantity = [...equantity];
    const currentItem = { ...newEquantity[index] };
  
    // Actualiza option_value
    currentItem.option_value = selectedOptionValue;
  
    // Encuentra la opción seleccionada para obtener option_type
    const selectedOption = currentItem.validOptions.find(
      (option) => option.option_value.toString() === selectedOptionValue
    );
  
    if (selectedOption) {
      // Actualiza option_type
      currentItem.option_type = selectedOption.option_type;
    } else {
      currentItem.option_type = '';
    }
  
    newEquantity[index] = currentItem;
    setEquantity(newEquantity);
  };
  
  




  const calculateTotalPrice = async () => {




    try {

      let payload = {
        business_type: Number(businessType), // Convertir a número
        areas: areas.map((area) => ({
          name: Number(area.name), // Convertir a número
          square_feet: Number(area.square_feet), // Convertir a número
          floor_type: Number(area.floor_type), // Convertir a número
        })),
        equipment: equantity.map((equip) => ({
          name: Number(equip.name), // Convertir a número
          quantity: Number(equip.quantity), // Convertir a número
          option_type: equip.option_type,
          option_value: Number( equip.option_value), // Mantener como string si el backend lo espera así
        })),
      };

      payload = validatePayload(payload);

      console.log("Validated Payload sent to backend:", payload);

  
      const response = await apiInstance.post("invoice/", payload);
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
          <div className="form-row">


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
                {errors.businessType && <span className="error">{errors.businessType}</span>}
              </div>
            </div>


{/* Equipment: qty and sizes */}
          
   <div className="form-section">
  <h2>Equipment: Quantity and Sizes</h2>
  {equantity.map((item, index) => (
    <div key={index} className="equantity-item">
      {/* Seleccionar Equipo */}
      <div className="input-group-t">
        <label htmlFor={`equantity-name-${index}`}>Equipment</label>
        <select
          id={`equantity-name-${index}`}
          value={item.name}
          onChange={(e) => handleEquantityChange(index, "name", e.target.value)}
        >
          <option value="">Select equipment</option>
          {options.equipmentTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>            
   

      {/* Mostrar Opciones Solo si Hay un Equipo Seleccionado */}
      {item.validOptions && item.validOptions.length > 0 && (
        <div className="input-group-n">
          <label htmlFor={`equipment-option-${index}`}>Options</label>
          <select
            id={`equipment-option-${index}`}
            value={item.option_value || ''}
            onChange={(e) => handleOptionChange(index, e.target.value)}
          >
            <option value="">Select: size / quantity</option>
            {item.validOptions.map((option) => (
              <option key={option.id} value={option.option_value}>
                {option.option_type_display} - {option.option_value_display}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Cantidad */}
      <div className="input-group-n">
        <label htmlFor={`equipment-quantity-${index}`}>Quantity</label>
        <input
          id={`equipment-quantity-${index}`}
          type="number"
          value={item.quantity}
          onChange={(e) => handleEquantityChange(index, "quantity", e.target.value)}
          placeholder="Enter quantity"
        />
      </div>

      {/* Botón de Eliminar */}
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


{/* Selector de área iportante */}

<div className="form-section">

  <h2>Areas and Floor Types</h2>
  <FontAwesomeIcon icon={faBroom} className="icons-form" />
  {areas.map((area, index) => (
    <div key={index} className="area-item">
      {/* Selector de área */}
      <div className="input-group">
        <label htmlFor={`area-name-${index}`}>Area Name</label>
        <select
          id={`area-name-${index}`}
          value={area.name}
          onChange={(e) => handleAreaChange(index, "name", e.target.value)}
        >
          <option value="">Select area</option>
          {options.areaNames.map((areaOption) => (
            <option key={areaOption.id} value={areaOption.id}>
              {areaOption.name}
            </option>
          ))}
        </select>
      </div>

      {/* Selector de tamaño */}
      <div className="input-group">
        <label htmlFor={`area-size-${index}`}>Square Feet Range</label>
        <select
          id={`area-size-${index}`}
          value={area.square_feet}
          onChange={(e) => handleAreaChange(index, "square_feet", e.target.value)}
        >
          <option value="">Select size</option>
          {SquareFeetOptions.map((sizeOption) => (
            <option key={sizeOption.value} value={sizeOption.value}>
              {sizeOption.label}
            </option>
          ))}
        </select>
      </div>

      {/* Selector de tipo de piso */}
      <div className="input-group">
        <label htmlFor={`floor-type-${index}`}>Floor Type</label>
        <select
          id={`floor-type-${index}`}
          value={area.floor_type}
          onChange={(e) => handleAreaChange(index, "floor_type", e.target.value)}
        >
          <option value="">Select floor type</option>
          {options.floorNames.map((floor) => (
            <option key={floor.id} value={floor.id}>
              {floor.name}
            </option>
          ))}
        </select>
      </div>

      {/* Botón para eliminar área */}
      <button
        onClick={() => handleRemoveArea(index)}
        className="remove-btn"
      >
        Remove Area
      </button>
    </div>
  ))}
  {/* Botón para añadir área */}
  <button onClick={handleAddArea} className="add-btn">
    Add Area
  </button>
</div>



            <div className="form-section">
              <button onClick={calculateTotalPrice} className="calculate-btn">
                Calculate Estimate
              </button>

              {totalPrice > 0 && (
                <>
                  <div className="total-price">
                    <h2>The estimated price is betwen: ${((totalPrice * 0.80).toFixed(2)) }
                          and ${((totalPrice * 1.20).toFixed(2)) } </h2>

                  </div>

                  <button onClick={fetchInvoiceDetails} className="details-btn">
                    View your Invoice Details
                  </button>

                  {invoiceDetails && (
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
                  )}
                </>
              )}
            </div>
          </div>

      </div>
    </div>
  );
}