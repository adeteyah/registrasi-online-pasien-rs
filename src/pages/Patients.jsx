import { useEffect, useState } from "react";
import { serverUrl } from "../constants/global";
import Button from "../components/Button";
import Table from "../components/Table";
import { GridY } from "../components/Grid";

// Komponen utama untuk menampilkan daftar pasien
function Patients() {
  // State untuk menyimpan data pasien dari server
  const [items, setItems] = useState([]);
  // State untuk menandai apakah data masih dimuat
  const [loading, setLoading] = useState(true);
  // State untuk menyimpan input pencarian
  const [search, setSearch] = useState("");
  // State untuk menyimpan halaman aktif
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Batas data per halaman

  // Ambil data dari server ketika komponen pertama kali dimuat
  useEffect(() => {
    fetch(`${serverUrl}/pasien`)
      .then((response) => response.json())
      .then((data) => {
        setItems(data); // Simpan data ke state
        setLoading(false); // Hentikan loading
      })
      .catch((error) => {
        console.error("Error fetching patients:", error); // Tangani error
        setLoading(false); // Tetap hentikan loading meskipun gagal
      });
  }, []);

  // Filter data pasien berdasarkan nama atau NIK yang dicari
  const filteredItems = items.filter(
    (item) =>
      item.namaLengkap.toLowerCase().includes(search.toLowerCase()) ||
      item.nik.includes(search)
  );

  // Logika pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Tampilkan pesan loading saat data dimuat
  if (loading) return <p>Loading patients...</p>;

  return (
    <GridY>
      {/* Input pencarian nama/NIK pasien */}
      <input
        type="text"
        placeholder="Search by name or NIK..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value); // Update input pencarian
          setCurrentPage(1); // Reset ke halaman pertama
        }}
      />

      {/* Tampilkan tabel data pasien */}
      <Table
        columns={[
          { header: "Nama Lengkap", accessor: "namaLengkap" },
          { header: "NIK", accessor: "nik" },
          {
            header: "TTL", // Tempat Tanggal Lahir
            render: (item) => `${item.tempatLahir}, ${item.tanggalLahir}`,
          },
          { header: "Gender", accessor: "jenisKelamin" },
          { header: "Phone", accessor: "nomorTelepon" },
          { header: "Address", accessor: "alamat" },
        ]}
        data={currentItems} // Data yang akan ditampilkan
        density="compact"
        variant="same-width"
      />

      {/* Navigasi halaman */}
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index}
            text={(index + 1).toString()}
            onClick={() => setCurrentPage(index + 1)}
            variant={currentPage === index + 1 ? "solid" : "outlined"} // Halaman aktif akan disorot
            color="zinc"
          />
        ))}
      </div>
    </GridY>
  );
}

export default Patients;
