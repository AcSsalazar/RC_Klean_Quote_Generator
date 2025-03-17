/* eslint-disable no-unused-vars */
import React from 'react';
import { USAMap } from '@mirawision/usa-map-react';
import styled from 'styled-components'; // Make sure to install styled-components
import '../styles/CustomMap.css';

const CoverageMap = () => {
  return (
    <div className="map-container">
      
      <div className="map-legend">
        
        <div className="legend-item">
          <div className="color-box coverage"></div>
          <span>Service Coverage Area</span>
        </div>
        <div className="legend-item">
          <div className="color-box default"></div>
          <span>No Coverage</span>
        </div>
      </div>
      <StyledUSAMap />

    </div>
  );
};

// Styled component for the map
const StyledUSAMap = styled(USAMap)`
  .usa-map {
    border-radius: 20px;
    max-width: 50%;
    margin: 0 auto;
    background-color: #2f274d33;
    box-shadow: 1px 0px 20px -3px rgba(46, 77, 45, 0.81);
  }

  .usa-state {
    fill: #f8fffc;
    stroke: #172352b0;
    stroke-width: 1px;
    transition: all 0.3s ease;
  }

  .usa-state:hover {
    fill: #c6dbee;
    stroke-width: 2px;
    cursor: pointer;
    position: relative;

    /* Tooltip effect */
    &:after {
      content: attr(data-tooltip);
      position: absolute;
      top: -40px;
      left: 50%;
      transform: translateX(-50%);
      background-color: white;
      color: #172352;
      padding: 5px 10px;
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      white-space: nowrap;
      z-index: 1000;
      pointer-events: none;
    }
  }

  .usa-state.ny,
  .usa-state.ca,
  .usa-state.fl {
    fill: rgba(38, 16, 88, 0.774);
    stroke: rgb(24, 158, 113);
    stroke-width: 2px;
    
  }

  .usa-state.ny:hover,
  .usa-state.ca:hover,
  .usa-state.fl:hover {
    fill: #172352;
  }

  /* Add data-tooltip attribute to coverage states */
  .usa-state.ny,
  .usa-state.ca,
  .usa-state.fl {

    &[data-tooltip="We work here!"] {
      
      /* background-image: url('../public/img/foot-logo_1.png'); */
      /* background-size: 20px 20px; */
      /* background-repeat: no-repeat; */
      /* background-position: center; */
    }
  }
`;

export default CoverageMap;