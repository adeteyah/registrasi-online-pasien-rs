import React, { useEffect, useState } from "react";

function Patients() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  useEffect(() => {
    fetch("http://localhost:3030/pasien")
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching patients:", error);
        setLoading(false);
      });
  }, []);

  // Filter patients by name or NIK
  const filteredItems = items.filter(
    (item) =>
      item.namaLengkap.toLowerCase().includes(search.toLowerCase()) ||
      item.nik.includes(search)
  );

  // Pagination logic
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

  if (loading) return <p>Loading patients...</p>;

  return (
    <div>
      <h2>Patients List</h2>

      <input
        type="text"
        placeholder="Search by name or NIK..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
      />

      <ul>
        {currentItems.map((item) => (
          <li key={item.nik}>
            <strong>{item.namaLengkap}</strong>
            <br />
            NIK: {item.nik}
            <br />
            TTL: {item.tempatLahir}, {item.tanggalLahir}
            <br />
            Gender: {item.jenisKelamin}
            <br />
            Phone: {item.nomorTelepon}
            <br />
            Address: {item.alamat}
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

export default Patients;
