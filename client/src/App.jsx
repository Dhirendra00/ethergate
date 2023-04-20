import { Navbar, Welcome, Footer, Services, Transactions, VerifyAddress } from "./components";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => (
  <div className="min-h-screen">
    <div className="gradient-bg-welcome">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Welcome />} />
          {/* <Route exact path="/home" element={<Welcome />} /> */}
          <Route path="/verifyAddress" element={<VerifyAddress/>} />
        </Routes>
      </BrowserRouter>
    </div>   
  </div>
);

export default App;
