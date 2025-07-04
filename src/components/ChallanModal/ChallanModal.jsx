import React, { useState, useEffect } from "react";
import { useModal } from "../contexts/ModalContext";
import { CModal } from "@coreui/react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import { API_BASE_URL } from "../../constants.js";
import { format } from "date-fns";
import { toast } from "react-toastify";

const ChallanModal = () => {
  const { isChallanModalOpen, closeChallanModal } = useModal();
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
    retailer: {
      tpCustomerId: "",
      customerName: "",
    }
  }); // State for the current "To Party" entry
  // State for handling product selection and form fields
  const [products, setProducts] = useState([]); // List of products
  const [selectedProduct, setSelectedProduct] = useState(null); // Selected product
  const [fromParties, setParties] = useState([]); // State for storing the parties list
  const [selectedFromParty, setSelectedFromParty] = useState(null); // State for selected party
  const [toParties, setToParties] = useState([]); // State for storing the parties list

  const [challanDate, setChallanDate] = useState(new Date()); // default to today

  const [isRetailerDifferent, setIsRetailerDifferent] = useState(false);
  const [selectedRetailer, setSelectedRetailer] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchPfCustomersList();
    fetchTpCustomersList();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

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
  };
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

  const closeModal = () => {
    resetFormState();
    // window.location.reload(); //Refresh the page
  };

  const resetFormState = () => {
    setStep("purchase");
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
    setChallanDate(new Date());
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


      if (isRetailerDifferent && selectedRetailer) {
        currentToParty.retailer = {
          tpCustomerId: selectedRetailer.value,
          customerName: selectedRetailer.label,
        };
      } else {
        // by default, toParty is also the retailer
        currentToParty.retailer = {
          tpCustomerId: toParty.value,
          customerName: toParty.label,
        };
      }

      setToPartyEntries([...toPartyEntries, currentToParty]);
      // Reset fields
      setCurrentToParty({
        selectedToParty: {
          tpCustomerId: "",
          customerName: "",
        },
        challanToPartiesRate: "",
        challanToPartiesQty: "",
      });

      setToParty(null);
      setSelectedRetailer(null);
      setIsRetailerDifferent(false);
      setChallanToPartiesQty("");
      setChallanToPartiesRate("");
    } else {
      alert("Please fill out all fields in the To Party form before adding.");
    }
  };

  // Handle product selection change
  const handleProductChange = (selectedOption) => {
    setSelectedProduct(selectedOption); // Set selected product in state
    purchaseForm.pRate = selectedOption.product.productLandingPrice;
  };

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
    <CModal
      visible={isChallanModalOpen}
      onClose={() => {
        closeChallanModal(); // for modal visibility
        closeModal(); // for form reset
      }}
      backdrop="static"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="form-container">
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
                  label: `${product.productBrand} ${product.productName}`,
                  product,
                }))}
                required
                placeholder="Select a Product"
              />
            </div>

            <div className="form-group">
              <Select
                value={selectedFromParty}
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
                  <div className="col-lg-10 d-flex gap-1 px-1">
                    {[240, 360, 400, 500, 600, 610, 700].map((val) => (
                      <label
                        key={val}
                        className={`segment ${Number(purchaseForm.pQty) === val ? "selected" : ""}`}
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
                  <div className="col-lg-2 ml-1">
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
              onClick={() => {
                closeChallanModal();
                closeModal();
              }}
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
              <label className="d-block">
                <input
                  type="checkbox"
                  checked={isRetailerDifferent}
                  onChange={() => setIsRetailerDifferent(!isRetailerDifferent)}
                />{" "}
                Retailer is different
              </label>
            </div>

            {isRetailerDifferent && (
              <div className="form-group">
                <Select
                  value={selectedRetailer}
                  onChange={setSelectedRetailer}
                  options={toParties.map((party) => ({
                    value: party.tpCustomerId,
                    label: party.customerName,
                  }))}
                  placeholder="Select Retailer"
                />
              </div>
            )}
            <div className="row">
              <div className="segmented-container">
                <div className="col-lg-12 d-flex">
                  <div className="col-lg-10 d-flex gap-1 px-1">
                    {[240, 360, 400, 500, 600, 610, 700].map((val) => (
                      <label
                        key={val}
                        className={`segment ${Number(challanToPartiesQty) === val ? "selected" : ""}`}
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
                  <div className="col-lg-2">
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

            <div className="add-to-parties-container">
              <button
                type="button"
                onClick={addToPartyEntry}
                className="btn btn-add"
              >
                Add +
              </button>
              <span className="purchase-qty-info">
                Available Qty:{" "}
                <strong>
                  {purchaseForm.pQty -
                    toPartyEntries.reduce(
                      (sum, entry) => sum + Number(entry.challanToPartiesQty),
                      0
                    )}
                </strong>
              </span>
            </div>

            <div className="to-paries-data-list">
              <hr className="hr-line mt-3" />
              <h7 className="ml-1">To Party Entries</h7>
              <hr className="hr-line" />
              <ul>
                {toPartyEntries.map((entry, index) => (
                  <li className="to-party-entry-item" key={index}>
                    {entry.selectedToParty.customerName},{" "}
                    {entry.challanToPartiesRate}, {entry.challanToPartiesQty}
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
                    (sum, entry) => sum + Number(entry.challanToPartiesQty),
                    0
                  ) !== Number(purchaseForm.pQty)
                }
              >
                Submit
              </button>
              <button
                type="button"
                onClick={() => {
                  closeChallanModal();
                  closeModal();
                }}
                className="btn btn-cancel"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </form>
    </CModal>
  );
};

export default ChallanModal;
