// src/components/InvoiceResults.jsx
import { useRef } from "react"; // Keep only if needed elsewhere; otherwise, remove
import { useAuthStore } from "../src/RCA/auth";
import html2pdf from "html2pdf.js";
import apiInstance from "../src/utils/axios";
import "../styles/Results.css";
import PropTypes from "prop-types"; // Import PropTypes
import { Link } from "react-router-dom";
import logo from "../public/img/foot-logo_1.png";
import logo2 from "../public/img/wirk-logo.png";


const InvoiceResults = ({ result, options, SquareFeetOptions }) => {
  const { totalPrice, invoiceId, payload } = result;
  const [isLoggedIn, user] = useAuthStore((state) => [state.isLoggedIn, state.user]);
  const invoiceRef = useRef(null);

  const downloadPDF = () => {
    const element = invoiceRef.current;
    const opt = {
      margin: 0.5,
      filename: `invoice_${invoiceId}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf()
      .from(element)
      .set(opt)
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        const blob = pdf.output("blob");
        savePDFToServer(blob);
        downloadBlob(blob);
      });
  };

  const savePDFToServer = (blob) => {
    const formData = new FormData();
    formData.append("pdf", blob, `invoice_${invoiceId}.pdf`);

    apiInstance
      .post(`/invoice/${invoiceId}/save-pdf/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        console.log("PDF saved:", response.data.file_url);
      })
      .catch((error) => {
        console.error("Error saving PDF:", error);
      });
  };

  const downloadBlob = (blob) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `invoice_${invoiceId}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const businessTypeName = options.businessTypes.find((type) => type.id === Number(payload.business_type))?.name || "Unknown";

  return (
    <div className="card">
      <h2 className="main-title">Summary</h2>
      <p className="estimated-title">The estimated price is between: ${((totalPrice * 0.80).toFixed(2))} and ${((totalPrice * 1.20).toFixed(2))}</p>
      <div ref={invoiceRef} className="invoice-preview">
        <div className="invoice-header">
          <h1>Service Quote Details:</h1>
          <div className="invoice-details">
            <p>Invoice No: {invoiceId}</p>
            <p>Issued to: {isLoggedIn() ? user().full_name : "Anonymous User"}</p>
            <p>Due Date: {new Date().toISOString().split("T")[0]}</p>
          </div>
          <img src={logo} alt="Company Logo" style={{ height: '100px', marginRight: '1px' }} />
          <Link to="https://rcklean.com/"></Link>
        </div>
        <table className="invoice-table">
          <thead>
            <tr>
              <th>DESCRIPTION</th>
              <th>QTY</th>
              <th>PRICE</th>
              <th>SUBTOTAL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{businessTypeName}</td>
              <td>1</td>
              <td>${totalPrice}</td>
              <td>${totalPrice}</td>
            </tr>
            {payload.equipment.length > 0 &&
              payload.equipment.map((item, index) => {
                const equipName = options.equipmentTypes.find((type) => type.id === Number(item.name))?.name || "Unknown";
                const option = options.bus_qty.find(
                  (opt) => opt.equipment_type === Number(item.name) && opt.option_value === Number(item.option_value)
                );
                const desc = `${equipName}${option ? ` - ${option.option_type_display} ${option.option_value_display}` : ""}`;
                const price = totalPrice / payload.equipment.reduce((sum, e) => sum + e.quantity, 0);
                return (
                  <tr key={index}>
                    <td>{desc}</td>
                    <td>{item.quantity}</td>
                    <td>${price.toFixed(2)}</td>
                    <td>${(price * item.quantity).toFixed(2)}</td>
                  </tr>
                );
              })}
            {payload.areas.length > 0 &&
              payload.areas.map((area, index) => {
                const areaName = options.areaNames.find((a) => a.id === Number(area.name))?.name || "Unknown";
                const floorName = options.floorNames.find((f) => f.id === Number(area.floor_type))?.name || "";
                const price = totalPrice / payload.areas.length;
                return (
                  <tr key={index}>
                    <td>{`${areaName} (${SquareFeetOptions.find((s) => s.value === Number(area.square_feet))?.label || ""} sq ft) - ${floorName}`}</td>
                    <td>1</td>
                    <td>${price.toFixed(2)}</td>
                    <td>${price.toFixed(2)}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        <div className="invoice-footer">
          <p>Disclaimer ⚠️:</p>
          <p>Prices shown here are subject to change and are primarily a guide to our standard pricing, for a personalized and accurate quote please contact us through our direct channels:</p>
          <p className="invoice-footer-info">Email: example@hotmail.com</p>
          <p className="invoice-footer-info">Phone: 3333333333</p>
        </div>
        <div className="invoice-footer-credits">
          <p>Thank you for choosing RCKLEAN!</p>
          <p>
           <img src={logo2} alt="Company Logo" style={{ height: '40px', marginRight: '8px' }} />
           <Link to="https://wirkconsulting.com/" >Power by Wirk Consulting</Link>
           </p>
        </div>
      </div>
      <button onClick={downloadPDF} className="download-btn">
        Download & Save PDF
      </button>
    </div>
  );
};

// Define PropTypes
InvoiceResults.propTypes = {
  result: PropTypes.shape({
    totalPrice: PropTypes.number.isRequired,
    invoiceId: PropTypes.number.isRequired,
    payload: PropTypes.shape({
      business_type: PropTypes.number.isRequired,
      equipment: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.number.isRequired,
          quantity: PropTypes.number.isRequired,
          option_type: PropTypes.string,
          option_value: PropTypes.number,
        })
      ),
      areas: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.number.isRequired,
          square_feet: PropTypes.number.isRequired,
          floor_type: PropTypes.number.isRequired,
        })
      ),
    }).isRequired,
  }).isRequired,
  options: PropTypes.shape({
    businessTypes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
    equipmentTypes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
    areaNames: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
    floorNames: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
    bus_qty: PropTypes.arrayOf(
      PropTypes.shape({
        equipment_type: PropTypes.number.isRequired,
        option_type: PropTypes.string.isRequired,
        option_value: PropTypes.number.isRequired,
        option_type_display: PropTypes.string.isRequired,
        option_value_display: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  SquareFeetOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default InvoiceResults;