import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import  { AuthProvider } from './app/AuthContext.jsx'
import {Toaster} from "react-hot-toast";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
      <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#020617",
              color: "#fff",
              border: "1px solid #1f2933", 
              borderRadius: "8px",
              padding: "16px",
              fontSize: "14px",
              maxWidth: "300px",
              
            },
          }}
        />
    </AuthProvider>
  </StrictMode>,
)
