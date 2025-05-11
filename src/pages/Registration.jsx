import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "../components/Button";
import { serverUrl } from "../constants/global";
import {
  InputText,
  InputSelect,
  InputDate,
  InputNumber,
  Label,
} from "../components/Input";

import { getToday, getTodayOffsetDate } from "../utils/time";

function Registration() {
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

  const [poli, setPoli] = useState([]);
  const [dokter, setDokter] = useState([]);
  const [variables, setVariables] = useState({
    jam: [],
    tipePembayaran: [],
    jenisKelamin: [],
  });
  const [reservasi, setReservasi] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          poliResponse,
          dokterResponse,
          variablesResponse,
          reservasiResponse,
        ] = await Promise.all([
          axios.get(`${serverUrl}/poli`),
          axios.get(`${serverUrl}/dokter`),
          axios.get(`${serverUrl}/variables`),
          axios.get(`${serverUrl}/reservasi`),
        ]);

        setPoli(poliResponse.data);
        setDokter(dokterResponse.data);
        setVariables(variablesResponse.data);
        setReservasi(reservasiResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
      await axios.post(`${serverUrl}/pasien`, newPasien);

      await axios.post(`${serverUrl}/reservasi`, newReservasi);

      console.log("Data successfully added!");
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
    } catch (error) {
      console.error("Error inserting data:", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex items-start">
          <div className="grid">
            <Biodata
              formData={formData}
              onChange={handleChange}
              variables={variables}
            />
          </div>
          <div className="grid">
            <Reservasi
              formData={formData}
              onChange={handleChange}
              poli={poli}
              dokter={dokter}
              variables={variables}
              reservasi={reservasi}
            />
          </div>
        </div>
        <div>
          <Button type="submit" text="Daftar" />
        </div>
      </form>
    </>
  );
}

function Biodata({ formData, onChange, variables }) {
  return (
    <>
      <Label label="NIK" htmlFor="nik" />
      <InputText
        placeholder="Nomor KTP"
        htmlFor="nik"
        value={formData.nik}
        onChange={(e) => onChange("nik", e.target.value)}
      />

      <Label label="Nama Lengkap Pasien" htmlFor="namaLengkap" />
      <InputText
        placeholder="Contoh: Budi Santoso"
        htmlFor="namaLengkap"
        value={formData.namaLengkap}
        onChange={(e) => onChange("namaLengkap", e.target.value)}
      />

      <Label label="Tempat Lahir" htmlFor="tempatLahir" />
      <InputText
        placeholder="Contoh: Bandung"
        htmlFor="tempatLahir"
        value={formData.tempatLahir}
        onChange={(e) => onChange("tempatLahir", e.target.value)}
      />

      <Label label="Tanggal Lahir" htmlFor="tanggalLahir" />
      <InputDate
        min={getTodayOffsetDate(-45625)}
        max={getToday()}
        step="1"
        htmlFor="tanggalLahir"
        value={formData.tanggalLahir}
        onChange={(e) => onChange("tanggalLahir", e.target.value)}
      />

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

      <Label label="Nomor Telepon" htmlFor="nomorTelepon" />
      <InputNumber
        placeholder="Contoh: 08XXXXXXXXXX"
        htmlFor="nomorTelepon"
        value={formData.nomorTelepon}
        onChange={(e) => onChange("nomorTelepon", e.target.value)}
      />

      <Label label="Alamat" htmlFor="alamat" />
      <InputText
        placeholder="Sesuai KTP"
        htmlFor="alamat"
        value={formData.alamat}
        onChange={(e) => onChange("alamat", e.target.value)}
      />
    </>
  );
}

function Reservasi({ formData, onChange, poli, dokter, variables, reservasi }) {
  const filteredDokter = dokter.filter((dokter) =>
    dokter.poli.includes(formData.poli)
  );

  const reservedJam = reservasi
    .filter(
      (r) =>
        r.dokter === formData.dokter &&
        r.tanggalReservasi === formData.tanggalReservasi
    )
    .map((r) => r.jam);

  const availableJamOptions = variables.jam
    .filter((jam) => !reservedJam.includes(jam))
    .map((jam) => ({
      label: jam,
      value: jam,
    }));

  return (
    <>
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

      <Label label="Tanggal Reservasi" htmlFor="tanggalReservasi" />
      <InputDate
        min={getToday()}
        max={getTodayOffsetDate(7)}
        htmlFor="tanggalReservasi"
        value={formData.tanggalReservasi}
        onChange={(e) => onChange("tanggalReservasi", e.target.value)}
      />

      <Label label="Jam" />
      <InputSelect
        name="jam"
        options={availableJamOptions}
        placeholder="Jam"
        value={formData.jam}
        onChange={(e) => onChange("jam", e.target.value)}
      />

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
    </>
  );
}

export default Registration;
