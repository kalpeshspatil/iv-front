import React, { useState, useEffect } from "react";
import "./home.css";
import "react-toastify/dist/ReactToastify.css";
import HomePageSummary from "../HomePageSummary/HomePageSummary.jsx";
import { API_BASE_URL } from "../../constants.js";




export function home() {
    const [modalType, setModalType] = useState(null);
  
  return (
   
    <div className="App">
      <div className="content-wrapper">
        <div className="content p-0">
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
