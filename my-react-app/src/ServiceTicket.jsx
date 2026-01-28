// src/pages/ServiceTicket.jsx
import { useNavigate, useParams } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import "./serviceTicket.css";

const API_BASE =
  import.meta?.env?.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:5000";

const SERVICES = [
  { title: "Utility Bill Payment", slug: "utility-bill-payment" },
  { title: "Bank Related Services", slug: "bank-related-services" },
  { title: "Postal Services", slug: "postal-services" },
  { title: "Courier Services", slug: "courier-services" },
  { title: "Notary/Stamp paper & Affidavite Services", slug: "notary-stamp-affidavite-services" },
  { title: "Education solutions", slug: "education-solutions" },
  { title: "Ticket Booking Services", slug: "ticket-booking-services" },
  { title: "Entertainment Services", slug: "entertainment-services" },
  { title: "Delivery Services", slug: "delivery-services" },
  { title: "Event planning Services", slug: "event-planning-services" },
  { title: "Passport Related Services", slug: "passport-related-services" },
  { title: "Holiday planning", slug: "holiday-planning" },
  { title: "Pan & ITR Services", slug: "pan-itr-services" },
  { title: "RTO Services", slug: "rto-services" },
  { title: "Party & Events Services", slug: "party-events-services" },
  { title: "Municipality Services", slug: "municipality-services" },
  { title: "Repair and Maintainence Services", slug: "repair-maintainence-services" },
  { title: "Real Estate Services", slug: "real-estate-services" },
  { title: "Travel Management", slug: "travel-management" },
  { title: "Health Management", slug: "health-management" },
  { title: "Relocation Packers & Movers", slug: "relocation-packers-movers" },
  { title: "Other Services", slug: "other-services" },
];

const PAYMENT_MODES = ["Cash", "UPI", "Card", "Net Banking", "Cheque"];

const REQUEST_TYPES_BY_CATEGORY = {
  "Utility Bill Payment": [
    "Water bill payment",
    "Electricity bill payment",
    "Insurance premium payment",
    "Internet bill payment",
    "Club bill payment",
    "Mobile bill payment",
    "Gas bill payment",
    "Cable TV Recharge/bill payment",
  ],

  "Bank Related Services": [
    "Cheque Drop",
    "Payment of Credit Card by Cash",
    "Deposit of Cheque/Drop",
    "Cheque Book Collection",
    "Updating of Passbook",
    "Collection of Account Statement",
    "Payment of Locker Rent",
    "Application for New Account",
    "Application for Locker Facility",
    "Application for Fixed Deposit",
    "Application for Public Provident Fund Account",
  ],

  "Postal Services": [
    "Normal Post",
    "Speed Post/Register post",
    "Post office stamp/stationaries",
    "Money order Services",
    "Post office Recurring Deposit Application",
  ],

  "Courier Services": [
    "Courier Services ",
    "Courier - Domestic",
    "Courier - International",
  ],

  "Notary/Stamp paper & Affidavite Services": [
    "Affidavits /Notarisation",
    "Assistance in legal documentation",
    "E-Stamp paper/Franking",
    "Legal document submission",
  ],

  "Education solutions": [
    "For Baby sittings ,elder care, care taker ,home nursing etc..",
    "Assistance in procuring admission forms - Schools, colleges, ",
    "School fees payment",
    "Application for school & Collage admission",
    "Collection of school books",
    "Collection of school Unifroms",
  ],

  "Ticket Booking Services": [
    "Train ticket booking -AC/Non AC",
    "Train ticket cancellation -AC/Non AC",
    "Tatkal Train ticket booking -Non AC",
    "Bus ticket booking -AC/Non AC",
    "Bus ticket cancellation -AC/Non AC",
    "Flight ticket booking",
    "Flight ticket cancellation",
    "Booking tickets - zoo / parks / playground",
    "Car/cab rentals",
    "Hotel accommodation bookings",
  ],

  "Entertainment Services": [
    "Premier Movie shows",
    "Event tickets",
    "Sports tickets",
    "Concerts / Musical  Events Ticket",
    "Magic shows Tickets",
    "Circus Tickets ",
  ],

  "Delivery Services": [
    "Flower Delivery",
    "Cake Delivery",
    "Gifts Delivery",
    "Document Delivery",
    "Small Parcels",
    "Medicines Delivery",
    "Other Parcel Delivery",
  ],

  "Event planning Services": [
    "Holiday Planning",
    "Restaurant bookings",
    "Real Estate",
    "Parties ( Birthday ,Anniversary ,Annual day celebration etc.. ",
    "Equipment Hire ( a service providing machinery, equipment and tools of all kinds and sizes)",
    "Banquet Halls ",
    "Music Events ( live performances of singing and instrument playing )",
    "Crockery ",
    "Games -Team bonding activities",
    "Photographer",
    "Videographer",
    "All types or MC & Guide Services",
  ],

  "Passport Related Services": [
    "Normal Process New passport, Renewal application validation & bookings",
    "Minor passport ",
    "Tatkal  passport application validation & appointment bookings",
    "Change of name update in passport ",
    "Change of address update in passport",
    "Change of photograph update in passport",
    "Damage passport application validation & appointment bookings",
    "Visa assistance",
    "Other travel documentation update in passport",
  ],

  "Holiday planning": [
    "Weekend Getaways -Vacation, Occasional relaxation ",
    "Outstation /Domestic Tour Packages",
    "International Tour Packages",
  ],

  "Pan & ITR Services": [
    "Pan Form Submission",
    "Pan Correction form submission",
    "IT Return Form -Form which is supposed to submit to the Income Tax Department of India.",
    "IT Filling Returns",
    "IT Calculation & Filing",
  ],

  "RTO Services": [
    "Learners License 2 Wheeler & 4 Wheeler",
    "Renewal of DL",
    "Change of Address in DL",
    "NOC 2 Wheeler",
    "NOC 4 Wheeler",
    "Change of Address in RC  2 Wheeler",
    "Change of Address in RC  4 Wheeler",
    "Change of Ownership  2 Wheeler",
    "Change of Ownership  4 Wheeler",
    "Other state Vehicle Re-Registrations 2 wheeler",
    "Other state Vehicle Re-Registrations 4 wheeler",
    "HPT 2 and 4 wheeler",
    "HP Entry 2 and 4 wheeler",
    "International Driving permit",
    "Duplicate RC 2 and 4 wheeler",
    "Duplicate DL 2 and 4 wheeler",
  ],

  "Party & Events Services": [
    "Catering services",
    "Party favours & decorations",
    "Venue selection",
    "Fun and games",
    "Event coordinators / waitstaff / ushers",
    "Complete party planning"
  ],

   "Municipality Services": [
    "Property tax payment",
    "Property tax calculation",
    "Birth certificate",
    "Death certificate"
  ],

 "Repair & Maintenance Services": [
    "Construction contractors",
    "Plumbing work (small / big)",
    "Electrical works (small / big)",
    "Carpentry works (small / big)",
    "Masonry works (small / big)",
    "Pest control",
    "Gardening work (small / big)",
    "House cleaning",
    "Fabrication works",
    "Painting services (house / office)"
  ],

 "Real Estate Services": [
    "House rentals / rented accommodation",
    "Lease house / commercial property",
    "Selling of house",
    "Purchasing house",
    "Purchasing commercial property",
    "Selling commercial property",
    "PG accommodations"
  ],

 "Travel Management": [
    "Receiving guests from airport / railway station / bus stand",
    "Lodging arrangement for guests",
    "Trip and local sightseeing planning",
    "Local transport assistance"
  ],

  "Health Management": [
    "Nurses at home (temporary / permanent)",
    "Collection of reports from labs"
  ],

  "Relocation Packers & Movers": [
    "Local relocation",
    "Outstation relocation",
    "International relocation"
  ]
};

