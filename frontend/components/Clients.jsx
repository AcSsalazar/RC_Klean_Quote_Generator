import React from "react";
import "../styles/Clients.css";

const clientLogos = [
  { src: "/client-logos/54_below.png", alt: "54 Below" },
  { src: "/client-logos/ARTHOUSE_HOTEL.png", alt: "Arthouse Hotel" },
  { src: "/client-logos/BACKALGROUP_-_Copy.jpg", alt: "Backal Group" },
  { src: "/client-logos/GerberGroupTheCrown.jpg", alt: "Gerber Group The Crown" },
  { src: "/client-logos/Hillstone.jpg", alt: "Hillstone" },
  { src: "/client-logos/JUICE_PRESS.png", alt: "Juice Press" },
  { src: "/client-logos/Logo-01-238x139.png", alt: "Logo 01" },
  { src: "/client-logos/Logo-02-238x139.png", alt: "Logo 02" },
  { src: "/client-logos/Logo-03-238x139.png", alt: "Logo 03" },
  { src: "/client-logos/Logo-05-238x139.png", alt: "Logo 05" },
  { src: "/client-logos/Logo-06-238x139.png", alt: "Logo 06" },
  { src: "/client-logos/Logo-09-238x139.png", alt: "Logo 09" },
  { src: "/client-logos/Logo-10-238x139.png", alt: "Logo 10" },
  { src: "/client-logos/Logo-11-238x139.png", alt: "Logo 11" },
  { src: "/client-logos/Logo-12-238x139.png", alt: "Logo 12" },
  { src: "/client-logos/MIDNIGHT_THEATER.jpeg", alt: "Midnight Theater" },
  { src: "/client-logos/Marta.png", alt: "Marta" },
  { src: "/client-logos/Peak.png", alt: "Peak" },
  { src: "/client-logos/THE_VINE.png", alt: "The Vine" },
  { src: "/client-logos/air_culinaire.png", alt: "Air Culinaire" },
  { src: "/client-logos/american_express.png", alt: "American Express" },
  { src: "/client-logos/apotheke.png", alt: "Apotheke" },
  { src: "/client-logos/applebees.png", alt: "Applebee's" },
  { src: "/client-logos/barnera_bistro.png", alt: "Barnera Bistro" },
  { src: "/client-logos/bobo.png", alt: "Bobo" },
  { src: "/client-logos/claudette.jpeg", alt: "Claudette" },
  { src: "/client-logos/company.png", alt: "Company" },
  { src: "/client-logos/costco.png", alt: "Costco" },
  { src: "/client-logos/elmo_rest.png", alt: "Elmo Restaurant" },
  { src: "/client-logos/hotel-mondrian-238x139.png", alt: "Hotel Mondrian" },
  { src: "/client-logos/jars_by_dani.png", alt: "Jars by Dani" },
  { src: "/client-logos/lamico.png", alt: "L’Amico" },
  { src: "/client-logos/nusr-et-logo-238x139.png", alt: "Nusr-Et" },
  { src: "/client-logos/rosemary.png", alt: "Rosemary" },
  { src: "/client-logos/the_national_arts.png", alt: "The National Arts Club" },
  { src: "/client-logos/triumph_Hotels.png", alt: "Triumph Hotels" },
  { src: "/client-logos/twitter.png", alt: "Twitter" },
  { src: "/client-logos/wendys.png", alt: "Wendy’s" },
];

function Clients() {
  return (
    <div className="clients-section">
      <h2>Our Clients</h2>
      <div className="clients-grid">
        {clientLogos.map((logo, index) => (
          <div key={index} className="client-logo">
            <img src={logo.src} alt={logo.alt} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Clients;
