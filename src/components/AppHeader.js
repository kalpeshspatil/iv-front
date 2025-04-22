import React, { useEffect, useRef } from 'react'
import { useModal } from './contexts/ModalContext'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { cilMenu } from '@coreui/icons'
import { AppHeaderDropdown } from './header/index'

const AppHeader = () => {
  const { openChallanModal } = useModal()
  const headerRef = useRef()

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderNav className="d-none d-md-flex">
          <CNavItem>
          <CNavLink
          component="button"
          style={{ all: 'unset', cursor: 'pointer', padding: '0.5rem 1rem', display: 'block' }}
          onClick={openChallanModal}
        >
          New Challan
        </CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav className="ms-auto">
          <CNavItem>
           
          </CNavItem>
          <CNavItem>
            
          </CNavItem>
          <CNavItem>
            
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav>
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>

    </CHeader>
  )
}

export default AppHeader
