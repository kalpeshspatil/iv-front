import React, { useEffect, useState } from "react";
import "./ledger.css"; // Add styling if needed
import inProgressImg from "../../asset/inprogress.png";
import completedImg from "../../asset/completed.png";
import { useNavigate } from "react-router-dom";


const Ledger = () => {
  const [toParties, setToParties] = useState([]);
  const [filterStatus, setFilterStatus] = useState("PENDING"); // Filter: ALL, PENDING, RECEIVED
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedParty, setSelectedParty] = useState(null);
  const [receivedAmount, setReceivedAmount] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]); // Default to today
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();
  


  useEffect(() => {
    fetchToParties();
  }, []);

  // Fetch To Parties Data
  const fetchToParties = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/challanToParties", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setToParties(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

 // Handle Fully Received (Set balance to zero automatically)
const handleFullyReceived = async (party) => {
    if (!party) return;
  
   // const fullAmount = party.challanToPartiesQty * party.challanToPartiesRate; // Total amount
    const paymentData = {
      paymentDate: new Date(), // Today's date
      challanToParties: party,
      payment: party.outstandingPayment,
    };
  
    try {
      const response = await fetch("http://localhost:8080/api/tp/payments/paid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });
  
      if (response.ok) {
        alert("Full payment recorded successfully!");
        fetchToParties(); // Refresh the list
      } else {
        alert("Error recording full payment.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to connect to the server.");
    }
  };
  
  // Handle Partial Payment (Opens dialog first)
  const handlePartiallyReceived = (party) => {
    setSelectedParty(party);
    setShowDialog(true);
  };
  
  // Handle Partial Payment Submission
  const handlePartialSubmit = async () => {
    if (!selectedParty || receivedAmount <= 0) {
      alert("Enter a valid payment amount.");
      return;
    }
  
    const paymentData = {
      paymentDate: selectedDate,
      challanToParties: { pkId: selectedParty.pkId },
      payment: receivedAmount,
    };
  
    try {
      const response = await fetch("http://localhost:8080/api/tp/payments/paid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });
  
      if (response.ok) {
        alert("Partial payment recorded successfully!");
        setShowDialog(false);
        fetchToParties(); // Refresh list after payment
      } else {
        alert("Error recording partial payment.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to connect to the server.");
    }
  };
  
  const calculatePendingDays = (deliveryDate) => {
    const today = new Date();
    const delivery = new Date(deliveryDate);
    const diffTime = Math.abs(today - delivery);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert ms to days
  };

  // Filter logic
  const filteredToParties = toParties.filter((party) => {
    if (filterStatus === "PENDING") return party.paymentStatus === "PENDING";
    if (filterStatus === "RECEIVED") return party.paymentStatus === "RECEIVED";
    return true; // Show all if filter is "ALL"
  }).filter((party) => {
    // Filter by date range
    if (startDate && new Date(party.deliveryDate) < new Date(startDate)) {
      return false;
    }
    if (endDate && new Date(party.deliveryDate) > new Date(endDate)) {
      return false;
    }
    return true;
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="ledger-container">
      <button className="back-btn" onClick={() => navigate("/")}>
        Back to Home
      </button>
     {/* Headline Section */}
  <div className="headline-container">
    <h2>Transactions</h2>
  </div>

  {/* Filters Section */}
  <div className="filters-container">
    <div className="filter-group">
      <label>Payment Status:</label>
      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
      >
        <option value="ALL">All</option>
        <option value="PENDING">Pending</option>
        <option value="RECEIVED">Received</option>
      </select>
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
            <th>Delivery Date</th>
            <th>Party Name</th>
            <th>Quantity</th>
            <th>Rate</th>
            <th>Total Amount</th>
            <th>Outstanding Days</th>
            <th>Payment Status</th>
            <th>Action</th>
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
              
                {party.paymentStatus === "PENDING" && (
                    <td>
                  <button onClick={() => handlePartiallyReceived(party)}>Partial</button>
                  <button onClick={() => handleFullyReceived(party)}>Full</button>
                   </td>
                )}
             
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


export default Ledger;
