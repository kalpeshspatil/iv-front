import { CRow, CCol } from '@coreui/react'
import "./Widget.css"
import StatCard from './StatCard'

// This is the small card you're rendering directly inside


const StatCardRow = ({homePageStats,className}) => {
  return (
    <CRow className="g-4">
      <CCol className={className} sm={6} xl={3}>
      <StatCard color="#0d6efd" leftValue="120" leftLabel="PPC" rightValue="89" rightLabel="Strong" />      </CCol>
      <CCol className={className} sm={6} xl={3}>
      <StatCard color="#3b5998" leftValue={homePageStats.totalSaleOfAccConcretePlus} leftLabel="Concrete Plus" rightValue={homePageStats.totalSaleOfAccSuraksha} rightLabel="Suraksha" />
      </CCol>
      <CCol className={className} sm={6} xl={3}>
        <StatCard color="#198754" leftValue="10.2K" leftLabel="PPC" rightValue="3.2K" rightLabel="Super" />
      </CCol>
      <CCol className={className} sm={6} xl={3}>
        <StatCard color="#dc3545" leftValue="24" leftLabel="PPC" rightValue="99%" rightLabel="Super" />
      </CCol>
    </CRow>
  )
}

export default StatCardRow
