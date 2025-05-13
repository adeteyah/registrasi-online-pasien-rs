import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { serverUrl } from "../constants/global";
import Button from "../components/Button";
import Table from "../components/Table";
import { GridY } from "../components/Grid";

// Komponen utama untuk halaman daftar reservasi
function Reservasi() {
  // State untuk menyimpan data dari API
  const [reservations, setReservations] = useState([]); // Menyimpan data reservasi
  const [patients, setPatients] = useState([]); // Menyimpan data pasien
  const [polis, setPolis] = useState([]); // Menyimpan data poli
  const [doctors, setDoctors] = useState([]); // Menyimpan data dokter

  // State tambahan untuk loading, pencarian, dan pagination
  const [loading, setLoading] = useState(true); // Status loading
  const [search, setSearch] = useState(""); // Kata kunci pencarian
  const [currentPage, setCurrentPage] = useState(1); // Halaman saat ini
  const itemsPerPage = 2; // Jumlah data per halaman

  // useEffect untuk mengambil data dari API saat komponen pertama kali dirender
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mengambil data reservasi, pasien, poli, dan dokter secara paralel
        const [resRes, resPat, resPoli, resDoc] = await Promise.all([
          fetch(`${serverUrl}/reservasi`).then((res) => res.json()),
          fetch(`${serverUrl}/pasien`).then((res) => res.json()),
          fetch(`${serverUrl}/poli`).then((res) => res.json()),
          fetch(`${serverUrl}/dokter`).then((res) => res.json()),
        ]);

        // Menyimpan data hasil fetch ke state
        setReservations(resRes);
        setPatients(resPat);
        setPolis(resPoli);
        setDoctors(resDoc);
        setLoading(false); // Menonaktifkan loading setelah data diambil
      } catch (error) {
        console.error("Error fetching data:", error); // Menampilkan error jika gagal
        setLoading(false);
      }
    };

    fetchData(); // Panggil fungsi untuk ambil data
  }, []);

  // Fungsi untuk mendapatkan nama pasien dari NIK
  const getPatientName = (nik) =>
    patients.find((p) => p.nik === nik)?.namaLengkap || nik;

  // Fungsi untuk mendapatkan nama poli dari ID
  const getPoliName = (poliId) =>
    polis.find((p) => p.id === poliId)?.poli || poliId;

  // Fungsi untuk mendapatkan nama dokter dari ID
  const getDoctorName = (doctorId) =>
    doctors.find((d) => d.id === doctorId)?.nama || doctorId;

  // Filter reservasi berdasarkan NIK yang dicari
  const filteredItems = reservations.filter((item) =>
    item.nik.includes(search)
  );

  // Hitung index data yang akan ditampilkan sesuai halaman saat ini
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem); // Ambil data yang tampil di halaman ini
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage); // Hitung jumlah halaman total

  // Jika data masih loading, tampilkan pesan loading
  if (loading) return <p>Loading reservations...</p>;

  // Tampilkan UI utama
  return (
    <GridY>
      {/* Input pencarian berdasarkan NIK */}
      <input
        type="text"
        placeholder="Cari berdasarkan NIK..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value); // Update keyword pencarian
          setCurrentPage(1); // Reset ke halaman pertama
        }}
      />

      {/* Tabel untuk menampilkan data reservasi */}
      <Table
        columns={[
          { header: "ID", render: (item) => getPatientName(item.id) },
          { header: "Tanggal", accessor: "tanggalReservasi" },
          { header: "Jam", accessor: "jam" },
          { header: "Nama", render: (item) => getPatientName(item.nik) },
          { header: "NIK", accessor: "nik" },
          { header: "Poli", render: (item) => getPoliName(item.poli) },
          { header: "Dokter", render: (item) => getDoctorName(item.dokter) },
          { header: "Pembayaran", accessor: "tipePembayaran" },
          {
            header: "Aksi",
            render: (item) => (
              <Link
                to={`/print/${item.id}`}
                className="text-blue-500 underline"
              >
                Print
              </Link>
            ),
          },
        ]}
        data={currentItems} // Data yang ditampilkan sesuai halaman
        density="compact"
        variant="same-width"
      />

      {/* Navigasi halaman */}
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index}
            text={(index + 1).toString()} // Nomor halaman
            onClick={() => setCurrentPage(index + 1)} // Pindah halaman
            variant={currentPage === index + 1 ? "solid" : "outlined"} // Tampilkan halaman aktif
            color="zinc"
          />
        ))}
      </div>
    </GridY>
  );
}

// Export komponen sebagai default export
export default Reservasi;
