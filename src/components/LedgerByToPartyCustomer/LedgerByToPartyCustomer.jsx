import { useEffect, useState } from "react";
import { useParams, useLocation  } from "react-router-dom";
import { API_BASE_URL } from "../../constants.js";  
import { useNavigate } from "react-router-dom";




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
      <button className="back-btn" onClick={() => navigate("/ledger")}>
        Back to Ledger
      </button>
     {/* Headline Section */}
  <div className="headline-container">
    <h2>{customerName} Account Ledger </h2>
  </div>

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


      <table className="ledger-table">
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
            <tr key={ledger.tpCustomerId}>
                <td>{ledger.date}</td>
              <td>{ledger.particular}</td>
              <td>{ledger.debit}</td>
              <td>{ledger.credit}</td>
              <td>{ledger.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LedgerByToPartyCustomer;
