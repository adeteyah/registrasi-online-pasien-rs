import { useEffect, useState } from "react";
import { serverUrl } from "../constants/global";
import Button from "../components/Button";
import Table from "../components/Table";
import { GridY } from "../components/Grid";

// Komponen utama Poli
function Poli() {
  // State untuk menyimpan data poli dari server
  const [items, setItems] = useState([]);
  // State untuk status loading
  const [loading, setLoading] = useState(true);
  // State untuk menyimpan keyword pencarian
  const [search, setSearch] = useState("");
  // State untuk menyimpan halaman saat ini
  const [currentPage, setCurrentPage] = useState(1);
  // Jumlah item yang ditampilkan per halaman
  const itemsPerPage = 5;

  // Ambil data dari server saat komponen pertama kali dimuat
  useEffect(() => {
    fetch(`${serverUrl}/poli`) // Panggil endpoint API poli
      .then((response) => response.json()) // Ubah response ke format JSON
      .then((data) => {
        setItems(data); // Simpan data ke state
        setLoading(false); // Matikan status loading
      })
      .catch((error) => {
        console.error("Error fetching data:", error); // Tangani error jika ada
        setLoading(false); // Matikan status loading meskipun error
      });
  }, []);

  // Filter data berdasarkan keyword pencarian
  const filteredItems = items.filter((item) =>
    item.poli.toLowerCase().includes(search.toLowerCase())
  );

  // Hitung index untuk pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // Ambil data untuk halaman saat ini
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  // Hitung total halaman
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Tampilkan teks loading jika data masih dimuat
  if (loading) return <p>Loading...</p>;

  return (
    <GridY>
      {/* Input pencarian nama poli */}
      <input
        type="text"
        placeholder="Search by poli name..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value); // Update keyword pencarian
          setCurrentPage(1); // Reset ke halaman pertama
        }}
      />

      {/* Tampilkan tabel berisi daftar nama poli */}
      <Table
        columns={[{ header: "Nama Poli", accessor: "poli" }]} // Kolom tabel
        data={currentItems} // Data yang ditampilkan
        variant="same-width" // Tampilan tabel
      />

      {/* Navigasi pagination */}
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index}
            text={(index + 1).toString()} // Tampilkan nomor halaman
            onClick={() => setCurrentPage(index + 1)} // Pindah ke halaman tertentu
            variant={currentPage === index + 1 ? "solid" : "outlined"} // Highlight halaman aktif
            color="zinc"
          />
        ))}
      </div>
    </GridY>
  );
}

// Export komponen untuk digunakan di tempat lain
export default Poli;