function addMinutesToNow(minutes) {
  const d = new Date();
  d.setMinutes(d.getMinutes() + minutes);
  const pad2 = (n) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const MM = pad2(d.getMonth() + 1);
  const dd = pad2(d.getDate());
  const HH = pad2(d.getHours());
  const mm = pad2(d.getMinutes());
  return `${yyyy}-${MM}-${dd}T${HH}:${mm}`;
}

function applyPricing(category, requestType) {
  const fallback = { serviceCharge: "", cost: "", dueDurationText: "", dueDurationMinutes: null };
  if (!category || !requestType) return fallback;


  if (category === "Bank Related Services") {
  switch (requestType) {
    case "Application for Fixed Deposit":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 hours", dueDurationMinutes: 24 * 60 };
    case "Application for Locker Facility":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 hours", dueDurationMinutes: 24 * 60 };
    case "Application for New Account":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 hours", dueDurationMinutes: 24 * 60 };
    case "Application for Public Provident Fund Account":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 hours", dueDurationMinutes: 24 * 60 };
    case "Cheque Book Collection":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 hours", dueDurationMinutes: 24 * 60 };
    case "Cheque Drop":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 hours", dueDurationMinutes: 24 * 60 };
    case "Collection of Account Statement":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 hours", dueDurationMinutes: 24 * 60 };
    case "Deposit of Cheque/Drop":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 hours", dueDurationMinutes: 24 * 60 };
    case "Payment of Credit Card by Cash":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 hours", dueDurationMinutes: 24 * 60 };
    case "Payment of Locker Rent":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 hours", dueDurationMinutes: 24 * 60 };
    case "Updating of Passbook":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 hours", dueDurationMinutes: 24 * 60 };
    default:
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 hours", dueDurationMinutes: 24 * 60 };
  }
}

if (category === "Courier Services") {
  switch (requestType) {
    case "Courier - Domestic":
      return { serviceCharge: 0, cost: "110/- up to 250gms", dueDurationText: "24 hours", dueDurationMinutes: 24 * 60 };
    case "Courier - International":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 hours", dueDurationMinutes: 24 * 60 };
    case "Courier-Local":
      return { serviceCharge: 0, cost: "45/- up to 250gms", dueDurationText: "24 hours", dueDurationMinutes: 24 * 60 };
    default:
      return { serviceCharge: 0, cost: "45/- up to 250gms", dueDurationText: "24 hours", dueDurationMinutes: 24 * 60 };
  }
}

if (category === "Delivery Services") {
  switch (requestType) {
    case "Cake Delivery":
      return { serviceCharge: 25, cost: "Case to Case", dueDurationText: "24 Hours", dueDurationMinutes: 24 * 60 };
    case "Document Delivery":
      return { serviceCharge: 25, cost: "Case to Case", dueDurationText: "24 Hours", dueDurationMinutes: 24 * 60 };
    case "Flower Delivery":
      return { serviceCharge: 25, cost: "Case to Case", dueDurationText: "24 Hours", dueDurationMinutes: 24 * 60 };
    case "Gifts Delivery":
      return { serviceCharge: 25, cost: "Case to Case", dueDurationText: "24 Hours", dueDurationMinutes: 24 * 60 };
    case "Medicines Delivery":
      return { serviceCharge: 25, cost: "Case to Case", dueDurationText: "48 Hours", dueDurationMinutes: 48 * 60 };
    case "Other Parcel Delivery":
      return { serviceCharge: 25, cost: "Case to Case", dueDurationText: "24 Hours", dueDurationMinutes: 24 * 60 };
    case "Small Parcels":
      return { serviceCharge: 25, cost: "Case to Case", dueDurationText: "24 Hours", dueDurationMinutes: 24 * 60 };
    default:
      return { serviceCharge: 25, cost: "Case to Case", dueDurationText: "24 Hours", dueDurationMinutes: 24 * 60 };
  }
}

if (category === "Education solutions") {
  switch (requestType) {
    case "Application for school & Collage admission":
      return { serviceCharge: 25, cost: "Case to Case", dueDurationText: "48 hours", dueDurationMinutes: 48 * 60 };
    case "Assistance in procuring admission forms - Schools, colleges,":
      return { serviceCharge: 25, cost: "Case to Case", dueDurationText: "48 hours", dueDurationMinutes: 48 * 60 };
    case "Collection of school books":
      return { serviceCharge: 25, cost: "Case to Case", dueDurationText: "48 hours", dueDurationMinutes: 48 * 60 };
    case "Collection of Uniforms":
      return { serviceCharge: 25, cost: "Case to Case", dueDurationText: "48 hours", dueDurationMinutes: 48 * 60 };
    case "For Baby sittings ,elder care, care taker ,home nursing etc..":
      return { serviceCharge: 25, cost: "Case to Case", dueDurationText: "48 hours", dueDurationMinutes: 48 * 60 };
    case "School fees payment":
      return { serviceCharge: 25, cost: "Case to Case", dueDurationText: "48 hours", dueDurationMinutes: 48 * 60 };
    default:
      return { serviceCharge: 25, cost: "Case to Case", dueDurationText: "48 hours", dueDurationMinutes: 48 * 60 };
  }
}

if (category === "Entertainment Services") {
  switch (requestType) {
    case "Circus Tickets":
      return { serviceCharge: 10, cost: "Case to Case", dueDurationText: "48 Hours (subject to availability)", dueDurationMinutes: 48 * 60 };
    case "Concerts / Musical Events Ticket":
      return { serviceCharge: 10, cost: "Case to Case", dueDurationText: "48 Hours (subject to availability)", dueDurationMinutes: 48 * 60 };
    case "Event tickets":
      return { serviceCharge: 10, cost: "Case to Case", dueDurationText: "48 Hours (subject to availability)", dueDurationMinutes: 48 * 60 };
    case "Magic shows Tickets":
      return { serviceCharge: 10, cost: "Case to Case", dueDurationText: "48 Hours (subject to availability)", dueDurationMinutes: 48 * 60 };
    case "Premier Movie shows":
      return { serviceCharge: 10, cost: "Case to Case", dueDurationText: "48 Hours (subject to availability)", dueDurationMinutes: 48 * 60 };
    case "Sports tickets":
      return { serviceCharge: 25, cost: "Case to Case", dueDurationText: "48 Hours (subject to availability)", dueDurationMinutes: 48 * 60 };
    default:
      return { serviceCharge: 10, cost: "Case to Case", dueDurationText: "48 Hours (subject to availability)", dueDurationMinutes: 48 * 60 };
  }
}

if (category === "Event planning Services") {
  switch (requestType) {
    case "All types or MC & Guide Services":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 Hours", dueDurationMinutes: 24 * 60 };
    case "Banquet Halls":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 Hours", dueDurationMinutes: 24 * 60 };
    case "Crockery":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 Hours", dueDurationMinutes: 24 * 60 };
    case "Equipment Hire ( a service providing machinery, equipment and tools of all kinds and sizes":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 Hours", dueDurationMinutes: 24 * 60 };
    case "Games -Team bonding activities":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 Hours", dueDurationMinutes: 24 * 60 };
    case "Holiday Planning":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 Hours", dueDurationMinutes: 24 * 60 };
    case "Music Events ( live performances of singing and instrument playing )":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 Hours", dueDurationMinutes: 24 * 60 };
    case "Parties ( Birthday ,Anniversary ,Annual day celebration etc..":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 Hours", dueDurationMinutes: 24 * 60 };
    case "Photographer":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 Hours", dueDurationMinutes: 24 * 60 };
    case "Real Estate":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 Hours", dueDurationMinutes: 24 * 60 };
    case "Restaurant bookings":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 Hours", dueDurationMinutes: 24 * 60 };
    case "Videographer":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 Hours", dueDurationMinutes: 24 * 60 };
    default:
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 Hours", dueDurationMinutes: 24 * 60 };
  }
}

if (category === "Health Management") {
  switch (requestType) {
    case "Collection of reports from labs":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24hours", dueDurationMinutes: 24 * 60 };
    case "Nurses at home on temporary / permanent basis":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24hours", dueDurationMinutes: 24 * 60 };
    default:
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24hours", dueDurationMinutes: 24 * 60 };
  }
}

if (category === "Holiday planning") {
  switch (requestType) {
    case "International Tour Packages":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "48 hours", dueDurationMinutes: 48 * 60 };
    case "Outstation /Domestic Tour Packages":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "48 hours", dueDurationMinutes: 48 * 60 };
    case "Weekend Getaways -Vacation, Occasional relaxation":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "48 hours", dueDurationMinutes: 48 * 60 };
    default:
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "48 hours", dueDurationMinutes: 48 * 60 };
  }
}

