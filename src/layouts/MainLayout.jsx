import { Outlet, Link } from "react-router-dom";

const Main = () => {
  return (
    <div className="flex rounded">
      <nav id="navigation">
        <Link to="/">Home</Link>
        <small>Pendaftaran</small>
        <Link to="/registration">Registrasi Online</Link>
        <small>List</small>
        <Link to="/doctors">List Dokter</Link>
        <Link to="/poli">List Poli</Link>
        <Link to="/patients">List Pasien</Link>
        <Link to="/reservations">List Reservasi</Link>
      </nav>
      <Outlet />
    </div>
  );
};

export default Main;
