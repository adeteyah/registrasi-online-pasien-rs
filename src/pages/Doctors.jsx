import { useEffect, useState } from "react";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [polisi, setPolisi] = useState([]); // State to hold Poli data
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorData, poliData] = await Promise.all([
          fetch("http://localhost:3030/dokter").then((res) => res.json()),
          fetch("http://localhost:3030/poli").then((res) => res.json()),
        ]);

        setDoctors(doctorData);
        setPolisi(poliData); // Store poli data
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Lookup functions
  const getPoliName = (poliId) =>
    polisi.find((poli) => poli.id === poliId)?.poli || poliId; // Match poli name

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.nama.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastDoctor = currentPage * itemsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - itemsPerPage;
  const currentDoctors = filteredDoctors.slice(
    indexOfFirstDoctor,
    indexOfLastDoctor
  );
  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (loading) return <p>Loading data...</p>;

  return (
    <div>
      <h2>Doctor List</h2>

      <input
        type="text"
        placeholder="Search by doctor name..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
      />

      <ul>
        {currentDoctors.map((doctor) => (
          <li key={doctor.id}>
            <strong>{doctor.nama}</strong>
            <br />
            <strong>Poli: </strong>
            {doctor.poli.map((poliId, index) => (
              <span key={index}>
                {getPoliName(poliId)}
                {index < doctor.poli.length - 1 ? ", " : ""}
              </span>
            ))}
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

export default Doctors;
