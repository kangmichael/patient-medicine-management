import React from "react"
import { Routes, Route } from "react-router-dom"
import EditStockForm from "./forms/EditStockForm.jsx"
import ExistingPatients from "./ExistingPatients.jsx"
import Home from "./Home/Home.jsx"
import NewPatientForm from "./forms/NewPatientForm.jsx"
import Patient from "./Patient.jsx"
import Stock from "./Stock.jsx"
import { styled } from "@mui/system"
import NewReportForm from "./forms/NewReportForm.jsx"
import Test from "./Test.jsx"
import Navbar from "./Navbar.jsx"

// const MainStyle = styled("div")(({ theme }) => ({
//   flexGrow: 1,
//   overflow: "auto",
//   minHeight: "100%",
//   paddingLeft: theme.spacing(32),
//   paddingTop: 90,
//   paddingBottom: theme.spacing(10),
// }))

function App() {
  return (
    <div>
      {/* <Sidebar /> */}
      <Navbar />
      {/* <MainStyle> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/newPatient" element={<NewPatientForm />} />
        <Route path="/patients" element={<ExistingPatients />} />
        <Route path="/patient/:id" element={<Patient />} />
        <Route path="/newReportForm/:id" element={<NewReportForm />} />
        <Route path="/editStock" element={<EditStockForm />} />
        <Route path="/Stocks" element={<Stock />} />
        <Route path="/test" element={<Test />} />
      </Routes>
      {/* </MainStyle> */}
    </div>
  )
}

export default App
