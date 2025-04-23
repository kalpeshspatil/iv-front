import { useEffect, useState } from "react";
import { useParams, useLocation  } from "react-router-dom";
import { API_BASE_URL } from "../../constants.js";  
import { useNavigate } from "react-router-dom";
import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CHeader,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow
} from '@coreui/react';
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'



const LedgerByToPartyCustomer = () => {

    const { customerId } = useParams();
    const [toPartyLedger, setToPartyLedger] = useState([]);
     const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const location = useLocation();
const customerName = location.state?.customerName;
  const navigate = useNavigate();


    useEffect(() => {
        fetchToPartiesLedger();
      }, [customerId]);

   // Fetch To Parties Data
    const fetchToPartiesLedger = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/challanToParties/ledger/`+customerId, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
  
        const data = await response.json();
        setToPartyLedger(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;


return (
    <div className="ledger-container">
   
     {/* Headline Section */}
  


  {/* Filters Section */}
  {/* <div className="filters-container">

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
  </div> */}
<CCard>
<CHeader className="bg-white p-4 border-b d-block">
  <div className="flex flex-col sm:flex-row items-center justify-between w-full">
    
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
      <div><span className="font-medium"><b>Customer Name </b></span> </div>
      <div><span className="font-medium"><b>Outstanding Balance </b></span></div>
    </div>
          </div>
          <div className="col-sm-4">
          <div className="text-sm text-right mt-3 sm:mt-0 sm:ml-4">
      <div><span className="font-medium">:   {customerName}</span> </div>
      <div><span className="font-medium">:  ₹123545</span> </div>
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
                    <CTableHeaderCell className="bg-body-tertiary">Date</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary ">
                    Particular
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Debit</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary ">
                    Credit
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Balance</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {toPartyLedger.map((item, index) => (
                    <CTableRow  key={index}>
                      <CTableDataCell >
                      {item.date}
                      </CTableDataCell>
                      <CTableDataCell >
                      {item.particular}
                      </CTableDataCell>
                      <CTableDataCell >
                      {item.debit}
                      </CTableDataCell>
                      <CTableDataCell>
                      {item.credit}
                      </CTableDataCell>
                      <CTableDataCell >
                      {item.balance}
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
  </CCardBody>
</CCard>
  

      {/* <table className="ledger-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Particular</th>
            <th>Debit</th>
            <th>Credit</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
        {toPartyLedger
          .map((ledger) => (
            <tr key={ledger.id}>
                <td>{ledger.date}</td>
              <td>{ledger.particular}</td>
              <td>{ledger.debit}</td>
              <td>{ledger.credit}</td>
              <td>{ledger.balance}</td>
            </tr>
          ))}
        </tbody>
      </table> */}
    </div>
  );
};

export default LedgerByToPartyCustomer;
