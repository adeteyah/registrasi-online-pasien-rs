import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { serverUrl } from "../constants/global";

function PrintQueue() {
  const { id } = useParams();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const response = await fetch(`${serverUrl}/reservasi/${id}`);
        const data = await response.json();
        setReservation(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reservation:", error);
        setLoading(false);
      }
    };

    fetchReservation();
  }, [id]);

  const handlePrint = () => {
    const printArea = document.getElementById("print-area");
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printArea.innerHTML;

    window.print();

    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  if (loading) return <p>Loading reservation...</p>;

  return (
    <div>
      <h2>Print Reservation</h2>
      <div id="print-area" className="print-area">
        <h3>Detail Reservasi</h3>
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
          <strong>Poli:</strong> {reservation.poli}
        </p>
        <p>
          <strong>Dokter:</strong> {reservation.dokter}
        </p>
        <p>
          <strong>Pembayaran:</strong> {reservation.tipePembayaran}
        </p>
      </div>
      <button onClick={handlePrint}>Print</button>

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
              width: 80mm; /* Set width to resemble a receipt */
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
              display: none; /* Hide buttons during print */
            }
          }
        `}
      </style>
    </div>
  );
}

export default PrintQueue;
