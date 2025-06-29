import React, { useEffect, useState } from "react";
import "./ledger.css"; // Add styling if needed
import inProgressImg from "../../assets/images/inprogress.png";
import completedImg from "../../assets/images/completed.png";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../constants.js";
import { format } from "date-fns";
import { FaFilter } from "react-icons/fa"; // You can change this icon as needed

const Ledger = () => {
  const [toParties, setToParties] = useState([]);
  const [toPartiesLedger, setToPartiesLedger] = useState([]);
  const [filterStatus, setFilterStatus] = useState("ALL"); // Filter: ALL, PENDING, RECEIVED
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedParty, setSelectedParty] = useState(null);
  const [receivedAmount, setReceivedAmount] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  ); // Default to today
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchToPartiesLedger();
  }, []);

  const handleViewDetails = (party) => {
    navigate(`/ledger/${party.tpCustomerId}`, {
      state: { customerName: party.customerName },
    });
  };

  // Fetch To Parties Data
  const fetchToPartiesLedger = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/challanToParties/ledger`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setToPartiesLedger(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Fully Received (Set balance to zero automatically)
  const handleFullyReceived = async (party) => {
    if (!party) return;

    const paymentData = {
      paymentDate: new Date().toISOString().split("T")[0], // 'yyyy-MM-dd', // Today's date
      toParty: { 
        tpCustomerId: parseInt(party.tpCustomerId, 10)
      },
      payment: party.balance,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/tp/payments/paid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      if (response.ok) {
        alert("Full payment recorded successfully!");
        fetchToPartiesLedger(); // Refresh the list
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

    const formattedDate = format(selectedDate, "yyyy-MM-dd");

    const paymentData = {
      paymentDate: formattedDate,
      toParty: { 
        tpCustomerId: parseInt(selectedParty.tpCustomerId, 10)
      },
      payment: receivedAmount,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/tp/payments/paid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      if (response.ok) {
        alert("Partial payment recorded successfully!");
        setShowDialog(false);
        fetchToPartiesLedger(); // Refresh list after payment
      } else {
        alert("Error recording partial payment.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to connect to the server.");
    }
  };

  // const calculatePendingDays = (deliveryDate) => {
  //   const today = new Date();
  //   const delivery = new Date(deliveryDate);
  //   const diffTime = Math.abs(today.getTime() - delivery.getTime());
  //   return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert ms to days
  // };

  // Filter logic
  // const filteredToParties = toParties.filter((party) => {
  //   if (filterStatus === "PENDING") return party.paymentStatus === "PENDING";
  //   if (filterStatus === "RECEIVED") return party.paymentStatus === "RECEIVED";
  //   return true; // Show all if filter is "ALL"
  // }).filter((party) => {
  //   // Filter by date range
  //   if (startDate && new Date(party.deliveryDate) < new Date(startDate)) {
  //     return false;
  //   }
  //   if (endDate && new Date(party.deliveryDate) > new Date(endDate)) {
  //     return false;
  //   }
  //   return true;
  // });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const filteredToParties = toPartiesLedger
    .filter((party) => {
      if (filterStatus === "PENDING") return party.balance > 0;
      if (filterStatus === "RECEIVED") return party.balance === 0;
      return true; // "ALL"
    })
    .filter((party) => {
      if (startDate && new Date(party.date) < new Date(startDate)) return false;
      if (endDate && new Date(party.date) > new Date(endDate)) return false;
      return true;
    });

  return (
    <div className="ledger-container p-0">
      {/* Toggle Button */}
      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn btn-outline-secondary"
          onClick={() => setShowFilters((prev) => !prev)}
        >
          <FaFilter className="me-2" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Filters Row - Collapsible */}
      {showFilters && (
        <div className="card p-3 mb-4 shadow-sm">
          <div className="row g-3">
            {/* Payment Status */}
            <div className="col-md-4">
              <label className="form-label">Payment Status</label>
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="ALL">All</option>
                <option value="PENDING">Pending</option>
                <option value="RECEIVED">Received</option>
              </select>
            </div>

            {/* Start Date */}
            <div className="col-md-4">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            {/* End Date */}
            <div className="col-md-4">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      <table className="ledger-table">
        <thead>
          <tr>
            <th>Party Name</th>
            <th>Debit</th>
            <th>Credit</th>
            <th>Total Outstanding</th>
            <th>Payment Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredToParties
            .sort((a, b) => (a.balance === 0 ? 1 : -1))
            .map((party) => (
              <tr key={party.tpCustomerId}>
                <td>{party.customerName}</td>
                <td>{party.debit}</td>
                <td>{party.credit}</td>
                <td>{party.balance}</td>
                <td className={party.balance === 0 ? "received" : "pending"}>
                  <img
                    src={party.balance === 0 ? completedImg : inProgressImg}
                    alt="Payment Status"
                    className=""
                  />
                </td>

                <td>
                  {party.balance > 0 && (
                    <>
                      <button onClick={() => handlePartiallyReceived(party)}>
                        Partial
                      </button>
                      <button onClick={() => handleFullyReceived(party)}>
                        Full
                      </button>
                    </>
                  )}
                  <button
                    className="ledger-detail-btn"
                    onClick={() => handleViewDetails(party)}
                  >
                    Details
                  </button>
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

export default Ledger;
