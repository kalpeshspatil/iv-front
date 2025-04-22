import React, { useState, useEffect } from "react";
import "../HomePage/home.css";
import "react-toastify/dist/ReactToastify.css";
import "./HomePageSummary.css";
import { API_BASE_URL } from "../../constants.js";
import { FaChartPie } from "react-icons/fa";
import { FaChartSimple } from "react-icons/fa6";
import { IoIosPricetags } from "react-icons/io";
import EditableTable  from "../EditableLandingPrices/EditableLandingPrice.jsx";
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import StatCard from '../widgets/StatCardRow.js';

import {

  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
} from '@coreui/react'


export function HomePageSummary() {

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
    totalSaleOfAccConcretePlus: null,
    totalSaleOfAccSuraksha: null,
    totalSaleOfA1Ppc: null,
    totalSaleOfShaktiPpc: null,
    a1: null,
    a2: null,
    a3: null,
    a4: null,
    a5: null,
    a6: null,
  });
  
  

  useEffect(() => {
    fetchHomePageStat();
  }, []); // Empty dependency array ensures it runs only once

  const fetchHomePageStat = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/challanToParties/homePageStat`
      );
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();

      setHomePageStats({
        a1Outstanding: data.a1Outstanding || 0,
        accOutstanding: data.accOutstanding || 0,
        shaktiOutstanding: data.shaktiOutstanding || 0,
        totalOutstanding:
          data.a1Outstanding + data.accOutstanding + data.shaktiOutstanding,
        totalSaleOfA1: data.totalSaleOfA1 ? data.totalSaleOfA1 / 20 : 0,
        totalSaleOfAcc: data.totalSaleOfAcc ? data.totalSaleOfAcc / 20 : 0,
        totalSaleOfShakti: data.totalSaleOfShakti
          ? data.totalSaleOfShakti / 20
          : 0,
          totalSaleOfAccConcretePlus: data.totalSaleOfAccConcretePlus ? data.totalSaleOfAccConcretePlus / 20 : 0,
          totalSaleOfAccSuraksha: data.totalSaleOfAccSuraksha ? data.totalSaleOfAccSuraksha / 20 : 0,
          totalSaleOfA1Ppc: data.totalSaleOfA1Ppc ? data.totalSaleOfA1Ppc / 20 : 0,
          totalSaleOfShaktiPpc: data.totalSaleOfShaktiPpc ? data.totalSaleOfShaktiPpc / 20 : 0,
  
        noOfDuePayments: data.noOfDuePayments || 0,
        totalSale:
          data.totalSaleOfA1 / 20 +
          data.totalSaleOfAcc / 20 +
          data.totalSaleOfShakti / 20,

        a1: data.outstandingGroupByDaysDTO?.a1 || "0.00",
        a2: data.outstandingGroupByDaysDTO?.a2 || "0.00",
        a3: data.outstandingGroupByDaysDTO?.a3 || "0.00",
        a4: data.outstandingGroupByDaysDTO?.a4 || "0.00",
        a5: data.outstandingGroupByDaysDTO?.a5 || "0.00",
        a6: data.outstandingGroupByDaysDTO?.a6 || "0.00",
      });
    } catch (error) {
      console.error("Error fetching homepage stats:", error);
    }
  };

  

  return (
      <div className="row">
        <div className="col-sm-12 p-0">
          
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header">
                <div className="d-flex justify-content-between">
                  <h3 className="card-title">
                  <FaChartPie />

                    <i className="fas fa-chart-pie mr-1"></i> Outstanding Summary 
                  </h3>
                </div>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 col-sm-6 col-md-3 ">
                    <div className="info-box card bg-primary text-white">
                      <span className="info-box-icon bg-success ">
                        <i className="fas fa-check-double"></i>
                      </span>

                      <div className="info-box-content">
                        <span className="info-box-text">
                          <h5>
                            <b>Birla A1</b>
                          </h5>
                        </span>
                        <span className="info-box-number">
                          ₹ {homePageStats.a1Outstanding}
                        </span>
                      </div>
                    </div>
                    
                  </div>
                  <div className="col-12 col-sm-6 col-md-3">
                    <div className="info-box card bg-info text-white">
                      <span className="info-box-icon ">
                        <i className="fas fa-check"></i>
                      </span>
                      <div className="info-box-content">
                        <span className="info-box-text">
                          <h5>
                            <b>ACC</b>
                          </h5>
                        </span>
                        <span className="info-box-number">
                          ₹ {homePageStats.accOutstanding}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6 col-md-3">
                    <div className="info-box card bg-warning text-white">
                      <span className="info-box-icon ">
                        <i className="fas fa-clock"></i>
                      </span>

                      <div className="info-box-content">
                        <span className="info-box-text">
                          <h5>
                            <b>Shakti</b>
                          </h5>
                        </span>
                        <span className="info-box-number">
                          ₹ {homePageStats.shaktiOutstanding}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6 col-md-3">
                    <div className="info-box card bg-danger text-white">
                      <span className="info-box-icon ">
                        <i className="fas fa-clock"></i>
                      </span>

                      <div className="info-box-content">
                        <span className="info-box-text">
                          <h5>
                            <b>Total Outstanding </b>
                          </h5>
                        </span>
                        <span className="info-box-number">
                          ₹ {homePageStats.totalOutstanding}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-12">
                  
                 <CCard className="mb-4">
                             <CCardHeader>Age Wise Outstanding
                             </CCardHeader>
                             <CCardBody>
                               <CRow>
                                 <CCol xs={12} md={6} xl={6}>
                                   <CRow>
                                     <CCol xs={6}>
                                       <div className="border-start border-start-4 border-start-info py-1 px-3">
                                         <div className="text-body-secondary text-truncate small">0 to 8 Days	</div>
                                         <div className="fs-5 fw-semibold">{homePageStats?.a1 || 0}</div>
                                       </div>
                                     </CCol>
                                     <CCol xs={6}>
                                       <div className="border-start border-start-4 border-start-danger py-1 px-3 mb-3">
                                         <div className="text-body-secondary text-truncate small">
                                         9 to 15 Days
                                         </div>
                                         <div className="fs-5 fw-semibold">{homePageStats?.a2 || 0}</div>
                                       </div>
                                     </CCol>
                                     
                                   </CRow>
                        
                                 </CCol>
                                 <CCol xs={12} md={6} xl={6}>
                                   <CRow>
                                     <CCol xs={6}>
                                       <div className="border-start border-start-4 border-start-warning py-1 px-3 mb-3">
                                         <div className="text-body-secondary text-truncate small">15 to 21 Days	</div>
                                         <div className="fs-5 fw-semibold">{homePageStats?.a3 || 0}</div>
                                       </div>
                                     </CCol>
                                     <CCol xs={6}>
                                       <div className="border-start border-start-4 border-start-success py-1 px-3 mb-3">
                                         <div className="text-body-secondary text-truncate small">21+ Days</div>
                                         <div className="fs-5 fw-semibold">{homePageStats?.a4 || 0}</div>
                                       </div>
                                     </CCol>
                                   </CRow>
                                   </CCol>
                                   </CRow>
                                   </CCardBody>
                 </CCard>
            {/* <div className="card">
              <div className="card-header">
                <div className="d-flex justify-content-between">
                  <h3 className="card-title">
                    <i className="fas fa-chart-pie mr-1"></i> Age Wise
                    Outstanding
                  </h3>
                </div>
              </div>
              <div className="card-body inner-card-body">
                <table
                  className="table inner-table-inherit-margin"
                  role="grid"
                >
                  <thead>
                    <tr role="row">
                      <th className="text-right" rowSpan="1" colSpan="1">
                        0 to 4 Days
                      </th>
                      <th className="text-right" rowSpan="1" colSpan="1">
                        5 to 9 Days
                      </th>
                      <th className="text-right" rowSpan="1" colSpan="1">
                        10 to 14 Days
                      </th>
                      <th className="text-right" rowSpan="1" colSpan="1">
                        15 to 20 Days
                      </th>
                      <th className="text-right" rowSpan="1" colSpan="1">
                        21 to 30 Days
                      </th>
                      <th className="text-right" rowSpan="1" colSpan="1">
                        30+ Days
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr role="row" className="odd">
                      <td className="text-right">{homePageStats?.a1 || 0}</td>
                      <td className="text-right">{homePageStats?.a2 || 0}</td>
                      <td className="text-right">{homePageStats?.a3 || 0}</td>
                      <td className="text-right">{homePageStats?.a4 || 0}</td>
                      <td className="text-right">{homePageStats?.a5 || 0}</td>
                      <td className="text-right">
                        {homePageStats.totalOutstanding}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div> */}
          </div>
              </div>
            </div>
          </div>

          <div className="col-lg-12">
            <div className="card">
              <div className="card-header">
                <div className="d-flex justify-content-between">
                  <h3 className="card-title">
                  <FaChartSimple />

                    <i className="fas fa-chart-pie mr-1"></i> Sales Summary(MT)
                  </h3>
                </div>
              </div>
              

              <div className="card-body">
              <WidgetsDropdown className="mb-0" homePageStats={homePageStats}/>
              <StatCard homePageStats={homePageStats} className="mt-0 border-top-0"/>
              </div>
            </div>
          </div>

         

          <div className="col-lg-12">
          <div className="col-lg-6">

            <div className="card">
              <div className="card-header">
                <div className="d-flex justify-content-between">
                  <h3 className="card-title">
                  <IoIosPricetags />

                    <i className="fas fa-chart-pie mr-1"></i> Current Landing Rates
                  </h3>
                </div>
              </div>
              <div className="card-body">
              <EditableTable></EditableTable>
              </div>
            </div>
            </div>
            <div className="col-lg-6">
              
            </div>

          </div>
        </div>
      </div>
  );
}
export default HomePageSummary;
