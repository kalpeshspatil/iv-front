import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dispatch.css";
import pendingImg from "../../assets/images/pending.png";
import completedImg from "../../assets/images/completed.png";
import inProgressImg from "../../assets/images/inprogress.png";
import deliveredImg from "../../assets/images/delivered.png";
import cancelledImg from "../../assets/images/cancelled.png";
import pdfExportImg from "../../assets/images/pdf.png";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { API_BASE_URL } from "../../constants.js";  
import { FaEdit, FaCheck } from "react-icons/fa";
import { FaFilter } from "react-icons/fa"; // For filter icon

const Dispatch = () => {
  const [challans, setChallans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null); // Track the dropdown ID that's open
  const [filterStatus, setFilterStatus] = useState("PENDING"); // Default to show all
  const [startDate, setStartDate] = useState(""); // Start date for filter
  const [endDate, setEndDate] = useState(""); // End date for filter
  const navigate = useNavigate();
  const [editingIndex, setEditingIndex] = useState(null);
  const [updatedVehicleNumber, setUpdatedVehicleNumber] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchChallanData();
  }, []);

  const handleEdit = (challan) => {
    setEditingIndex(challan.challanId);
    setUpdatedVehicleNumber(challan.vehicleNumber || ""); // handle null/undefined
  };

  const handleSave = (challan) => {
    const updatedChallanList = challans.map((c) => {
      if (c.challanId === challan.challanId) {
        return { ...c, vehicleNumber: updatedVehicleNumber }; // update only the one
      }
      return c;
    });
  
    setChallans(updatedChallanList); // Trigger proper re-render
    updateChallan({ ...challan, vehicleNumber: updatedVehicleNumber });
    setEditingIndex(null);
  };

  const toggleDropdown = (partyId) => {
    setOpenDropdownId(openDropdownId === partyId ? null : partyId); // Toggle the dropdown for the clicked party
  };

  const matchPurchaseAndToQty = (challan) => {
    // Filter parties where status is "DELIVERED"
    const deliveredParties = challan.challanToParties.filter(
      (party) => party.orderStatus === "DELIVERED"
    );

    const totalToPartyQty = deliveredParties.reduce(
      (total, party) => total + Number(party.challanToPartiesQty),
      0
    );

    const purchaseQty = Number(challan.purchaseFromQuantity);
    console.log("Total:", totalToPartyQty, "Purchase Qty:", purchaseQty);

    // Return if the process is completed for this challan
    return totalToPartyQty === purchaseQty;
  };

  const fetchChallanData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/challan`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setChallans(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // API call to mark Challan as Completed

  const handleStatusChange = async (partyId, status, challanId) => {
    console.log(`Changing status of party ID ${partyId} to ${status}`);

    try {
      // Step 1: Update single toParty status via API
      const response = await fetch(
        `${API_BASE_URL}/api/challanToParties/updateStatus`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pkId: partyId,
            orderStatus: status, // Pass the updated status
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Status updated successfully", data);

      // Step 2: Update local state optimistically for the single party
      setChallans((prevChallans) => {
        return prevChallans.map((challan) => {
          if (challan.challanId === challanId) {
            const updatedParties = challan.challanToParties.map((party) =>
              party.pkId === partyId ? { ...party, orderStatus: status } : party
            );

            // Step 3: Check if all parties are now "DELIVERED"
            const allDelivered = updatedParties.every(
              (party) => party.orderStatus === "DELIVERED"
            );

            // Step 4: Check if at least ONE is NOT delivered (CANCELLED/PENDING)
            const anyNotDelivered = updatedParties.some(
              (party) => party.orderStatus !== "DELIVERED"
            );

            // If ALL are delivered, update challan to COMPLETED
            if (allDelivered) {
              updateChallanStatus(challanId, status);
            }
            // If any is PENDING or CANCELLED, update challan to IN PROGRESS
            else if (anyNotDelivered) {
              updateChallanStatus(challanId, status);
            }

            return {
              ...challan,
              challanToParties: updatedParties,
              challanStatus: allDelivered ? "DELIVERED" : "PENDING", // ✅ Update challan status in state
            };
          }
          return challan;
        });
      });

      setOpenDropdownId(null); // Close the dropdown after selection
    } catch (error) {
      setError(error.message);
    }
  };

  const updateChallan = async (challan) => {
    try {
      challan.vehicleNumber = updatedVehicleNumber;
      const response = await fetch(`${API_BASE_URL}/api/challan`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(challan),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update challan");
      }
  
      const data = await response.json();
      console.log("Challan updated:", data);
    } catch (error) {
      console.error("Error updating challan:", error);
    }
  };


  const updateChallanStatus = async (challanId, status) => {
    try {
      if (status != "DELIVERED") {
        status = "PENDING";
      }
      const response = await fetch(
        `${API_BASE_URL}/api/challan/updateStatus`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            challanId: challanId,
            status: status,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update challan status");
      }

      const data = await response.json();
      console.log(`Challan ${challanId} marked as DELIVERED`, data);

      // Update state to reflect the new status
      setChallans((prevChallans) =>
        prevChallans.map((challan) =>
          challan.challanId === challanId
            ? {
                ...challan,
                status: status,
                orderDeliveryDate: data.orderDeliveryDate,
              }
            : challan
        )
      );
    } catch (error) {
      console.error("Error updating challan status:", error);
    }
  };

  const getChallanStatusIcon = (challan) => {
    return challan.challanStatus === "DELIVERED" ? completedImg : inProgressImg;
  };

  // Filter logic

  const exportPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Challan Report", 14, 15);

    // Define table columns
    const columns = [
      "ID",
      "Vehicle No",
      "Order Date",
      "Product",
      "Purchase From",
      "Delivery Date",
      "To Party",
      "To Party Qty",
      "To Party Rate",
      "Status",
    ];

    // Prepare data for the table
    let rows = [];

    filteredChallans.forEach((challan) => {
      if (challan.challanToParties.length > 0) {
        challan.challanToParties.forEach((party, index) => {
          rows.push([
            index === 0 ? challan.challanId : "", // Show challan ID only once
            index === 0 ? challan.vehicleNumber : "",
            index === 0
              ? new Date(challan.orderPlacedDate).toLocaleDateString("en-CA")
              : "",
            index === 0 ? challan.product.productName : "",
            index === 0 ? challan.purchaseFrom.pfCustomerName : "",
            index === 0
              ? challan.orderDeliveryDate
                ? challan.orderDeliveryDate.substring(0, 10)
                : "N/A"
              : "",
            party.selectedToParty.customerName, // To Party Name
            party.challanToPartiesQty, // To Party Quantity
            party.challanToPartiesRate, // To Party Rate
            party.orderStatus, // Status
          ]);
        });
      } else {
        // If no To Parties, add a single row for the Challan
        rows.push([
          challan.challanId,
          challan.vehicleNumber,
          new Date(challan.orderPlacedDate).toLocaleDateString("en-CA"),
          challan.product.productName,
          challan.purchaseFrom.pfCustomerName,
          challan.orderDeliveryDate
            ? challan.orderDeliveryDate.substring(0, 10)
            : "N/A",
          "N/A", // No To Party
          "N/A",
          "N/A",
          challan.status || "IN PROGRESS",
        ]);
      }
    });

    // Auto-table generation
    doc.autoTable({
      startY: 25, // Position after the title
      head: [columns],
      body: rows,
      styles: { fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 20 }, // Challan ID
        1: { cellWidth: 25 }, // Vehicle No
        2: { cellWidth: 25 }, // Order Date
        3: { cellWidth: 30 }, // Product
        4: { cellWidth: 30 }, // Purchase From
        5: { cellWidth: 25 }, // Delivery Date
        6: { cellWidth: 30 }, // To Party Name
        7: { cellWidth: 15 }, // To Party Quantity
        8: { cellWidth: 15 }, // To Party Rate
        9: { cellWidth: 20 }, // Status
      },
    });

    // Save the PDF
    doc.save("Challan_Report.pdf");
  };

  // Filter logic with date range
  const filteredChallans = challans
    .filter((challan) => {
      const toParties = challan.challanToParties || [];
      const orderDate = new Date(challan.orderPlacedDate);

      // Check status filter
      if (filterStatus === "PENDING") {
        return toParties.some((party) => party.orderStatus === "PENDING");
      }
      if (filterStatus === "DELIVERED") {
        return (
          toParties.length > 0 &&
          toParties.every((party) => party.orderStatus === "DELIVERED")
        );
      }
      return true;
    })
    .filter((challan) => {
      // Check date range filter
      if (
        startDate &&
        new Date(challan.orderPlacedDate) < new Date(startDate)
      ) {
        return false;
      }
      if (endDate && new Date(challan.orderPlacedDate) > new Date(endDate)) {
        return false;
      }
      return true; // Show all if no filter criteria is matched
    });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container p-0">


      {/* Toggle Button */}
      <div className="container mb-2 d-flex justify-content-end pt-0">
        <button
          className="btn btn-outline-primary d-flex align-items-center"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter className="me-2" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Collapsible Filters Section */}
      {showFilters && (
        <div className="container mb-4 mt-2">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="row g-3 align-items-end">
                {/* Payment Status Filter */}
                <div className="col-sm-3">
                  <label htmlFor="filterStatus" className="form-label fw-semibold">
                    Payment Status
                  </label>
                  <select
                    id="filterStatus"
                    className="form-select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="ALL">All</option>
                    <option value="PENDING">Pending</option>
                    <option value="DELIVERED">Delivered</option>
                  </select>
                </div>

                {/* Start Date Filter */}
                <div className="col-sm-3">
                  <label htmlFor="startDate" className="form-label fw-semibold">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    className="form-control"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                {/* End Date Filter */}
                <div className="col-sm-3">
                  <label htmlFor="endDate" className="form-label fw-semibold">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    className="form-control"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>

                {/* PDF Export Button */}
                <div className="col-sm-3 d-flex align-items-center mt-3 mt-sm-0">
                  <button
                    className="btn btn-danger d-flex align-items-center justify-content-center"
                    onClick={exportPDF}
                  >
                    <img
                      src={pdfExportImg}
                      alt="pdfExport"
                      className="me-2"
                      style={{ width: "18px", height: "18px" }}
                    />
                    
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
   


      {filteredChallans.map((challan) => {
        const isCompleted = matchPurchaseAndToQty(challan); // Calculate status for each challan

        return (
          <div key={challan.challanId} className="challan-card">
            <div className="challan-header">
              {/* Left side */}
              <div className="challan-header-left">
                <p>
                  Challan: <strong> {challan.challanId}</strong>
                </p>
                <p>
  Veh No:
  <strong>
    {editingIndex === challan.challanId ? (
      <>
        <input
          type="text"
          value={updatedVehicleNumber}
          onChange={(e) => setUpdatedVehicleNumber(e.target.value)}
          className="vehicle-input"
        />
        <button className="btn small-btn" onClick={() => handleSave(challan)}>
          <FaCheck className="save-icon" />
        </button>
      </>
    ) : (
      <>
        {challan.vehicleNumber || "N/A"}{" "}
        <button
          className="btn small-btn"
          onClick={() => handleEdit(challan)}
        >
          <FaEdit className="edit-icon" />
        </button>
      </>
    )}
  </strong>
</p>
                <p>
                  Order Date:
                  <strong>
                    {" "}
                    {new Date(challan.orderPlacedDate).toLocaleDateString(
                      "en-CA"
                    )}
                  </strong>
                </p>
              </div>

              {/* Right side */}
              <div className="challan-header-right">
                <p>
                  Purchase:
                  <strong> {challan.purchaseFrom.pfCustomerName}</strong>
                </p>
                <p>
                  Product:<strong> {challan.product.productName}</strong>
                </p>
                <p>
                  Delivery Date:
                  <strong>
                    {" "}
                    {challan.orderDeliveryDate
                      ? challan.orderDeliveryDate.substring(0, 10)
                      : "N/A"}
                  </strong>
                </p>
              </div>

              {/* Status Icon at Right-Top */}
              <div className="challan-status-icon">
                <img
                  src={getChallanStatusIcon(challan)}
                  alt="Challan Status"
                  className="challan-status-icon"
                />
              </div>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Party Name</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {challan.challanToParties.map((party) => (
                    <tr key={party.pkId}>
                      <td>{party.selectedToParty.customerName}</td>
                      <td>{party.challanToPartiesQty}</td>
                      <td>{party.challanToPartiesRate}</td>
                      <td>
                        {party.orderStatus === "PENDING" && (
                          <img
                            src={pendingImg}
                            alt="Pending"
                            className="status-icon"
                          />
                        )}
                        {party.orderStatus === "DELIVERED" && (
                          <img
                            src={deliveredImg}
                            alt="Delivered"
                            className="status-icon"
                          />
                        )}
                        {party.orderStatus === "CANCELLED" && (
                          <img
                            src={cancelledImg}
                            alt="Cancelled"
                            className="status-icon"
                          />
                        )}
                      </td>
                      <td>
                              <button
                                className="bg-success"
                                onClick={() =>
                                  handleStatusChange(
                                    party.pkId,
                                    "DELIVERED",
                                    challan.challanId
                                  )
                                }
                              >
                                D
                              </button>
                              <button
                                className="bg-warning"
                                onClick={() =>
                                  handleStatusChange(
                                    party.pkId,
                                    "PENDING",
                                    challan.challanId
                                  )
                                }
                              >
                                P
                              </button>
                              <button
                                className="bg-danger"
                                onClick={() =>
                                  handleStatusChange(
                                    party.pkId,
                                    "CANCELLED",
                                    challan.challanId
                                  )
                                }
                              >
                                C
                              </button>
                       
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Dispatch;
