import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer

} from '@coreui/icons'
import { cilBook } from '@coreui/icons';
import { cilPaperPlane } from '@coreui/icons';
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Home',
    to: '/home',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info'
    },
  },
  {
    component: CNavTitle,
    name: 'Extras',
  },
  {
    component: CNavItem,
    name: 'Dispatch',
    to: '/dispatch',
    icon: <CIcon icon={cilPaperPlane} customClassName="nav-icon" />,
    badge: {
      color: 'info'
    },
  },
  {
    component: CNavItem,
    name: 'Ledger',
    to: '/ledger',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
    badge: {
      color: 'info'
    },
  },
  {
    component: CNavGroup,
    name: 'Reports',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Sales',
        to: '/sales/report',
      },
      {
        component: CNavItem,
        name: 'Purchase',
        to: '/purchase/report',
      },
     {
        component: CNavItem,
        name: 'Retailer',
        to: '/retailer/report',
      }
    ],
  },
  {
    component: CNavGroup,
    name: 'Tools',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Excel I/E',
        to: '/tool/excelReportImportExport',
      }
     
    ],
  },
  {
    component: CNavGroup,
    name: 'Registration',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Products',
        to: '/products',
      },
      {
        component: CNavItem,
        name: 'To Party',
        to: '/toParty',
      },
      {
        component: CNavItem,
        name: 'Purchase Party',
        to: '/pfParty',
      }
     
    ],
  }
]

export default _nav
