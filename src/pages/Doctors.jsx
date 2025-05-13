import { useEffect, useState } from "react";
import { serverUrl } from "../constants/global";
import Button from "../components/Button";
import Table from "../components/Table";
import { GridY } from "../components/Grid";

// Komponen utama untuk menampilkan daftar dokter
function Doctors() {
  // State untuk menyimpan data dokter
  const [doctors, setDoctors] = useState([]);
  // State untuk menyimpan data poli
  const [polisi, setPolisi] = useState([]);
  // State untuk menandakan apakah data sedang dimuat
  const [loading, setLoading] = useState(true);
  // State untuk menyimpan nilai pencarian
  const [search, setSearch] = useState("");
  // State untuk menyimpan halaman aktif
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Jumlah data per halaman

  // Ambil data dokter dan poli dari server menggunakan useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mengambil data dokter dan poli secara bersamaan dengan Promise.all
        const [doctorData, poliData] = await Promise.all([
          fetch(`${serverUrl}/dokter`).then((res) => res.json()),
          fetch(`${serverUrl}/poli`).then((res) => res.json()),
        ]);

        setDoctors(doctorData); // Menyimpan data dokter ke state
        setPolisi(poliData); // Menyimpan data poli ke state
        setLoading(false); // Menghentikan loading
      } catch (error) {
        console.error("Error fetching data:", error); // Menangani error
        setLoading(false); // Menghentikan loading meskipun gagal
      }
    };

    fetchData(); // Memanggil fungsi fetchData
  }, []); // Hanya dijalankan sekali saat komponen pertama kali dimuat

  // Fungsi untuk mendapatkan nama poli berdasarkan ID poli
  const getPoliName = (poliId) =>
    polisi.find((poli) => poli.id === poliId)?.poli || poliId;

  // Menyaring data dokter berdasarkan nama yang dimasukkan dalam pencarian
  const filteredDoctors = doctors.filter((doctor) =>
    doctor.nama.toLowerCase().includes(search.toLowerCase())
  );

  // Logika pagination untuk menampilkan data per halaman
  const indexOfLastDoctor = currentPage * itemsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - itemsPerPage;
  const currentDoctors = filteredDoctors.slice(
    indexOfFirstDoctor,
    indexOfLastDoctor
  );
  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage); // Menghitung total halaman

  // Jika data masih dimuat, tampilkan pesan loading
  if (loading) return <p>Loading data...</p>;

  return (
    <GridY>
      {/* Input pencarian untuk mencari nama dokter */}
      <input
        type="text"
        placeholder="Search by doctor name..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value); // Update nilai pencarian
          setCurrentPage(1); // Reset ke halaman pertama
        }}
      />

      {/* Tampilkan tabel data dokter */}
      <Table
        columns={[
          { header: "Nama Dokter", accessor: "nama" }, // Kolom nama dokter
          {
            header: "Poli", // Kolom poli
            render: (doctor) =>
              doctor.poli.map((poliId) => getPoliName(poliId)).join(", "), // Menampilkan nama poli berdasarkan ID
          },
        ]}
        data={currentDoctors} // Data yang akan ditampilkan pada halaman ini
        variant="same-width" // Menentukan lebar kolom yang sama
      />

      {/* Navigasi untuk memilih halaman */}
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index}
            text={(index + 1).toString()} // Menampilkan nomor halaman
            onClick={() => setCurrentPage(index + 1)} // Navigasi ke halaman yang dipilih
            variant={currentPage === index + 1 ? "solid" : "outlined"} // Menyorot halaman yang sedang aktif
            color="zinc"
          />
        ))}
      </div>
    </GridY>
  );
}

export default Doctors;