if (category === "Municipality Services") {
  switch (requestType) {
    case "Birth Certificate":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "15 Working Days", dueDurationMinutes: 15 * 24 * 60 };
    case "Death Certificate":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "20 Working Days", dueDurationMinutes: 20 * 24 * 60 };
    case "Property Tax payment":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "25 Working days", dueDurationMinutes: 25 * 24 * 60 };
    case "Property Tax payment calculation":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "3 Working days", dueDurationMinutes: 3 * 24 * 60 };
    default:
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "25 Working days", dueDurationMinutes: 25 * 24 * 60 };
  }
}

if (category === "Notary/Stamp paper & Affidavite Services") {
  switch (requestType) {
    case "Affidavits /Notarisation":
      return { serviceCharge: 25, cost: "Case to Case", dueDurationText: "48 hours", dueDurationMinutes: 48 * 60 };
    case "Assistance in legal documentation":
      return { serviceCharge: 25, cost: "Case to Case", dueDurationText: "48 hours", dueDurationMinutes: 48 * 60 };
    case "E-Stamp paper/Franking":
      return { serviceCharge: 10, cost: "Case to Case", dueDurationText: "48 hours", dueDurationMinutes: 48 * 60 };
    case "Legal document submission":
      return { serviceCharge: 25, cost: "Case to Case", dueDurationText: "48 hours", dueDurationMinutes: 48 * 60 };
    default:
      return { serviceCharge: 25, cost: "Case to Case", dueDurationText: "48 hours", dueDurationMinutes: 48 * 60 };
  }
}

