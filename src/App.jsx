import { Routes, Route, BrowserRouter } from "react-router-dom";
import Main from "./layouts/MainLayout";
import HomeLayout from "./layouts/HomeLayout";
import Home from "./pages/Home";
import Registration from "./pages/Registration";
import Doctors from "./pages/Doctors";
import Poli from "./pages/Poli";
import Patients from "./pages/Patients";
import Reservations from "./pages/Reservations";
import PrintQueue from "./pages/PrintQueue";
import Print from "./pages/Print";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/" element={<Main />}>
          <Route path="registration" element={<Registration />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="poli" element={<Poli />} />
          <Route path="patients" element={<Patients />} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="print" element={<Print />} />
          <Route path="print/:id" element={<PrintQueue />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
