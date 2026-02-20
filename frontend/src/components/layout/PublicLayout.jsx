// import { children } from "react";
import Navbar from "./Navbar";


export default function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
     {children}
    </>
  );
}