if (category === "Other Services") {
  switch (requestType) {
    case "Dry Cleaning":
      return { serviceCharge: 25, cost: "Case to Case", dueDurationText: "48 hours", dueDurationMinutes: 48 * 60 };
    case "Key Duplication":
      return { serviceCharge: 25, cost: "Case to Case", dueDurationText: "48 hours", dueDurationMinutes: 48 * 60 };
    case "Repair Service - Home appliances":
      return { serviceCharge: 25, cost: "Case to Case", dueDurationText: "48 hours", dueDurationMinutes: 48 * 60 };
    case "Tailoring":
      return { serviceCharge: 25, cost: "Case to Case", dueDurationText: "48 hours", dueDurationMinutes: 48 * 60 };
    case "Watch Repairs":
      return { serviceCharge: 25, cost: "Case to Case", dueDurationText: "48 hours", dueDurationMinutes: 48 * 60 };
    default:
      return { serviceCharge: 25, cost: "Case to Case", dueDurationText: "48 hours", dueDurationMinutes: 48 * 60 };
  }
}

if (category === "Pan & ITR Services") {
  switch (requestType) {
    case "IT Calculation & Filing":
      return { serviceCharge: 25, cost: "Case to Case", dueDurationText: "5 working days", dueDurationMinutes: 5 * 24 * 60 };
    case "IT Filling Returns":
      return { serviceCharge: 25, cost: "Case to Case", dueDurationText: "5 working days", dueDurationMinutes: 5 * 24 * 60 };
    case "IT Return Form -Form which is supposed to submit to the Income Tax Department of India.":
      return { serviceCharge: 25, cost: "Case to Case", dueDurationText: "5 working days", dueDurationMinutes: 5 * 24 * 60 };
    case "Pan Correction form submission":
      return { serviceCharge: 25, cost: "Case to Case", dueDurationText: "5 working days", dueDurationMinutes: 5 * 24 * 60 };
    case "Pan Form Submission":
      return { serviceCharge: 25, cost: "Case to Case", dueDurationText: "5 working days", dueDurationMinutes: 5 * 24 * 60 };
    default:
      return { serviceCharge: 25, cost: "Case to Case", dueDurationText: "5 working days", dueDurationMinutes: 5 * 24 * 60 };
  }
}

