import { useState, useEffect } from "react";
import axios from "axios";
import Button from "../components/Button";
import { serverUrl } from "../constants/global";
import Table from "../components/Table";
import {
  InputText,
  InputSelect,
  InputDate,
  InputNumber,
  Label,
} from "../components/Input";
import { getToday, getTodayOffsetDate } from "../utils/time";
import { GridX, GridY } from "../components/Grid";

// Komponen utama untuk halaman registrasi pasien dengan multi-step form
function Registration() {
  // State untuk menyimpan data form
  const [formData, setFormData] = useState({
    nik: "",
    namaLengkap: "",
    tempatLahir: "",
    tanggalLahir: "",
    jenisKelamin: "",
    nomorTelepon: "",
    alamat: "",
    tanggalReservasi: "",
    jam: "",
    poli: "",
    dokter: "",
    tipePembayaran: "",
  });

  // State untuk melacak langkah/form step saat ini
  const [step, setStep] = useState(1);

  // State untuk data master dari API
  const [poli, setPoli] = useState([]);
  const [dokter, setDokter] = useState([]);
  const [variables, setVariables] = useState({
    jam: [],
    tipePembayaran: [],
    jenisKelamin: [],
  });
  const [reservasi, setReservasi] = useState([]);

  // Fungsi untuk mengecek apakah semua field form sudah terisi
  const isFormComplete = () => {
    return Object.values(formData).every((val) => val !== "");
  };

  // Ambil data master dari API saat komponen pertama kali dirender
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [poliRes, dokterRes, varsRes, reservasiRes] = await Promise.all([
          axios.get(`${serverUrl}/poli`),
          axios.get(`${serverUrl}/dokter`),
          axios.get(`${serverUrl}/variables`),
          axios.get(`${serverUrl}/reservasi`),
        ]);

        setPoli(poliRes.data);
        setDokter(dokterRes.data);
        setVariables(varsRes.data);
        setReservasi(reservasiRes.data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      }
    };

    fetchData();
  }, []);

  // Fungsi untuk mengubah nilai field pada form
  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Fungsi untuk submit data ke server
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPasien = {
      nik: formData.nik,
      namaLengkap: formData.namaLengkap,
      tempatLahir: formData.tempatLahir,
      tanggalLahir: formData.tanggalLahir,
      jenisKelamin: formData.jenisKelamin,
      nomorTelepon: formData.nomorTelepon,
      alamat: formData.alamat,
    };

    const newReservasi = {
      nik: formData.nik,
      tanggalReservasi: formData.tanggalReservasi,
      jam: formData.jam,
      poli: formData.poli,
      dokter: formData.dokter,
      tipePembayaran: formData.tipePembayaran,
    };

    try {
      // Kirim data pasien dan reservasi ke server
      await axios.post(`${serverUrl}/pasien`, newPasien);
      await axios.post(`${serverUrl}/reservasi`, newReservasi);
      console.log("Data berhasil ditambahkan!");

      // Reset form setelah submit
      setFormData({
        nik: "",
        namaLengkap: "",
        tempatLahir: "",
        tanggalLahir: "",
        jenisKelamin: "",
        nomorTelepon: "",
        alamat: "",
        tanggalReservasi: "",
        jam: "",
        poli: "",
        dokter: "",
        tipePembayaran: "",
      });

      setStep(1); // Kembali ke langkah pertama
    } catch (error) {
      console.error("Gagal menambahkan data:", error);
    }
  };

  return (
    <>
      {/* Stepper untuk menampilkan progress multi-step form */}
      <div className="flex justify-between items-center mb-6">
        {["Biodata", "Reservasi", "Konfirmasi"].map((label, index) => {
          const stepNumber = index + 1;
          const isActive = step === stepNumber;
          const isCompleted = step > stepNumber;

          return (
            <div
              key={index}
              className="flex gap-4 flex-wrap items-center p-5 rounded-xl bg-zinc-50 shadow shadow-zinc-200"
            >
              <span
                className={`size-8 flex items-center justify-center rounded-full text-zinc-50 ${
                  isCompleted
                    ? "bg-zinc-500"
                    : isActive
                    ? "bg-blue-500 text-blue-50"
                    : "bg-zinc-200 text-zinc-500"
                }`}
              >
                {isCompleted ? "✓" : stepNumber}
              </span>
              <span>{label}</span>
            </div>
          );
        })}
      </div>

      {/* Form multi-step */}
      <form onSubmit={handleSubmit}>
        {/* Step 1: Biodata */}
        {step === 1 && (
          <>
            <h3 className="text-lg font-semibold mb-4">Biodata</h3>
            <Biodata
              formData={formData}
              onChange={handleChange}
              variables={variables}
            />
          </>
        )}
        {/* Step 2: Reservasi */}
        {step === 2 && (
          <>
            <h3 className="text-lg font-semibold mb-4">Reservasi</h3>
            <Reservasi
              formData={formData}
              onChange={handleChange}
              poli={poli}
              dokter={dokter}
              variables={variables}
              reservasi={reservasi}
            />
          </>
        )}
        {/* Step 3: Konfirmasi */}
        {step === 3 && (
          <>
            <h3 className="text-lg font-semibold mb-4">Konfirmasi</h3>
            <Konfirmasi formData={formData} poli={poli} dokter={dokter} />
          </>
        )}

        {/* Tombol navigasi step dan submit */}
        <div className="flex flex-col gap-2.5 my-5">
          {step > 1 && (
            <Button
              text="Kembali"
              onClick={() => setStep(step - 1)}
              type="button"
              variant="outlined"
              color="zinc"
            />
          )}
          {step < 3 && (
            <Button
              text="Selanjutnya"
              onClick={() => setStep(step + 1)}
              type="button"
              variant="outlined"
              color="blue"
            />
          )}
          {step === 3 && (
            <Button type="submit" text="Daftar" disabled={!isFormComplete()} />
          )}
        </div>
      </form>
    </>
  );
}

