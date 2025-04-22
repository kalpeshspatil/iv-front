import React, { createContext, useContext, useState } from 'react'
import ChallanModal from '../ChallanModal/ChallanModal'

export const ModalContext = createContext()

export const ModalProvider = ({ children }) => {
  const [isChallanModalOpen, setChallanModalOpen] = useState(false)

  const openChallanModal = () => setChallanModalOpen(true)
  const closeChallanModal = () => setChallanModalOpen(false)

  return (
    <ModalContext.Provider value={{ isChallanModalOpen, openChallanModal, closeChallanModal }}>
      {children}
    </ModalContext.Provider>
  )
}

export const useModal = () => useContext(ModalContext)
