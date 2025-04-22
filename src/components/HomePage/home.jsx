import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import "./home.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomePageSummary from "../HomePageSummary/HomePageSummary.jsx";
import { API_BASE_URL } from "../../constants.js";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { ImSwitch } from "react-icons/im";
import AppBreadcrumb from "../AppLayout/AppBreadcrumb.jsx";


export function home() {
  const [modalType, setModalType] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [productName, setProductName] = useState("");
  const [productBrand, setProductBrand] = useState("");
  const [product, setProduct] = useState("");
  const [purchaseFrom, setPFrom] = useState("");
  const [pRate, setPRate] = useState("");
  const [pQty, setPQty] = useState("400");
  const [pVehicle, setPVehicle] = useState("");
  const [toParty, setToParty] = useState(null);
  const [challanToPartiesRate, setChallanToPartiesRate] = useState("");
  const [challanToPartiesQty, setChallanToPartiesQty] = useState("");
  const [step, setStep] = useState("purchase"); // Tracks current step: "purchase" or "toParty"
  const [purchaseForm, setPurchaseForm] = useState({
    product: "",
    purchaseFrom: "",
    pRate: "",
    pQty: 0,
    pVehicle: "",
  }); // State for Purchase From Form
  const [toPartyEntries, setToPartyEntries] = useState([]); // List of "To Party" entries
  const [currentToParty, setCurrentToParty] = useState({
    selectedToParty: {
      tpCustomerId: "",
      customerName: "",
    },
    challanToPartiesRate: "",
    challanToPartiesQty: 0,
  }); // State for the current "To Party" entry
  // State for handling product selection and form fields
  const [products, setProducts] = useState([]); // List of products
  const [selectedProduct, setSelectedProduct] = useState(null); // Selected product
  const [fromParties, setParties] = useState([]); // State for storing the parties list
  const [selectedFromParty, setSelectedFromParty] = useState(null); // State for selected party
  const [toParties, setToParties] = useState([]); // State for storing the parties list
  const [selectedToParty, setSelectedToParty] = useState(null); // State for selected party
  const [homePageStats, setHomePageStats] = useState({
    a1Outstanding: null,
    accOutstanding: null,
    shaktiOutstanding: null,
    totalOutstanding: null,
    totalSaleOfA1: null,
    totalSaleOfAcc: null,
    totalSaleOfShakti: null,
    noOfDuePayments: null,
    totalSale: null,
  });
  const [challanDate, setChallanDate] = useState(new Date()); // default to today

  //const [quantity, setQuantity] = useState("400"); // Default selected value

  const handleQuantityChange = (event) => {
    setPQty(event.target.value);
  };

  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`, {
        method: "GET", // Method is GET by default, so it's optional here
        headers: {
          "Content-Type": "application/json", // This is typically included for APIs that return JSON
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json(); // Parsing the JSON data from the response
      setProducts(data); // Set the product data in the state
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  const fetchPfCustomersList = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/pf/customers`, {
        method: "GET", // Method is GET by default, so it's optional here
        headers: {
          "Content-Type": "application/json", // This is typically included for APIs that return JSON
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json(); // Parsing the JSON data from the response
      setParties(data); // Set the product data in the state
    } catch (error) {
      console.error("Error fetching parties:", error);
    }
  };

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

  const openModal = (type) => {
    setModalType(type);
    setStep("purchase");
    if (type === "Challan") {
      fetchProducts(); // Fetch products when opening Challan modal
      fetchPfCustomersList(); // Fetch pfPartyList when opening Challan modal
      fetchTpCustomersList();
    }
  };

  const closeModal = () => {
    setModalType(null);
    // Reset form fields
    setCustomerName("");
    setProductName("");
    setProductBrand("");
    setProduct("");
    setPFrom("");
    setPRate("");
    setPQty("");
    setPVehicle("");
    setToParty("");
    setChallanToPartiesRate("");
    setChallanToPartiesQty("");
    setPurchaseForm({ purchaseFrom: "", pRate: "", pQty: "", pVehicle: "" });
    setToPartyEntries([]);
    setCurrentToParty({
      selectedToParty: {
        tpCustomerId: "",
        customerName: "",
      },
      challanToPartiesRate: "",
      challanToPartiesQty: "",
    });
    setSelectedFromParty(""); // Reset From Party on closing modal
    setSelectedProduct("");
    setSelectedToParty("");
  };

  const handlePurchaseChange = (e) => {
    setPurchaseForm({
      ...purchaseForm,
      [e.target.name]: e.target.value,
      product: selectedProduct,
      purchaseFrom: selectedFromParty,
    });
  };

  const handleToPartyChange = (e) => {
    debugger;
    if (e.target.name == "challanToPartiesQty") {
      setChallanToPartiesQty(e.target.value);
    } else if (e.target.name == "challanToPartiesRate") {
      setChallanToPartiesRate(e.target.value);
    }
    if (
      e.target.name === "challanToPartiesQty" ||
      e.target.name === "challanToPartiesRate"
    ) {
      setCurrentToParty({
        ...currentToParty,
        [e.target.name]: e.target.value,
        selectedToParty: {
          tpCustomerId: toParty?.value,
          customerName: toParty?.label,
        },
      });
    }
  };

  const addToPartyEntry = () => {
    if (toParty && challanToPartiesRate && challanToPartiesQty) {
      const totalAssignedQty = toPartyEntries.reduce(
        (sum, entry) => sum + Number(entry.challanToPartiesQty),
        0
      );

      const remainingQty = purchaseForm.pQty - totalAssignedQty;

      if (Number(challanToPartiesQty) > remainingQty) {
        alert(`Cannot add. Available quantity is only ${remainingQty}.`);
        return;
      }

      setToPartyEntries([...toPartyEntries, currentToParty]);
      setCurrentToParty({
        selectedToParty: "",
        challanToPartiesRate: "",
        challanToPartiesQty: "",
      });

      setToParty(null);
      setChallanToPartiesQty("");
      setChallanToPartiesRate("");
    } else {
      alert("Please fill out all fields in the To Party form before adding.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (modalType === "PForm" || modalType === "ToParty") {
      console.log("Customer Name:", customerName);
    } else if (modalType === "ProductForm") {
      console.log("Product Name:", productName);
      console.log("Product Brand:", productBrand);
    } else if (modalType === "Challan") {
      console.log("Product:", product);
      console.log("P From:", purchaseFrom);
      console.log("Rate (P From):", pRate);
      console.log("Qty (P From):", pQty);
      console.log("Vehicle Number (P From):", pVehicle);
      console.log("To Party:", toParty);
      console.log("Rate (To Party):", challanToPartiesRate);
      console.log("Qty (To Party):", challanToPartiesQty);

      // Calculate total ToParty quantity
      const totalToPartyQty = toPartyEntries.reduce(
        (sum, entry) => sum + Number(entry.challanToPartiesQty),
        0
      );

      // Check if the total quantity matches the purchase quantity
      if (totalToPartyQty !== Number(purchaseForm.pQty)) {
        alert(`Cannot add, Purchase and sell quantity does not match.`);
        return; // Stop submission if the quantities do not match
      }

      const formattedDate = format(challanDate, "yyyy-MM-dd");

      const finalData = {
        orderPlacedDate: formattedDate,
        product: {
          productId: purchaseForm.product.value,
          productName: purchaseForm.product.label,
        },
        purchaseFrom: {
          pfCustomerId: purchaseForm.purchaseFrom.value,
          pfCustomerName: purchaseForm.purchaseFrom.label,
        },
        challanToParties: toPartyEntries,
        purchaseFromRate: purchaseForm.pRate,
        purchaseFromQuantity: purchaseForm.pQty,
        vehicleNumber: purchaseForm.pVehicle,
      };

      fetch(`${API_BASE_URL}/api/challan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData), // Convert the JavaScript object to JSON
      })
        .then((response) => {
          if (!response.ok) {
            alert("Something went wrong, challan not submitted");
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json(); // Parse JSON only if response is OK
        })
        .then((data) => {
          console.log("Success:", data);
          toast.success("Entry added successfully!", {
            position: "top-right",
            autoClose: 3000,
          });
          closeModal(); // Now it only runs on success
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };
  // const finalData = { purchaseForm, toPartyEntries };

  // Handle product selection change
  const handleProductChange = (selectedOption) => {
    setSelectedProduct(selectedOption); // Set selected product in state
    debugger
    purchaseForm.pRate = selectedOption.product.productLandingPrice;
  };

  // Handle product selection change
  const handleFromPartyChange = (selectedOption) => {
    setSelectedFromParty(selectedOption);
    // Store the whole object, not just value
  };

  // Handle product selection change
  const handleToPartyDropdownChange = (selectedOption) => {
    setToParty(selectedOption);
  };

  const validatePurchaseForm = () => {
    return (
      purchaseForm.purchaseFrom !== "" &&
      purchaseForm.pRate !== "" &&
      purchaseForm.pQty !== "" &&
      selectedFromParty !== "" &&
      selectedProduct !== ""
    );
  };

  return (
   
    <div className="App">
      <AppBreadcrumb> </AppBreadcrumb>
      <div className="row menubar">
        <div className="col-sm-12">
          <div className="col-sm-6 offset-sm-3">
            <div className="button-container">
              <button onClick={() => openModal("Challan")}>Challan</button>
              <button onClick={() => navigate("/dispatch")}>Dispatch</button>
              <button onClick={() => navigate("/ledger")}>Ledger</button>
              {/* <button onClick={() => openModal('PForm')}>P-Form</button>
      <button onClick={() => openModal('ToParty')}>To Party</button>
      <button onClick={() => openModal('ProductForm')}>Product</button> */}
            </div>
          </div>
          <div className="col-sm-3">
            <div className="home-container">
              <button className="logout-btn" onClick={handleLogout}>
              <ImSwitch />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0 text-dark">Dashboard </h1>
              </div>
              <div className="col-sm-6">
                
              </div>
            </div>
          </div>
        </div>
        <div className="content">
          <div className="container-fluid">
          <HomePageSummary> </HomePageSummary>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalType && (
        <div className="modal">
          <div className="modal-content">
            <h3>
              {modalType === "PForm" && "P-Form Registration"}
              {modalType === "ToParty" && "To Party Registration"}
              {modalType === "ProductForm" && "Product Registration"}
              {modalType === "Challan" && "Challan"}
            </h3>

            <form onSubmit={handleSubmit} className="form-container">
              {/* Customer Name Form for P-Form and To Party */}
              {(modalType === "PForm" || modalType === "ToParty") && (
                <div className="form-group">
                  <label>
                    Customer Name:
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      className="form-input"
                    />
                  </label>
                </div>
              )}

              {/* Product Form */}
              {modalType === "ProductForm" && (
                <>
                  <div className="form-group">
                    <label>
                      Product Name:
                      <input
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                        className="form-input"
                      />
                    </label>
                  </div>
                  <div className="form-group">
                    <label>
                      Product Brand:
                      <input
                        type="text"
                        value={productBrand}
                        onChange={(e) => setProductBrand(e.target.value)}
                        required
                        className="form-input"
                      />
                    </label>
                  </div>
                </>
              )}
              {/* Challan Form */}
              {/* Challan Form */}
              {modalType === "Challan" && (
                <div className="modal">
                  <div className="modal-content">
                    {/* <form onSubmit={handleSubmit}> */}
                    {step === "purchase" && (
                      <>
                        <h4>Purchase From</h4>
                        <div className="form-group">
                          <DatePicker
                            selected={challanDate}
                            onChange={(date) => setChallanDate(date)}
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            id="challanDate"
                            name="challanDate"
                          />
                        </div>
                        <div className="form-group">
                          <Select
                            value={selectedProduct}
                            onChange={handleProductChange}
                            options={products.map((product) => ({
                              value: product.productId,
                              label:
                                product.productBrand +
                                " " +
                                product.productName,
                                product,
                            }))}
                            required
                            placeholder="Select a Product"
                          />
                        </div>
                        <div className="form-group">
                          <Select
                            value={selectedFromParty} // Pass the entire object
                            onChange={handleFromPartyChange}
                            options={fromParties.map((party) => ({
                              value: party.pfCustomerId,
                              label: party.pfCustomerName,
                            }))}
                            required
                            placeholder="Select a From Party"
                          />
                        </div>

                        <div className="row">
                          <div className="segmented-container">
                            <div className="col-lg-12 d-flex">
                              <div className="col-lg-6 d-flex gap-1 px-1">
                                {[240, 360, 400, 600].map((val) => (
                                  <label
                                    key={val}
                                    className={`segment ${
                                      Number(purchaseForm.pQty) === val
                                        ? `selected`
                                        : ""
                                    }`}
                                  >
                                    <input
                                      type="radio"
                                      name="pQty"
                                      value={val}
                                      checked={purchaseForm.pQty === val}
                                      onChange={handlePurchaseChange}
                                    />
                                    {val}
                                  </label>
                                ))}
                              </div>
                              <div className="col-lg-6 ml-1">
                                <input
                                  type="number"
                                  placeholder="Custom"
                                  name="pQty"
                                  value={purchaseForm.pQty}
                                  onChange={handlePurchaseChange}
                                  className="form-input"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-lg-12 flex">
                            <div className="col-lg-6 px-1">
                              <div className="form-group">
                                <input
                                  type="number"
                                  name="pRate"
                                  placeholder="Enter Rate"
                                  step="0.01"
                                  value={purchaseForm.pRate}
                                  onChange={handlePurchaseChange}
                                  required
                                  className="form-input"
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 px-1">
                              <div className="form-group">
                                <input
                                  type="text"
                                  name="pVehicle"
                                  placeholder="Enter Vehicle Number"
                                  value={purchaseForm.pVehicle}
                                  onChange={handlePurchaseChange}
                                  required
                                  className="form-input"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setStep("toParty")}
                          disabled={!validatePurchaseForm()}
                          className="btn btn-next"
                        >
                          Next: To Party
                        </button>
                        <button
                          type="button"
                          onClick={closeModal}
                          className="btn btn-cancel"
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {step === "toParty" && (
                      <>
                        <h4>To Party</h4>
                        <div className="form-group">
                          <Select
                            value={toParty}
                            onChange={handleToPartyDropdownChange}
                            options={toParties.map((party) => ({
                              value: party.tpCustomerId,
                              label: party.customerName,
                            }))}
                            placeholder="Select a To Party"
                          />
                        </div>
                        <div className="form-group">
                          <input
                            type="number"
                            name="challanToPartiesRate"
                            placeholder="Enter Rate"
                            step="0.01"
                            value={challanToPartiesRate}
                            onChange={handleToPartyChange}
                            className="form-input"
                          />
                        </div>

                        <div className="row">
                          <div className="segmented-container">
                            <div className="col-lg-12 d-flex">
                              <div className="col-lg-6 d-flex gap-1 px-1">
                                {[240, 360, 400, 600].map((val) => (
                                  <label
                                    key={val}
                                    className={`segment ${
                                      Number(challanToPartiesQty) === val
                                        ? "selected"
                                        : ""
                                    }`}
                                  >
                                    <input
                                      type="radio"
                                      name="challanToPartiesQty"
                                      value={val}
                                      checked={purchaseForm.pQty === val}
                                      onChange={handleToPartyChange}
                                    />
                                    {val}
                                  </label>
                                ))}
                              </div>
                              <div className="col-lg-6">
                                <input
                                  type="number"
                                  placeholder="Custom"
                                  name="challanToPartiesQty"
                                  value={challanToPartiesQty}
                                  onChange={handleToPartyChange}
                                  className="form-input"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="add-to-parties-container">
                          <button
                            type="button"
                            onClick={addToPartyEntry}
                            className="btn btn-add"
                          >
                            Add +
                          </button>
                          {/* Display Purchase Quantity */}
                          <span className="purchase-qty-info">
                            Available Qty:{" "}
                            <strong>
                              {purchaseForm.pQty -
                                toPartyEntries.reduce(
                                  (sum, entry) =>
                                    sum + Number(entry.challanToPartiesQty),
                                  0
                                )}
                            </strong>
                          </span>
                        </div>
                        <div className="to-paries-data-list">
                          <hr className="hr-line mt-3"></hr>
                          <h7 className="ml-1">To Party Entries</h7>
                          <hr className="hr-line"></hr>
                          <ul>
                            {toPartyEntries.map((entry, index) => (
                              <li className="to-party-entry-item" key={index}>
                                {entry.selectedToParty.customerName},{" "}
                                {entry.challanToPartiesRate},{" "}
                                {entry.challanToPartiesQty}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="form-actions">
                          <button
                            type="button"
                            onClick={() => setStep("purchase")}
                            className="btn btn-back"
                          >
                            Back to Purchase
                          </button>
                          <button
                            type="submit"
                            className="btn btn-submit"
                            disabled={
                              toPartyEntries.reduce(
                                (sum, entry) =>
                                  sum + Number(entry.challanToPartiesQty),
                                0
                              ) !== Number(purchaseForm.pQty)
                            }
                          >
                            Submit
                          </button>
                          <button
                            type="button"
                            onClick={closeModal}
                            className="btn btn-cancel"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    )}
                    {/* </form> */}
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="modal-actions">
                <button type="submit" className="btn btn-submit">
                  Submit
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn btn-cancel"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default home;