// Komponen untuk form Biodata pasien
function Biodata({ formData, onChange, variables }) {
  return (
    <GridX>
      <GridY>
        <Label label="NIK" htmlFor="nik" />
        <InputNumber
          placeholder="Nomor KTP"
          htmlFor="nik"
          value={formData.nik}
          onChange={(e) => onChange("nik", e.target.value)}
        />
      </GridY>

      <GridY>
        <Label label="Nama Lengkap Pasien" htmlFor="namaLengkap" />
        <InputText
          placeholder="Contoh: Budi Santoso"
          htmlFor="namaLengkap"
          value={formData.namaLengkap}
          onChange={(e) => onChange("namaLengkap", e.target.value)}
        />
      </GridY>

      <GridY>
        <Label label="Tempat Lahir" htmlFor="tempatLahir" />
        <InputText
          placeholder="Contoh: Bandung"
          htmlFor="tempatLahir"
          value={formData.tempatLahir}
          onChange={(e) => onChange("tempatLahir", e.target.value)}
        />
      </GridY>

      <GridY>
        <Label label="Tanggal Lahir" htmlFor="tanggalLahir" />
        <InputDate
          min={getTodayOffsetDate(-45625)}
          max={getToday()}
          step="1"
          htmlFor="tanggalLahir"
          value={formData.tanggalLahir}
          onChange={(e) => onChange("tanggalLahir", e.target.value)}
        />
      </GridY>

      <GridY>
        <Label label="Jenis Kelamin" />
        <InputSelect
          name="jenisKelamin"
          options={variables.jenisKelamin.map((jenisKelamin) => ({
            label: jenisKelamin,
            value: jenisKelamin,
          }))}
          value={formData.jenisKelamin}
          onChange={(e) => onChange("jenisKelamin", e.target.value)}
        />
      </GridY>

      <GridY>
        <Label label="Nomor Telepon" htmlFor="nomorTelepon" />
        <InputNumber
          placeholder="Contoh: 08XXXXXXXXXX"
          htmlFor="nomorTelepon"
          value={formData.nomorTelepon}
          onChange={(e) => onChange("nomorTelepon", e.target.value)}
        />
      </GridY>

      <GridY>
        <Label label="Alamat" htmlFor="alamat" />
        <InputText
          placeholder="Sesuai KTP"
          htmlFor="alamat"
          value={formData.alamat}
          onChange={(e) => onChange("alamat", e.target.value)}
        />
      </GridY>
    </GridX>
  );
}

