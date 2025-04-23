import React from 'react'

const HomePage = React.lazy(() => import('./components/HomePage/home'))
const Dispatch = React.lazy(() => import('./components/Dispatch/dispatch'))
const Ledger = React.lazy(() => import('./components/Ledger/ledger'))
const LedgerByToPartyCustomer = React.lazy(() => import('./components/LedgerByToPartyCustomer/LedgerByToPartyCustomer'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/home', name: 'Dashboard', element: HomePage },
  { path: '/dispatch', name: 'Dispatch', element: Dispatch },
  { path: '/ledger', name: 'Ledger', element: Ledger },
  { path: "/ledger/:customerId", name: 'ToPartyCustomer Ledger', element:LedgerByToPartyCustomer }
]

export default routes