if (category === "Party & Events Services") {
  switch (requestType) {
    case "Catering services":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "48 Hours", dueDurationMinutes: 48 * 60 };
    case "Complete Party Planning":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "48 Hours", dueDurationMinutes: 48 * 60 };
    case "Event Coordinators, Waitstaff, Usherers":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "48 Hours", dueDurationMinutes: 48 * 60 };
    case "Fun and Games":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "48 Hours", dueDurationMinutes: 48 * 60 };
    case "Party Favours & Decorations":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "48 Hours", dueDurationMinutes: 48 * 60 };
    case "Venue Selection":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "48 Hours", dueDurationMinutes: 48 * 60 };
    default:
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "48 Hours", dueDurationMinutes: 48 * 60 };
  }
}

if (category === "Passport Related Services") {
  switch (requestType) {
    case "Change of address update in passport":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "10 working days", dueDurationMinutes: 10 * 24 * 60 };
    case "Change of name update in passport":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "10 working days", dueDurationMinutes: 10 * 24 * 60 };
    case "Change of photograph update in passport":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "10 working days", dueDurationMinutes: 10 * 24 * 60 };
    case "Damage passport application validation & appointment bookings":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "10 working days", dueDurationMinutes: 10 * 24 * 60 };
    case "Minor passport":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "10 working days", dueDurationMinutes: 10 * 24 * 60 };
    case "Normal Process New passport, Renewal application validation & bookings":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "10 working days", dueDurationMinutes: 10 * 24 * 60 };
    case "Other travel documentation update in passport":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "10 working days", dueDurationMinutes: 10 * 24 * 60 };
    case "Tatkal passport application validation & appointment bookings":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "4 working days", dueDurationMinutes: 4 * 24 * 60 };
    case "Visa assistance":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "10 working days", dueDurationMinutes: 10 * 24 * 60 };
    default:
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "10 working days", dueDurationMinutes: 10 * 24 * 60 };
  }
}

if (category === "Postal Services") {
  switch (requestType) {
    case "Money order Services":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 hours", dueDurationMinutes: 24 * 60 };
    case "Normal Post":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 hours", dueDurationMinutes: 24 * 60 };
    case "Post office Recurring Deposit Application":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 hours", dueDurationMinutes: 24 * 60 };
    case "Post office stamp/stationaries":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 hours", dueDurationMinutes: 24 * 60 };
    case "Speed Post/Register post":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 hours", dueDurationMinutes: 24 * 60 };
    default:
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 hours", dueDurationMinutes: 24 * 60 };
  }
}

if (category === "Real Estate Services") {
  switch (requestType) {
    case "House rentals /Rented Accommodation":
      return { serviceCharge: 8, cost: "On Actual Charges", dueDurationText: "48 hours", dueDurationMinutes: 48 * 60 };
    case "Lease house / commercial property":
      return { serviceCharge: 8, cost: "On Actual Charges", dueDurationText: "48 hours", dueDurationMinutes: 48 * 60 };
    case "PG Accommodations":
      return { serviceCharge: 8, cost: "On Actual Charges", dueDurationText: "48 hours", dueDurationMinutes: 48 * 60 };
    case "Purchasing commercial property":
      return { serviceCharge: 8, cost: "On Actual Charges", dueDurationText: "48 hours", dueDurationMinutes: 48 * 60 };
    case "Purchasing house":
      return { serviceCharge: 8, cost: "On Actual Charges", dueDurationText: "48 hours", dueDurationMinutes: 48 * 60 };
    case "Selling commercial property":
      return { serviceCharge: 8, cost: "On Actual Charges", dueDurationText: "48 hours", dueDurationMinutes: 48 * 60 };
    case "Selling of house":
      return { serviceCharge: 8, cost: "On Actual Charges", dueDurationText: "48 hours", dueDurationMinutes: 48 * 60 };
    default:
      return { serviceCharge: 8, cost: "On Actual Charges", dueDurationText: "48 hours", dueDurationMinutes: 48 * 60 };
  }
}

if (category === "Relocation Packers & Movers") {
  switch (requestType) {
    case "International":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "4 working days", dueDurationMinutes: 4 * 24 * 60 };
    case "Local":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24hours", dueDurationMinutes: 24 * 60 };
    case "Outstation":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "48 hours", dueDurationMinutes: 48 * 60 };
    default:
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24hours", dueDurationMinutes: 24 * 60 };
  }
}

