require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();

app.use(express.json());


const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

//Post
app.post('/api/jadwal', async (req, res) => {
    try {
        const {
            nama_kegiatan,
            tanggal_kegiatan,
            waktu_mulai,
            waktu_selesai,
            nama_lokasi,
            tautan_maps,
            status_penetapan = 'Belum Dipastikan',
            status_hari_h = 'Terjadwal',
            keterangan_status = null
        } = req.body || {};

        const query = `
            INSERT INTO jadwal_posyandu 
            (nama_kegiatan, tanggal_kegiatan, waktu_mulai, waktu_selesai, nama_lokasi, tautan_maps, status_penetapan, status_hari_h, keterangan_status) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
            RETURNING *`;
        const values = [nama_kegiatan, tanggal_kegiatan, waktu_mulai, waktu_selesai, nama_lokasi, tautan_maps, status_penetapan, status_hari_h, keterangan_status];

        const result = await pool.query(query, values);
        res.status(201).json({
            status: 'success',
            message: 'Jadwal posyandu berhasil ditambahkan',
            data: result.rows[0]
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Get all
app.get('/api/jadwal', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM jadwal_posyandu ORDER BY id_jadwal ASC');
        res.status(200).json({
            status: 'success',
            data: result.rows
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Get satuan/id
app.get('/api/jadwal/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM jadwal_posyandu WHERE id_jadwal = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Jadwal posyandu tidak ditemukan' });
        }
        res.status(200).json({
            status: 'success',
            data: result.rows[0]
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Put
app.put('/api/jadwal/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            nama_kegiatan,
            tanggal_kegiatan,
            waktu_mulai,
            waktu_selesai,
            nama_lokasi,
            tautan_maps,
            status_penetapan,
            status_hari_h,
            keterangan_status
        } = req.body || {};

        const query = `
            UPDATE jadwal_posyandu 
            SET nama_kegiatan = $1, tanggal_kegiatan = $2, waktu_mulai = $3, waktu_selesai = $4, 
                nama_lokasi = $5, tautan_maps = $6, status_penetapan = $7, status_hari_h = $8, keterangan_status = $9
            WHERE id_jadwal = $10 
            RETURNING *`;
        const values = [nama_kegiatan, tanggal_kegiatan, waktu_mulai, waktu_selesai, nama_lokasi, tautan_maps, status_penetapan, status_hari_h, keterangan_status, id];

        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Jadwal posyandu tidak ditemukan' });
        }
        res.status(200).json({
            status: 'success',
            message: 'Jadwal posyandu berhasil diperbarui',
            data: result.rows[0]
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Delete
app.delete('/api/jadwal/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM jadwal_posyandu WHERE id_jadwal = $1 RETURNING *', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Jadwal posyandu tidak ditemukan' });
        }
        res.status(200).json({
            status: 'success',
            message: 'Jadwal posyandu berhasil dihapus',
            deleted_data: result.rows[0]
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server aktif di http://localhost:${PORT}`);
});