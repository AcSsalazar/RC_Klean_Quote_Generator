import React, { useRef, useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import apiInstance from "../src/utils/axios";
import "../styles/ResultPublic.css";
import { Link, useParams } from "react-router-dom";
import logo from "../public/img/foot-logo_1.png";


const QuoteResult = () => {
  const { quoteId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [options, setOptions] = useState({
    equipmentTypes: [],
    bus_qty: [],
    areaNames: [],
    floorNames: [],
  });
  const [error, setError] = useState("");
  const invoiceRef = useRef(null);

  const SquareFeetOptions = [
    { value: 499, label: "0-500" },
    { value: 999, label: "500-1000" },
    { value: 1500, label: "More than 1000" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invoiceRes, optionsRes] = await Promise.all([
          apiInstance.get(`/invoice/${quoteId}/`),
          apiInstance.get("/options/"),
        ]);
        setInvoice(invoiceRes.data);
        setOptions({
          equipmentTypes: optionsRes.data.equipment_types || [],
          bus_qty: optionsRes.data.bus_qty || [],
          areaNames: optionsRes.data.area_names || [],
          floorNames: optionsRes.data.floor_types || [],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load quote or options.");
      }
    };
    if (quoteId) fetchData();
  }, [quoteId]);

  const downloadPDF = () => {
    const element = invoiceRef.current;
    const opt = {
      margin: 0.5,
      filename: `invoice_${quoteId}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().from(element).set(opt).save();
  };

  if (error) return <div>{error}</div>;
  if (!invoice || !options.equipmentTypes.length) return <div>Loading...</div>;

  const { total_price, full_name, email, city, areas, equipment, business_type } = invoice;

  return (
    <div className="card">
      <h2 className="main-title">Estimate</h2>
      <div ref={invoiceRef} className="invoice-preview">
        <div className="invoice-header">
          <h1>Service Quote Details:</h1>
        </div>
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {equipment && equipment.length > 0 && equipment.map((item, index) => {
              const equipName = options.equipmentTypes.find(type => type.id === item.name)?.name || item.name;
              const option = options.bus_qty.find(opt => 
                opt.equipment_type === item.name && 
                opt.option_value === item.option_value
              );
              const desc = option 
                ? `${equipName} - ${option.option_type_display} ${option.option_value_display}`
                : equipName;
              return (
                <tr key={`equip-${index}`}>
                  <td>{desc}</td>
                  <td>{item.quantity}</td>
                </tr>
              );
            })}
            {areas && areas.length > 0 && areas.map((area, index) => (
              <tr key={`area-${index}`}>
                <td>
                  {`${options.areaNames.find(a => a.id === area.name)?.name || area.name} (${
                    SquareFeetOptions.find(s => s.value === area.square_feet)?.label || area.square_feet
                  } sq ft) - ${options.floorNames.find(f => f.id === area.floor_type)?.name || area.floor_type}`}
                </td>
                <td>1</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="estimated-title">
          Estimated total: <span style={{ paddingLeft: "20px" }} />
          ${(total_price * 0.8).toFixed(2)} to ${(total_price * 1.2).toFixed(2)}
        </p>
        <div className="invoice-details">
          <b><p> Quote ID: {quoteId} </p> </b>
          <p>Business Type: {business_type}</p>
          <p>Issued to: {full_name}</p>
          <p>Email: {email}</p>
          <p>City: {city}</p>
          <p>Due Date: {new Date().toISOString().split("T")[0].split("-").reverse().join("/")}</p>
          <span></span>
        </div>
        <div className="invoice-footer">
          <p style={{ fontWeight: "500" }}>Terms and Conditions:</p>
          <p style={{fontSize: '12px', textAlign: 'justify'}}>Will provide cleaning solutions, equipment, and materials to perform cleaning service.
RC Klean shall perform the Services in a professional and workman-like manner in accordance with generally recognized industry standards for similar services and
will exercise reasonable care and diligence in performing its duties. RC Klean hereby agrees to indemnify, hold harmless, and at customer request, defend and its
affiliates, successors and assigns, and its and their officers, directors, employees, agents, successors and assigns, from and against any damages, liabilities,
deficiencies, actions, judgments, interest, awards penalties, fines, losses costs or expenses of whatever kind of nature (including, but not limited to, attorneys fees and
other defense costs) which are caused by the actions of RC Klean or any of its employees, agents, subcontractors or representatives
          </p>
          <p className="invoice-footer-info">rcklean@rcklean.com</p>
          <p className="invoice-footer-info">212-878-7611</p>
        </div>
        <div className="invoice-footer-credits">
          <div>
            <Link to="https://rcklean.com/">
              <img src={logo} alt="Company Logo" className="logo-rck" />
            </Link>
            <p className="slogan-bottom">
              Restaurant Cleaning / Ceiling Commercial Cleaning
              <br />
              &#34;Floors to Ceiling We Got You Covered&#34;
            </p>
          </div>

        </div>
      </div>
      <button onClick={downloadPDF} className="download-btn">Download PDF</button>
    </div>
  );
};

export default QuoteResult;