if (category === "Repair & Maintenance Services") {
  switch (requestType) {
    case "Carpentry works - Small / Big":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 Hours", dueDurationMinutes: 24 * 60 };
    case "Construction contractors":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "30 Working Days", dueDurationMinutes: 30 * 24 * 60 };
    case "Electrical works - Small / Big":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 Hours", dueDurationMinutes: 24 * 60 };
    case "Fabrication works":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 Hours", dueDurationMinutes: 24 * 60 };
    case "Gardening work - small / big":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 Hours", dueDurationMinutes: 24 * 60 };
    case "House cleaning":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 Hours", dueDurationMinutes: 24 * 60 };
    case "Masonry works - Small / Big":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 Hours", dueDurationMinutes: 24 * 60 };
    case "Painting Services -House ,Office etc..":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "5 working days", dueDurationMinutes: 5 * 24 * 60 };
    case "Pest control":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 Hours", dueDurationMinutes: 24 * 60 };
    case "Plumbing work - Small / Big":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 Hours", dueDurationMinutes: 24 * 60 };
    default:
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 Hours", dueDurationMinutes: 24 * 60 };
  }
}

if (category === "RTO Services") {
  switch (requestType) {
    case "Change of Address in DL":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "30 Working Days", dueDurationMinutes: 30 * 24 * 60 };
    case "Change of Address in RC 2 Wheeler":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "30 Working Days", dueDurationMinutes: 30 * 24 * 60 };
    case "Change of Address in RC 4 Wheeler":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "30 Working Days", dueDurationMinutes: 30 * 24 * 60 };
    case "Change of Ownership 2 Wheeler":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "30 Working Days", dueDurationMinutes: 30 * 24 * 60 };
    case "Change of Ownership 4 Wheeler":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "30 Working Days", dueDurationMinutes: 30 * 24 * 60 };
    case "Duplicate DL 2 and 4 wheeler":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "30 Working Days", dueDurationMinutes: 30 * 24 * 60 };
    case "Duplicate RC 2 and 4 wheeler":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "30 Working Days", dueDurationMinutes: 30 * 24 * 60 };
    case "HP Entry 2 and 4 wheeler":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "30 Working Days", dueDurationMinutes: 30 * 24 * 60 };
    case "HPT 2 and 4 wheeler":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "30 Working Days", dueDurationMinutes: 30 * 24 * 60 };
    case "International Driving permit":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "30 Working Days", dueDurationMinutes: 30 * 24 * 60 };
    case "Learners License 2 Wheeler & 4 Wheeler":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "45 Working Days", dueDurationMinutes: 45 * 24 * 60 };
    case "NOC 2 Wheeler":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "30 Working Days", dueDurationMinutes: 30 * 24 * 60 };
    case "NOC 4 Wheeler":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "30 Working Days", dueDurationMinutes: 30 * 24 * 60 };
    case "Other state Vehicle Re-Registrations 2 wheeler":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "60 Working Days", dueDurationMinutes: 60 * 24 * 60 };
    case "Other state Vehicle Re-Registrations 4 Wheeler":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "60 Working Days", dueDurationMinutes: 60 * 24 * 60 };
    case "Renewal of DL":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "30 Working Days", dueDurationMinutes: 30 * 24 * 60 };
    default:
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "30 Working Days", dueDurationMinutes: 30 * 24 * 60 };
  }
}

if (category === "Ticket Booking Services") {
  switch (requestType) {
    case "Bus ticket booking -AC/Non AC":
      return { serviceCharge: 45, cost: "Case to Case", dueDurationText: "48 Hours (subject to availability)", dueDurationMinutes: 48 * 60 };
    case "Bus ticket cancellation -AC/Non AC":
      return { serviceCharge: 45, cost: "Case to Case", dueDurationText: "24 Hours", dueDurationMinutes: 24 * 60 };
    case "Car/cab rentals":
      return { serviceCharge: 25, cost: "Case to Case", dueDurationText: "48 Hours (subject to availability)", dueDurationMinutes: 48 * 60 };
    case "Flight ticket booking":
      return { serviceCharge: 100, cost: "Case to Case", dueDurationText: "48 Hours (subject to availability)", dueDurationMinutes: 48 * 60 };
    case "Flight ticket cancellation":
      return { serviceCharge: 100, cost: "Case to Case", dueDurationText: "24 Hours", dueDurationMinutes: 24 * 60 };
    case "Hotel accommodation bookings":
      return { serviceCharge: 25, cost: "Case to Case", dueDurationText: "48 Hours (subject to availability)", dueDurationMinutes: 48 * 60 };
    case "Tatkal Train ticket booking -AC":
      return { serviceCharge: 1000, cost: "Case to Case", dueDurationText: "48 Hours (subject to availability)", dueDurationMinutes: 48 * 60 };
    case "Tatkal Train ticket booking -Non AC":
      return { serviceCharge: 500, cost: "Case to Case", dueDurationText: "48 Hours (subject to availability)", dueDurationMinutes: 48 * 60 };
    case "Train ticket booking -AC/Non AC":
      return { serviceCharge: 70, cost: "Case to Case", dueDurationText: "48 Hours (subject to availability)", dueDurationMinutes: 48 * 60 };
    case "Train ticket cancellation -AC/Non AC":
      return { serviceCharge: 70, cost: "Case to Case", dueDurationText: "48 Hours (subject to availability)", dueDurationMinutes: 48 * 60 };
    default:
      return { serviceCharge: 70, cost: "Case to Case", dueDurationText: "48 Hours (subject to availability)", dueDurationMinutes: 48 * 60 };
  }
}

