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
  }
]

export default _nav
