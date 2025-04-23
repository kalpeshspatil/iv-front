import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
  CFooter,
} from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowTop, cilOptions } from '@coreui/icons'
import { API_BASE_URL } from "../../constants.js";

const WidgetsDropdown = ({ className, homePageStats }) => {
  const widgetChartRef1 = useRef(null)
  const widgetChartRef2 = useRef(null)

  // const [homePageStats, setHomePageStats] = useState({
  //   a1Outstanding: null,
  //   accOutstanding: null,
  //   shaktiOutstanding: null,
  //   totalOutstanding: null,
  //   totalSaleOfA1: null,
  //   totalSaleOfAcc: null,
  //   totalSaleOfShakti: null,
  //   noOfDuePayments: null,
  //   totalSale: null,
  //   a1: null,
  //   a2: null,
  //   a3: null,
  //   a4: null,
  //   a5: null,
  //   a6: null,
  // });

    // useEffect(() => {
    //   fetchHomePageStat();
    // }, []); // Empty dependency array ensures it runs only once
  
    // const fetchHomePageStat = async () => {
    //   try {
    //     const response = await fetch(
    //       `${API_BASE_URL}/api/challanToParties/homePageStat`
    //     );
    //     if (!response.ok) throw new Error("Network response was not ok");
  
    //     const data = await response.json();
  
    //     setHomePageStats({
    //       a1Outstanding: data.a1Outstanding || 0,
    //       accOutstanding: data.accOutstanding || 0,
    //       shaktiOutstanding: data.shaktiOutstanding || 0,
    //       totalOutstanding:
    //         data.a1Outstanding + data.accOutstanding + data.shaktiOutstanding,
    //       totalSaleOfA1: data.totalSaleOfA1 ? data.totalSaleOfA1 / 20 : 0,
    //       totalSaleOfAcc: data.totalSaleOfAcc ? data.totalSaleOfAcc / 20 : 0,
    //       totalSaleOfShakti: data.totalSaleOfShakti
    //         ? data.totalSaleOfShakti / 20
    //         : 0,
    //       noOfDuePayments: data.noOfDuePayments || 0,
    //       totalSale:
    //         data.totalSaleOfA1 / 20 +
    //         data.totalSaleOfAcc / 20 +
    //         data.totalSaleOfShakti / 20,
  
    //       a1: data.outstandingGroupByDaysDTO?.a1 || "0.00",
    //       a2: data.outstandingGroupByDaysDTO?.a2 || "0.00",
    //       a3: data.outstandingGroupByDaysDTO?.a3 || "0.00",
    //       a4: data.outstandingGroupByDaysDTO?.a4 || "0.00",
    //       a5: data.outstandingGroupByDaysDTO?.a5 || "0.00",
    //       a6: data.outstandingGroupByDaysDTO?.a6 || "0.00",
    //     });
  
    //     setAgeWiseOutstandingData(data.outstandingGroupByDaysDTO || {});
    //   } catch (error) {
    //     console.error("Error fetching homepage stats:", error);
    //   }
    // };

  useEffect(() => {
   // fetchHomePageStat();
    document.documentElement.addEventListener('ColorSchemeChange', () => {
      if (widgetChartRef1.current) {
        setTimeout(() => {
          widgetChartRef1.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-primary')
          widgetChartRef1.current.update()
        })
      }

      if (widgetChartRef2.current) {
        setTimeout(() => {
          widgetChartRef2.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-info')
          widgetChartRef2.current.update()
        })
      }
    })
  }, [widgetChartRef1, widgetChartRef2])

  return (
    <CRow className={className}  xs={{ gutter: 4 }}>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="primary"
          value={
            <>
              {homePageStats.totalSaleOfA1}
              <span className="fs-6 fw-normal">
                (-12.4% <CIcon icon={cilArrowBottom} />)
              </span>
            </>
          }
          title="Birla A1"
          
          chart={
            <CChartLine
              ref={widgetChartRef1}
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: getStyle('--cui-primary'),
                    data: [65, 59, 84, 84, 51, 55, 40],
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    border: {
                      display: false,
                    },
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    min: 30,
                    max: 89,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 1,
                    tension: 0.4,
                  },
                  point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="info"
          value={
            <>
              {homePageStats.totalSaleOfAcc}{' '}
              <span className="fs-6 fw-normal">
                (40.9% <CIcon icon={cilArrowTop} />)
              </span>
            </>
          }
          title="ACC"
         
          chart={
            <CChartLine
              ref={widgetChartRef2}
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: getStyle('--cui-info'),
                    data: [1, 18, 9, 17, 34, 22, 11],
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    border: {
                      display: false,
                    },
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    min: -9,
                    max: 39,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 1,
                  },
                  point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />

      </CCol>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="warning"
          value={
            <>
              {homePageStats.totalSaleOfShakti}{' '}
              <span className="fs-6 fw-normal">
                (84.7% <CIcon icon={cilArrowTop} />)
              </span>
            </>
          }
          title="Birla Shakti"
         
          chart={
            <CChartLine
              className="mt-3"
              style={{ height: '70px' }}
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: 'rgba(255,255,255,.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: [78, 81, 80, 45, 34, 12, 40],
                    fill: true,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    display: false,
                  },
                  y: {
                    display: false,
                  },
                },
                elements: {
                  line: {
                    borderWidth: 2,
                    tension: 0.4,
                  },
                  point: {
                    radius: 0,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
              
            />
            
          }
         
        />
      </CCol>
      
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="danger"
          value={
            <>
              {homePageStats.totalSale}{' '}
              <span className="fs-6 fw-normal">
                (-23.6% <CIcon icon={cilArrowBottom} />)
              </span>
            </>
          }
          title="Total Sale"
          
          chart={
            <CChartBar
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: [
                  'January',
                  'February',
                  'March',
                  'April',
                  'May',
                  'June',
                  'July',
                  'August',
                  'September',
                  'October',
                  'November',
                  'December',
                  'January',
                  'February',
                  'March',
                  'April',
                ],
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: 'rgba(255,255,255,.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: [78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34, 84, 67, 82],
                    barPercentage: 0.6,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                      drawTicks: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    border: {
                      display: false,
                    },
                    grid: {
                      display: false,
                      drawBorder: false,
                      drawTicks: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
              }}
            />
          }
        />
      </CCol>
    </CRow>
  )
}

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
  homePageStats: PropTypes.object.isRequired,
}

export default WidgetsDropdown