if (category === "Travel Management") {
  switch (requestType) {
    case "Assistance in providing local transport":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24hours", dueDurationMinutes: 24 * 60 };
    case "Planning for trip and local sight seeing":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24hours", dueDurationMinutes: 24 * 60 };
    case "Receiving guest / relatives from Airports / Railway Stations / Bus Stands":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24hours", dueDurationMinutes: 24 * 60 };
    case "Taking care of their lodging needs":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24hours", dueDurationMinutes: 24 * 60 };
    default:
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24hours", dueDurationMinutes: 24 * 60 };
  }
}

if (category === "Utility Bill Payment") {
  switch (requestType) {
    case "Cable TV Recharge/bill payment":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 hours", dueDurationMinutes: 24 * 60 };
    case "Club bill payment":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 hours", dueDurationMinutes: 24 * 60 };
    case "Electricity bill payment":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 hours", dueDurationMinutes: 24 * 60 };
    case "Gas bill payment":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 hours", dueDurationMinutes: 24 * 60 };
    case "Insurance premium payment":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 hours", dueDurationMinutes: 24 * 60 };
    case "Internet bill payment":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 hours", dueDurationMinutes: 24 * 60 };
    case "Mobile bill payment":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 hours", dueDurationMinutes: 24 * 60 };
    case "Water bill payment":
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 hours", dueDurationMinutes: 24 * 60 };
    default:
      return { serviceCharge: 0, cost: "Case to Case", dueDurationText: "24 hours", dueDurationMinutes: 24 * 60 };
  }
}


  return fallback;
}

