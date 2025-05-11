import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import PrintQueue from "./PrintQueue";

function Reservasi() {
  const [reservations, setReservations] = useState([]);
  const [patients, setPatients] = useState([]);
  const [polis, setPolis] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resRes, resPat, resPoli, resDoc] = await Promise.all([
          fetch("http://localhost:3030/reservasi").then((res) => res.json()),
          fetch("http://localhost:3030/pasien").then((res) => res.json()),
          fetch("http://localhost:3030/poli").then((res) => res.json()),
          fetch("http://localhost:3030/dokter").then((res) => res.json()),
        ]);

        setReservations(resRes);
        setPatients(resPat);
        setPolis(resPoli);
        setDoctors(resDoc);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Lookup functions
  const getPatientName = (nik) =>
    patients.find((p) => p.nik === nik)?.namaLengkap || nik;

  const getPoliName = (poliId) =>
    polis.find((p) => p.id === poliId)?.poli || poliId;

  const getDoctorName = (doctorId) =>
    doctors.find((d) => d.id === doctorId)?.nama || doctorId;

  const filteredItems = reservations.filter((item) =>
    item.nik.includes(search)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (loading) return <p>Loading reservations...</p>;

  return (
    <div>
      <h2>Daftar Reservasi</h2>

      <input
        type="text"
        placeholder="Cari berdasarkan NIK..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
      />

      <ul>
        {currentItems.map((item, index) => (
          <li key={index}>
            <strong>Nama:</strong> {getPatientName(item.nik)}
            <br />
            <strong>NIK:</strong> {item.nik}
            <br />
            <strong>Tanggal:</strong> {item.tanggalReservasi}
            <br />
            <strong>Jam:</strong> {item.jam}
            <br />
            <strong>Poli:</strong> {getPoliName(item.poli)}
            <br />
            <strong>Dokter:</strong> {getDoctorName(item.dokter)}
            <br />
            <strong>Pembayaran:</strong> {item.tipePembayaran}
            <br />
            <strong>Aksi:</strong> <Link to={`/print/${item.id}`}>Print</Link>
            <hr />
          </li>
        ))}
      </ul>

      <div>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

export default Reservasi;
