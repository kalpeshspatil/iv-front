import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import Login from "./components/Login/login";
import ChallanModal from './components/ChallanModal/ChallanModal';
import { ModalProvider } from './components/contexts/ModalContext';
import { CSpinner } from '@coreui/react'
import './scss/style.scss'
import './style.css';
import "react-datepicker/dist/react-datepicker.css";


// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))


const App = () => {

  return (
    <HashRouter>
       <ModalProvider>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
        <Route path="/" element={<Login />} />

          <Route path="*" name="Home" element={<DefaultLayout />} />
        </Routes>
      </Suspense>
      <ChallanModal />
      </ModalProvider>
    </HashRouter>
  )
}

export default App
