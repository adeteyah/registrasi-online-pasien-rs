import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { GridY } from "../components/Grid";

// Komponen utama untuk mencari data print berdasarkan ID
function Print() {
  const [inputValue, setInputValue] = useState(""); // State untuk menyimpan nilai input dari pengguna
  const navigate = useNavigate(); // Hook untuk melakukan navigasi

  // Fungsi untuk melakukan navigasi ke halaman print detail jika input tidak kosong
  const routeChange = () => {
    if (inputValue.trim() !== "") {
      navigate(`/print/${inputValue}`); // Arahkan ke halaman detail berdasarkan ID
    }
  };

  return (
    // Tampilkan input dan tombol dalam layout vertikal
    <GridY>
      {/* Input untuk memasukkan ID print */}
      <input
        type="text"
        placeholder="Tulis ID Print Anda..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)} // Update state saat input berubah
      />

      {/* Tombol untuk mencari berdasarkan ID yang dimasukkan */}
      <Button onClick={routeChange} text="Cari Print" />
    </GridY>
  );
}

// Export komponen agar bisa digunakan di tempat lain
export default Print;
