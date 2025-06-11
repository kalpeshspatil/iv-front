import React from 'react'

const HomePage = React.lazy(() => import('./components/HomePage/home'))
const Dispatch = React.lazy(() => import('./components/Dispatch/dispatch'))
const Ledger = React.lazy(() => import('./components/Ledger/ledger'))
const LedgerByToPartyCustomer = React.lazy(() => import('./components/LedgerByToPartyCustomer/LedgerByToPartyCustomer'))
const SalesReport = React.lazy(()=> import('./components/SalesReport/SalesReport'))
const PurchaseReport = React.lazy(()=> import('./components/PurchaseReport/PurchaseReport'))
const ExcelReportImportExportTool = React.lazy(()=> import('./components/ExcelReportImportExportTool/ExcelReportImportExportTool'))
const Products = React.lazy(()=> import('./components/Products/Products'))
const ToParty = React.lazy(()=> import('./components/ToPartyCustomer/ToPartyCustomer'))
const PfParty = React.lazy(()=> import('./components/PurchaseFromParty/PurchaseFromParty'))
const PdfEditor = React.lazy(()=> import('./components/PDFEditorTool/PDFEditorTool'))


const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/home', name: 'Dashboard', element: HomePage },
  { path: '/dispatch', name: 'Dispatch', element: Dispatch },
  { path: '/ledger', name: 'Ledger', element: Ledger },
  { path: "/ledger/:customerId", name: 'ToPartyCustomer Ledger', element:LedgerByToPartyCustomer },
  { path: '/sales/report', name: 'Sales Report', element: SalesReport },
  { path: '/purchase/report', name: 'Purchase Report', element: PurchaseReport },
  { path: '/tool/excelReportImportExport', name: 'Excel Import-Export Tool', element: ExcelReportImportExportTool },
  { path: '/products', name: 'Products Management', element: Products },
  { path: '/toParty', name: 'To Party customer Management', element: ToParty },
  { path: '/pfParty', name: 'Purchase From Party customer Management', element: PfParty },
  { path: '/tool/pdfEditor', name: 'Purchase From Party customer Management', element: PdfEditor }

  
]

export default routes
