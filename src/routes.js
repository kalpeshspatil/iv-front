import React from 'react'

const HomePage = React.lazy(() => import('./views/HomePage/home'))
const Dispatch = React.lazy(() => import('./views/Dispatch/Dispatch'))
const Ledger = React.lazy(() => import('./views/Ledger/Ledger'))
const LedgerByToPartyCustomer = React.lazy(() => import('./views/LedgerByToPartyCustomer/LedgerByToPartyCustomer'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/home', name: 'Dashboard', element: HomePage },
  { path: '/dispatch', name: 'Dispatch', element: Dispatch },
  { path: '/ledger', name: 'Ledger', element: Ledger },
  { path: "/ledger/:customerId", name: 'ToPartyCustomer Ledger', element:LedgerByToPartyCustomer }
]

export default routes