// Komponen untuk form Reservasi pasien
function Reservasi({ formData, onChange, poli, dokter, variables, reservasi }) {
  // Filter dokter berdasarkan poli yang dipilih
  const filteredDokter = dokter.filter((dokter) =>
    dokter.poli.includes(formData.poli)
  );

  // Ambil jam yang sudah terpakai untuk dokter dan tanggal tertentu
  const reservedJam = reservasi
    .filter(
      (r) =>
        r.dokter === formData.dokter &&
        r.tanggalReservasi === formData.tanggalReservasi
    )
    .map((r) => r.jam);

  // Pilihan jam yang tersedia
  const availableJamOptions = variables.jam
    .filter((jam) => !reservedJam.includes(jam))
    .map((jam) => ({
      label: jam,
      value: jam,
    }));

  return (
    <GridX>
      <GridY>
        <Label label="Poli" />
        <InputSelect
          name="poli"
          options={poli.map((item) => ({
            label: item.poli,
            value: item.id,
          }))}
          placeholder="Poli"
          value={formData.poli}
          onChange={(e) => {
            onChange("poli", e.target.value);
            onChange("dokter", "");
          }}
        />
      </GridY>
      <GridY>
        <Label label="Dokter" />
        <InputSelect
          name="dokter"
          options={filteredDokter.map((item) => ({
            label: item.nama,
            value: item.id,
          }))}
          placeholder="Dokter"
          value={formData.dokter}
          onChange={(e) => onChange("dokter", e.target.value)}
        />
      </GridY>
      <GridY>
        <Label label="Tanggal Reservasi" htmlFor="tanggalReservasi" />
        <InputDate
          min={getToday()}
          max={getTodayOffsetDate(7)}
          htmlFor="tanggalReservasi"
          value={formData.tanggalReservasi}
          onChange={(e) => onChange("tanggalReservasi", e.target.value)}
        />
      </GridY>
      <GridY>
        <Label label="Jam" />
        <InputSelect
          name="jam"
          options={availableJamOptions}
          placeholder="Jam"
          value={formData.jam}
          onChange={(e) => onChange("jam", e.target.value)}
        />
      </GridY>
      <GridY>
        <Label label="Tipe Pembayaran" />
        <InputSelect
          placeholder="Tipe Pembayaran"
          name="tipePembayaran"
          options={variables.tipePembayaran.map((tipePembayaran) => ({
            label: tipePembayaran,
            value: tipePembayaran,
          }))}
          value={formData.tipePembayaran}
          onChange={(e) => onChange("tipePembayaran", e.target.value)}
        />
      </GridY>
    </GridX>
  );
}

// Komponen untuk menampilkan data konfirmasi sebelum submit
function Konfirmasi({ formData, poli, dokter }) {
  // Fungsi untuk mendapatkan label dari id poli/dokter
  const getLabel = (value, dataArray, labelKey = "poli") => {
    if (!dataArray || dataArray.length === 0) return value;
    const found = dataArray.find((item) => item.id === value);
    return found ? found[labelKey] : value;
  };

  // Data yang akan ditampilkan pada tabel konfirmasi
  const data = [
    { label: "NIK", value: formData.nik },
    { label: "Nama Lengkap", value: formData.namaLengkap },
    { label: "Tempat Lahir", value: formData.tempatLahir },
    { label: "Tanggal Lahir", value: formData.tanggalLahir },
    { label: "Jenis Kelamin", value: formData.jenisKelamin },
    { label: "Nomor Telepon", value: formData.nomorTelepon },
    { label: "Alamat", value: formData.alamat },
    { label: "Poli", value: getLabel(formData.poli, poli, "poli") },
    { label: "Dokter", value: getLabel(formData.dokter, dokter, "nama") },
    { label: "Tanggal Reservasi", value: formData.tanggalReservasi },
    { label: "Jam", value: formData.jam },
    { label: "Tipe Pembayaran", value: formData.tipePembayaran },
  ];

  // Kolom untuk tabel konfirmasi
  const columns = [
    { header: "Form", accessor: "label" },
    { header: "Input", accessor: "value" },
  ];

  // Tampilkan tabel konfirmasi
  return <Table columns={columns} data={data} variant="same-width" />;
}

export default Registration;
