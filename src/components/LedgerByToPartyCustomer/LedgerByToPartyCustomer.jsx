import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { API_BASE_URL } from "../../constants.js";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import {
  CCard,
  CCardBody,
  CHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";

const LedgerByToPartyCustomer = () => {
  const { customerId } = useParams();
  const [toPartyLedger, setToPartyLedger] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const customerName = location.state?.customerName;
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10; // You can adjust this
  const totalPages = Math.ceil(toPartyLedger.length / recordsPerPage);

  const outstandingBalance =
    toPartyLedger.length > 0 ? toPartyLedger[0].balance : 0;

  useEffect(() => {
    fetchToPartiesLedger();
  }, [customerId]);

  const fetchToPartiesLedger = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/challanToParties/ledger/` + customerId,
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

      // Sort by date descending (latest first)
      const sortedData = data.sort((a, b) => {
        return b.id - a.id; // descending by ID
      });
      setToPartyLedger(sortedData);
      setCurrentPage(1);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Pagination calculations
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = toPartyLedger.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(toPartyLedger);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ledger");
    XLSX.writeFile(workbook, `Customer_Ledger_${customerName}.xlsx`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="ledger-container">
      <CCard>
        <CHeader className="bg-white p-4 border-b d-block">
          <div className="flex-col sm:flex-row items-center justify-between w-full">
            {/* Ledger Title Centered */}
            <div className="flex-1 text-center sm:text-left">
              <h5 className="text-2xl font-semibold">Customer Ledger</h5>
            </div>

            {/* Balance Info Aligned Right */}
            <div className="col-sm-12">
              <div className="col-sm-6">
                <div className="col-sm-12 d-flex">
                  <div className="col-sm-4">
                    <div className="text-sm text-left mt-3 sm:mt-0 sm:ml-4">
                      <div>
                        <span className="font-medium">
                          <b>Customer Name</b>
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">
                          <b>Outstanding Balance</b>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="text-sm text-right mt-3 sm:mt-0 sm:ml-4">
                      <div>
                        <span className="font-medium">: {customerName}</span>
                      </div>
                      <div>
                        <span className="font-medium">
                          : ₹ {outstandingBalance}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CHeader>

        <CCardBody>
          <CTable align="middle" className="mb-0 border" hover responsive>
            <CTableHead className="text-nowrap">
              <CTableRow>
                <CTableHeaderCell className="bg-body-tertiary">
                  Date
                </CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary">
                  Particular
                </CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary">
                  Debit
                </CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary">
                  Credit
                </CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary">
                  Balance
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {currentRecords.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{item.date}</CTableDataCell>
                  <CTableDataCell>{item.particular}</CTableDataCell>
                  <CTableDataCell>{item.debit}</CTableDataCell>
                  <CTableDataCell>{item.credit}</CTableDataCell>
                  <CTableDataCell>{item.balance}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>

          {/* Pagination and Export Button */}
          {toPartyLedger.length > recordsPerPage && (
            <div className="d-flex justify-content-between align-items-center mt-4 gap-2">
              {/* Pagination (only if needed) */}
              {totalPages > 1 && (
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>

                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((page) => (
                    <button
                      key={page}
                      className={`btn btn-sm ${currentPage === page ? "btn-primary" : "btn-outline-primary"}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}

              {/* Export Button (always visible) */}
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
        </CCardBody>
      </CCard>
    </div>
  );
};

export default LedgerByToPartyCustomer;
