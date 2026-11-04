CREATE TABLE pengguna (
    id_pengguna SERIAL PRIMARY KEY,
    nama_lengkap VARCHAR(100) NOT NULL,
    no_kontak VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    no_rt VARCHAR(5),
    no_rw VARCHAR(5)
);

CREATE TABLE balita (
    id_balita SERIAL PRIMARY KEY,
    id_ibu INT NOT NULL REFERENCES pengguna(id_pengguna) ON DELETE CASCADE,
    nama_balita VARCHAR(100) NOT NULL,
    tanggal_lahir DATE NOT NULL,
    jenis_kelamin CHAR(1) NOT NULL
);

CREATE TABLE jadwal_posyandu (
    id_jadwal SERIAL PRIMARY KEY,
    nama_kegiatan VARCHAR(150) NOT NULL,
    tanggal_kegiatan DATE NOT NULL,
    waktu_mulai TIME NOT NULL,
    waktu_selesai TIME NOT NULL,
    nama_lokasi VARCHAR(150) NOT NULL,
    tautan_maps VARCHAR(255) NOT NULL,
    status_penetapan VARCHAR(30) DEFAULT 'Belum Dipastikan',
    status_hari_h VARCHAR(30) DEFAULT 'Terjadwal',
    keterangan_status VARCHAR(255)
);

CREATE TABLE sesi_rekomendasi (
    id_sesi SERIAL PRIMARY KEY,
    id_jadwal INT NOT NULL REFERENCES jadwal_posyandu(id_jadwal) ON DELETE CASCADE,
    jam_mulai TIME NOT NULL,
    jam_selesai TIME NOT NULL,
    nama_sesi VARCHAR(100) NOT NULL
);

CREATE TABLE master_item_bawaan (
    id_item SERIAL PRIMARY KEY,
    nama_item VARCHAR(150) NOT NULL,
    kategori_item VARCHAR(50) NOT NULL
);

CREATE TABLE checklist_persiapan_ibu (
    id_checklist SERIAL PRIMARY KEY,
    id_jadwal INT NOT NULL REFERENCES jadwal_posyandu(id_jadwal) ON DELETE CASCADE,
    id_ibu INT NOT NULL REFERENCES pengguna(id_pengguna) ON DELETE CASCADE,
    id_item INT NOT NULL REFERENCES master_item_bawaan(id_item) ON DELETE CASCADE,
    sudah_disiapkan BOOLEAN DEFAULT FALSE
);

CREATE TABLE catatan_tumbuh_kembang (
    id_catatan SERIAL PRIMARY KEY,
    id_balita INT NOT NULL REFERENCES balita(id_balita) ON DELETE CASCADE,
    id_jadwal INT NOT NULL REFERENCES jadwal_posyandu(id_jadwal) ON DELETE CASCADE,
    status_presensi VARCHAR(30) NOT NULL,
    berat_badan_kg DECIMAL(4,2),
    tinggi_badan_cm DECIMAL(5,2),
    target_kbm_gram INT,
    status_gizi VARCHAR(30),
    catatan_kader VARCHAR(255)
);