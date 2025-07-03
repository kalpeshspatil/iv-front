import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../constants.js";
import { FaFilter } from "react-icons/fa";
import Select from "react-select";
import * as XLSX from "xlsx"; // Import xlsx library
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";

const RetailerReport = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatusOfTpCustomer, setFilterStatusOfTpCustomer] = useState({
    value: "ALL",
    label: "ALL",
  });
  const [selectedProductBrand, setSelectedProductBrand] = useState({
    value: "ALL",
    label: "ALL",
  });

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [toParties, setToParties] = useState([]);
  const [products, setProducts] = useState([]);
  const [salesReportData, setSalesReportData] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(null);
  const [retailerName, setRetailerName] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10; // Number of records per page

  useEffect(() => {
    fetchTpCustomersList();
    fetchProducts();
  }, []);

  const fetchTpCustomersList = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tp/customers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setToParties(data);
    } catch (error) {
      console.error("Error fetching to parties:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      // Get unique product brands
      const seenBrands = new Set();
      const uniqueBrandOptions = data
        .filter((product) => {
          if (seenBrands.has(product.productBrand)) return false;
          seenBrands.add(product.productBrand);
          return true;
        })
        .map((product) => ({
          value: product.productBrand,
          label: product.productBrand,
        }));

      // Add "ALL" option
      setProducts([{ value: "ALL", label: "ALL" }, ...uniqueBrandOptions]);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleFilterStatusOfTpCustomer = (selectedOption) => {
    setFilterStatusOfTpCustomer(selectedOption);
  };

  const handleProductChange = (selectedOption) => {
    setSelectedProductBrand(selectedOption);
  };

  const handleGenerate = async () => {
    try {
      const requestBody = {
        retailerId:
          filterStatusOfTpCustomer.value === "ALL"
            ? null
            : filterStatusOfTpCustomer.value,
        productBrand:
          selectedProductBrand?.value === "ALL"
            ? null
            : selectedProductBrand?.value,
        startDate: startDate || null,
        endDate: endDate || null,
      };

      const response = await fetch(
        `${API_BASE_URL}/api/sales/report/retailer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch sales report");
      }

      const data = await response.json();
      if (data.salesReportList.length > 0) {
        setRetailerName(data.salesReportList[0].retailerName || null);
      } else {
        setRetailerName(null);
      }
      setSalesReportData(data.salesReportList);
      setTotalQuantity(data.totalQuantityOfRetailer); // <- Set this line
      setCurrentPage(1); // Reset to first page when new data comes
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  // Pagination Calculations
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = salesReportData.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(salesReportData.length / recordsPerPage);

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  // Export to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(salesReportData); // Convert JSON data to worksheet
    const wb = XLSX.utils.book_new(); // Create new workbook
    XLSX.utils.book_append_sheet(wb, ws, "Sales Report"); // Append sheet to workbook
    XLSX.writeFile(wb, "sales_report.xlsx"); // Write file
  };

  return (
    <div className="ledger-container p-0">
      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn btn-outline-secondary"
          onClick={() => setShowFilters((prev) => !prev)}
        >
          <FaFilter className="me-2" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {showFilters && (
        <div className="card p-3 mb-4 shadow-sm">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Retailer</label>
              <Select
                value={filterStatusOfTpCustomer}
                onChange={handleFilterStatusOfTpCustomer}
                options={[
                  { value: "ALL", label: "ALL" },
                  ...toParties.map((party) => ({
                    value: party.tpCustomerId,
                    label: party.customerName,
                  })),
                ]}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Brand</label>
              <Select
                value={selectedProductBrand}
                onChange={handleProductChange}
                options={products}
                required
                placeholder="Select a Product"
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="col-md-2 d-flex flex-column">
              <div className="flex-grow-1"></div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleGenerate}
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      )}

      {totalQuantity !== null && retailerName && (
        <div className="mb-2">
          <strong>{retailerName}</strong> sold a total of{" "}
          <strong>{totalQuantity}</strong> units
        </div>
      )}

      <table className="ledger-table table table-bordered">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Date</th>
            <th>Quantity</th>
            <th>Purchase Rate</th>
            <th>Sale Rate</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No records found.
              </td>
            </tr>
          ) : (
            currentRecords.map((item, index) => (
              <tr key={index}>
                <td>{item.tpCustomerName}</td>
                <td>{item.saleDate}</td>
                <td>{item.quantity}</td>
                <td>{item.purchaseBillingRate}</td>
                <td>{item.saleBillingRate}</td>
                <td>{item.totalAmount}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination Controls with Page Numbers */}
      {salesReportData.length > recordsPerPage && (
        <div className="d-flex justify-content-between align-items-center mt-4 gap-2 pagination">
          {/* Pagination at Left */}
          <div className="d-flex">
            <button
              className="btn btn-sm btn-outline-secondary pagination-small-btn"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  className={`btn btn-sm ${currentPage === page ? "btn-primary pagination-small-btn" : "btn-outline-primary pagination-small-btn"}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              )
            )}

            <button
              className="btn btn-sm btn-outline-secondary pagination-small-btn"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>

          {/* Export Button at Right */}
          <div>
            <button
              className="btn btn-sm btn-outline-success"
              onClick={exportToExcel}
            >
              <PiMicrosoftExcelLogoFill className="me-2" />
              Export to Excel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RetailerReport;
