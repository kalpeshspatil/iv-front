// Header.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./header.css";

export function Header() {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="menu">
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate("/challan")}>Challan</button>
        <button onClick={() => navigate("/dispatch")}>Dispatch</button>
        <button onClick={() => navigate("/ledger")}>Ledger</button>
        <button onClick={() => navigate("/product")}>Product</button>
        <button onClick={() => navigate("/to-party")}>To Party</button>
        <button onClick={() => navigate("/p-form")}>P-Form</button>
      </div>
    </header>
  );
}
