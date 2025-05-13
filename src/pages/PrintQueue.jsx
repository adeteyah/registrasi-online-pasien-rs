import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { serverUrl } from "../constants/global";
import Button from "../components/Button";
import { GridY } from "../components/Grid";

// Komponen utama untuk halaman cetak antrian reservasi
function PrintQueue() {
  const { id } = useParams(); // Mengambil parameter `id` dari URL
  const [reservation, setReservation] = useState(null); // Menyimpan data reservasi
  const [loading, setLoading] = useState(true); // Status loading
  const [notFound, setNotFound] = useState(false); // Status jika data tidak ditemukan
  const [polis, setPolis] = useState([]); // Data poli
  const [dokters, setDokters] = useState([]); // Data dokter
  const navigate = useNavigate(); // Hook untuk navigasi

  // Ambil data reservasi, poli, dan dokter
  useEffect(() => {
    const fetchReservation = async () => {
      try {
        // Mengambil data reservasi berdasarkan ID dari server
        const response = await fetch(`${serverUrl}/reservasi/${id}`);
        if (!response.ok) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        const data = await response.json();
        if (!data || Object.keys(data).length === 0) {
          setNotFound(true);
        } else {
          setReservation(data); // Simpan data jika ditemukan
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reservation:", error);
        setNotFound(true);
        setLoading(false);
      }
    };

    // Ambil data poli dan dokter juga
    const fetchMaster = async () => {
      try {
        const [poliRes, dokterRes] = await Promise.all([
          fetch(`${serverUrl}/poli`).then((res) => res.json()),
          fetch(`${serverUrl}/dokter`).then((res) => res.json()),
        ]);
        setPolis(poliRes);
        setDokters(dokterRes);
      } catch (error) {
        // Jika gagal, biarkan kosong
      }
    };

    fetchReservation();
    fetchMaster();
  }, [id]);

  // Fungsi untuk mendapatkan label dari id poli/dokter
  const getLabel = (value, dataArray, labelKey) => {
    if (!dataArray || dataArray.length === 0) return value;
    const found = dataArray.find((item) => item.id === value);
    return found ? found[labelKey] : value;
  };

  // Fungsi untuk mencetak area tertentu dari halaman
  const handlePrint = () => {
    const printArea = document.getElementById("print-area"); // Ambil elemen yang akan dicetak
    const originalContent = document.body.innerHTML; // Simpan isi halaman asli

    document.body.innerHTML = printArea.innerHTML; // Ganti isi halaman dengan area cetak
    window.print(); // Jalankan perintah cetak
    document.body.innerHTML = originalContent; // Kembalikan isi halaman
    window.location.reload(); // Reload halaman agar normal kembali
  };

  // Tampilkan loading jika data masih dimuat
  if (loading) return <p>Loading reservation...</p>;

  // Jika data tidak ditemukan, tampilkan pesan dan tombol kembali
  if (notFound)
    return (
      <GridY>
        <div className="p-8 rounded-xl outline outline-zinc-200 shadow shadow-zinc-200">
          <h3 className="text-2xl font-semibold">Data tidak ditemukan</h3>
        </div>
        <Button text="Kembali" onClick={() => navigate("/print")} />
      </GridY>
    );

  // Jika data ditemukan, tampilkan detail reservasi
  return (
    <div className="p-8 rounded-xl outline outline-zinc-200 shadow shadow-zinc-200">
      <GridY>
        <h3 className="text-2xl font-semibold">Detail Reservasi</h3>

        {/* Area yang akan dicetak */}
        <div id="print-area" className="print-area">
          <p>
            <strong>NIK:</strong> {reservation.nik}
          </p>
          <p>
            <strong>Tanggal:</strong> {reservation.tanggalReservasi}
          </p>
          <p>
            <strong>Jam:</strong> {reservation.jam}
          </p>
          <p>
            <strong>Poli:</strong> {getLabel(reservation.poli, polis, "poli")}
          </p>
          <p>
            <strong>Dokter:</strong>{" "}
            {getLabel(reservation.dokter, dokters, "nama")}
          </p>
          <p>
            <strong>Pembayaran:</strong> {reservation.tipePembayaran}
          </p>
        </div>

        {/* Tombol untuk mencetak */}
        <div className="grid">
          <Button onClick={handlePrint} text="Print" />
        </div>
      </GridY>

      {/* CSS khusus untuk mode cetak */}
      <style>
        {`
          @media print {
            body {
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              background: #fff;
            }

            .print-area {
              width: 80mm;
              padding: 10mm;
              font-family: Arial, sans-serif;
              font-size: 12px;
              border: 1px solid #ccc;
              box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
            }

            .print-area h3 {
              text-align: center;
              margin-bottom: 10px;
            }

            .print-area p {
              margin: 5px 0;
            }

            button {
              display: none;
            }
          }
        `}
      </style>
    </div>
  );
}

// Export komponen agar bisa digunakan di tempat lain
export default PrintQueue;
