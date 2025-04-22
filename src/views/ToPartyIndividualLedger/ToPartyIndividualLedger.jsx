import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const ToPartyIndividualLedger = () => {

      const [toParties, setToParties] = useState([]); // State for storing the parties list
      const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]); // Default to today
      const [startDate, setStartDate] = useState("");
      const [endDate, setEndDate] = useState("");
    

     const fetchTpCustomersList = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/tp/customers`, {
            method: "GET", // Method is GET by default, so it's optional here
            headers: {
              "Content-Type": "application/json", // This is typically included for APIs that return JSON
            },
          });
    
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
    
          const data = await response.json(); // Parsing the JSON data from the response
          setToParties(data); // Set the toParty data in the state
        } catch (error) {
          console.error("Error fetching to parties:", error);
        }
      };
 
  return (
    <div className="ledger-container">
      <button className="back-btn" onClick={() => navigate("/home")}>
        Back to Home
      </button>
     {/* Headline Section */}
  <div className="headline-container">
    <h2>Transactions</h2>
  </div>

  {/* Filters Section */}
  <div className="filters-container">
    <div className="filter-group">
      <label>Party Name</label>
      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        options={toParties.map((party) => ({
            value: toParties.tpCustomerId,
            label: toParties.customerName
        }))}
        required
      />
        
       
    </div>

    
                            

    <div className="filter-group">
      <label>Start Date:</label>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
    </div>

    <div className="filter-group">
      <label>End Date:</label>
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
    </div>
  </div>


      <table className="ledger-table">
        <thead>
          <tr>
            <th> Date</th>
            <th>Party Name</th>
            <th>Debit</th>
            <th>Credit</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {filteredToParties.sort((a, b) => (a.paymentStatus === "PENDING" ? -1 : 1))
          .map((party) => (
            <tr key={party.pkId}>
              <td>{new Date(party.deliveryDate).toLocaleDateString("en-CA")}</td>
              <td>{party.selectedToParty.customerName}</td>
              <td>{party.challanToPartiesQty}</td>
              <td>{party.challanToPartiesRate}</td>
              <td>{party.outstandingPayment}</td>
              <td>{calculatePendingDays(party.deliveryDate)}</td>
              <td className={party.paymentStatus === "RECEIVED" ? "received" : "pending"}>
                <img
                    src={party.paymentStatus === "RECEIVED" ? completedImg : inProgressImg}
                    alt="Payment Status"
                    className=""
                />
                </td>
              
             
            </tr>
          ))}
        </tbody>
      </table>


      {/* Partially Received Dialog */}
      {showDialog && (
        <div className="dialog">
            <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <input
            type="number"
            value={receivedAmount}
            onChange={(e) => setReceivedAmount(Number(e.target.value))}
            placeholder="Enter amount"
          />
          
          <button onClick={handlePartialSubmit}>Submit</button>
          <button onClick={() => setShowDialog(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default ToPartyIndividualLedger;
