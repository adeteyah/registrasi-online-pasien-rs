import { Outlet, Link } from "react-router-dom";

const Main = () => {
  return (
    <>
      <nav className="inline-flex gap-4">
        <Link to="/">Home</Link>
        <Link to="/registration">Registrasi Online</Link>
        <Link to="/doctors">List Dokter</Link>
        <Link to="/poli">List Poli</Link>
        <Link to="/patients">List Pasien</Link>
        <Link to="/reservations">List Reservasi</Link>
      </nav>
      <hr />
      <Outlet />
    </>
  );
};

export default Main;