export default function ServiceTicket() {
  const nav = useNavigate();
  const { serviceSlug } = useParams();

  const service = useMemo(() => SERVICES.find((s) => s.slug === serviceSlug), [serviceSlug]);

  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authErr, setAuthErr] = useState("");

  const [form, setForm] = useState({
    companyName: "",
    customerName: "",
    customerContactNumber: "",
    customerEmailId: "",
    category: service?.title || "",
    requestType: "",
    particulars: "",
    description: "",
    modeOfPayment: "",
    serviceCharges: "",
    cost: "",
    dueDate: "",
  });

  const [dueDurationText, setDueDurationText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setAuthErr("");
        const res = await fetch(`${API_BASE}/api/me`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) {
          nav("/");
          return;
        }
        const data = await res.json();
        setUser(data?.user || null);
      } catch (e) {
        setAuthErr(e?.message || "Failed to load user");
      } finally {
        setAuthLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!service) return;
    setForm((p) => ({
      ...p,
      category: service.title,
      requestType: "",
      serviceCharges: "",
      cost: "",
      dueDate: "",
    }));
    setDueDurationText("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceSlug]);

  const category = service?.title || "";
  const requestTypes = REQUEST_TYPES_BY_CATEGORY[category] || ["General Request"];

  useEffect(() => {
    if (!form.requestType) return;

    const next = applyPricing(category, form.requestType);
    setDueDurationText(next.dueDurationText || "");

    setForm((p) => ({
      ...p,
      serviceCharges: next.serviceCharge,
      cost: next.cost,
      dueDate: next.dueDurationMinutes != null ? addMinutesToNow(next.dueDurationMinutes) : "",
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.requestType, category]);

  function setField(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");

    if (!user?.username) return setMsg("Session expired. Please login again.");

    if (!form.companyName.trim()) return setMsg("Company name is required.");
    if (!form.customerName.trim()) return setMsg("Customer name is required.");
    if (!form.customerContactNumber.trim()) return setMsg("Customer contact number is required.");
    if (!form.customerEmailId.trim()) return setMsg("Customer email id is required.");
    if (!form.requestType) return setMsg("Request type is required.");
    if (!form.modeOfPayment) return setMsg("Mode of payment is required.");
    if (!form.dueDate) return setMsg("Due date is required.");

    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/api/tickets`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, dueDurationText }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data?.message || "Failed to raise ticket.");
      } else {
        setMsg(`Ticket successfully raised. Ticket Number: ${data.ticketNumber}`);
        setForm((p) => ({
          ...p,
          companyName: "",
          customerName: "",
          customerContactNumber: "",
          customerEmailId: "",
          requestType: "",
          particulars: "",
          description: "",
          modeOfPayment: "",
          serviceCharges: "",
          cost: "",
          dueDate: "",
        }));
        setDueDurationText("");
      }
    } catch {
      setMsg("Server error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading) {
    return (
      <div className="st-page">
        <div className="st-container">
          <div className="st-header">
            <h2 className="st-title">Service Ticket</h2>
          </div>
          <p className="st-subtitle">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="st-page">
        <div className="st-container">
          <h2 className="st-title">Unauthorized</h2>
          {authErr && (
            <div className="st-error">
              <strong>Error:</strong> {authErr}
            </div>
          )}
          <button className="st-btn" style={{ marginTop: 12 }} onClick={() => nav("/")}>
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="st-page">
        <div className="st-container">
          <h2 className="st-title">Invalid Service</h2>
          <button className="st-btn st-btn-secondary" onClick={() => nav("/raise-ticket")}>
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="st-page">
      <div className="st-container">
        <div className="st-header">
          <div className="st-header-left">
            <h2 className="st-title">{service.title}</h2>
            <p className="st-subtitle">Fill the details below to raise a service request.(All fields are mandatory, type 'none' if a field is not applicable)</p>
          </div>

          <div className="st-header-actions">
            <button className="st-btn st-btn-secondary" onClick={() => nav("/raise-ticket")}>
              Back
            </button>

            <button
              className="st-btn st-btn-ghost"
              onClick={async () => {
                try {
                  await fetch(`${API_BASE}/api/logout`, {
                    method: "POST",
                    credentials: "include",
                  });
                } finally {
                  nav("/");
                }
              }}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="st-meta">
          <span className="st-pill">
            <span className="st-dot" />
            <b>Location:</b>&nbsp;{user.location || "-"}
          </span>
          <span className="st-pill">
            <span className="st-dot" />
            <b>Raised By:</b>&nbsp;{user.username}
          </span>
        </div>

        <form onSubmit={onSubmit} className="st-form">
          <div className="st-grid">
            <div className="st-field">
              <label className="st-label">Company name</label>
              <input
                className="st-input"
                placeholder="Company name"
                value={form.companyName}
                onChange={(e) => setField("companyName", e.target.value)}
              />
            </div>

            <div className="st-field">
              <label className="st-label">Customer name</label>
              <input
                className="st-input"
                placeholder="Customer name"
                value={form.customerName}
                onChange={(e) => setField("customerName", e.target.value)}
              />
            </div>

            <div className="st-field">
              <label className="st-label">Customer contact number</label>
              <input
                className="st-input"
                placeholder="Customer contact number"
                value={form.customerContactNumber}
                onChange={(e) => setField("customerContactNumber", e.target.value)}
              />
            </div>

            <div className="st-field">
              <label className="st-label">Customer email id</label>
              <input
                className="st-input"
                placeholder="Customer email id"
                value={form.customerEmailId}
                onChange={(e) => setField("customerEmailId", e.target.value)}
              />
            </div>

            <div className="st-field">
              <label className="st-label">Category</label>
              <input className="st-input st-input-readonly" placeholder="Category" value={form.category} readOnly />
            </div>

            <div className="st-field">
              <label className="st-label">Request type</label>
              <select
                className="st-select"
                value={form.requestType}
                onChange={(e) => setField("requestType", e.target.value)}
              >
                <option value="">Select request type</option>
                {requestTypes.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>

            <div className="st-field">
              <label className="st-label">Particulars</label>
              <input
                className="st-input"
                placeholder="Particulars"
                value={form.particulars}
                onChange={(e) => setField("particulars", e.target.value)}
              />
            </div>

            <div className="st-field st-field-wide">
              <label className="st-label">Description</label>
              <textarea
                className="st-textarea"
                placeholder="Description"
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                rows={4}
              />
            </div>

            <div className="st-field">
              <label className="st-label">Mode of payment</label>
              <select
                className="st-select"
                value={form.modeOfPayment}
                onChange={(e) => setField("modeOfPayment", e.target.value)}
              >
                <option value="">Select mode of payment</option>
                {PAYMENT_MODES.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>

            <div className="st-field">
              <label className="st-label">Service Charges</label>
              <input
                className="st-input"
                placeholder="Service Charges"
                value={form.serviceCharges}
                onChange={(e) => setField("serviceCharges", e.target.value)}
              />
            </div>

            <div className="st-field">
              <label className="st-label">Cost</label>
              <input
                className="st-input"
                placeholder="Cost"
                value={form.cost}
                onChange={(e) => setField("cost", e.target.value)}
              />
            </div>

            <div className="st-field">
              <label className="st-label">Due date</label>
              <input
                className="st-input"
                type="datetime-local"
                value={form.dueDate}
                onChange={(e) => setField("dueDate", e.target.value)}
              />
              {dueDurationText ? <div className="st-help">Auto due duration: {dueDurationText}</div> : null}
            </div>
          </div>

          <div className="st-actions">
            <button className="st-btn" type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit / Raise Ticket"}
            </button>
          </div>

          {msg ? <div className={`st-message ${msg.toLowerCase().includes("success") ? "ok" : ""}`}>{msg}</div> : null}
        </form>
      </div>
    </div>
  );
}
