require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

// Konfigurasi Multer untuk penyimpanan file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Simpan file di folder 'uploads/'
  },
  filename: function (req, file, cb) {
    // Buat nama file unik: timestamp + nama asli file
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});
const upload = multer({ storage: storage });

const app = express();
app.use(cors());
const PORT = 3000;

// Middleware BARU: Agar Express bisa membaca data JSON dari body request
app.use(express.json());

// Konfigurasi koneksi ke database
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// --- FUNGSI BARU: Untuk membuat Nomor Laporan Unik ---
function generateNomorLaporan(jenisBencana) {
    const kodeBencana = {
        'Banjir': 'BJ',
        'Gempa Bumi': 'GB',
        'Tanah Longsor': 'TL',
        'Angin Topan': 'AT',
        'Kekeringan': 'KR',
        'Karhutla': 'KH'
    };

    const kode = kodeBencana[jenisBencana] || 'XX'; // 'XX' jika jenis tidak dikenal
    const now = new Date();
    
    // Format tanggal: ddmmyy
    const tanggal = now.getDate().toString().padStart(2, '0');
    const bulan = (now.getMonth() + 1).toString().padStart(2, '0');
    const tahun = now.getFullYear().toString().slice(-2);
    
    // Format waktu: HHMMSS
    const jam = now.getHours().toString().padStart(2, '0');
    const menit = now.getMinutes().toString().padStart(2, '0');
    const detik = now.getSeconds().toString().padStart(2, '0');

    // 4 Angka acak
    const acak = Math.floor(1000 + Math.random() * 9000);

    return `${kode}${tanggal}${bulan}${tahun}${jam}${menit}${detik}${acak}`;
}


// --- API ENDPOINT BARU: Menerima Laporan Bencana ---
app.post('/api/laporan', async (req, res) => {
    try {
        // 1. Ambil data yang dikirim oleh frontend dari request body
        const { jenis_bencana, deskripsi, lokasi, pelapor_kontak } = req.body;

        // 2. Validasi sederhana (pastikan data penting tidak kosong)
        if (!jenis_bencana || !deskripsi || !lokasi) {
            return res.status(400).json({ message: 'Jenis bencana, deskripsi, dan lokasi wajib diisi.' });
        }
        
        // 3. Buat nomor laporan unik
        const nomor_laporan = generateNomorLaporan(jenis_bencana);

        // 4. Siapkan query SQL untuk menyimpan data
        const sql = `
            INSERT INTO laporan_masuk 
            (nomor_laporan, jenis_bencana, deskripsi, lokasi, pelapor_kontak, status_validasi, waktu_laporan) 
            VALUES (?, ?, ?, ?, ?, 'Masuk', NOW())
        `;
        const values = [nomor_laporan, jenis_bencana, deskripsi, lokasi, pelapor_kontak];

        // 5. Jalankan query ke database
        await pool.query(sql, values);

        // 6. Kirim balasan sukses ke frontend
        res.status(201).json({
            message: 'Laporan berhasil dibuat!',
            nomorLaporan: nomor_laporan
        });

    } catch (error) {
        console.error('Error saat menyimpan laporan:', error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
});


// Route untuk menguji koneksi database
app.get('/api/test-db', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS solution');
        res.json({ message: 'Koneksi ke database berhasil!', result: rows[0].solution });
    } catch (error) {
        res.status(500).json({ message: 'Gagal terhubung ke database.' });
    }
});


// --- API ENDPOINT BARU: Membaca Semua Tugas ---
app.get('/api/tugas', async (req, res) => {
    try {
        // 1. Buat query SQL untuk mengambil semua data dari tabel 'tugas'
        // Diurutkan berdasarkan prioritas, lalu yang terbaru
         const sql = `
            SELECT 
              tugas.*, 
              relawan.nama_lengkap as pic_nama 
            FROM tugas 
            LEFT JOIN relawan ON tugas.relawan_id = relawan.id 
            ORDER BY 
              FIELD(prioritas, 'Mendesak', 'Penting', 'Normal'), 
              created_at DESC
          `;

        // 2. Jalankan query
        const [rows] = await pool.query(sql);

        // 3. Kirim hasilnya sebagai balasan JSON
        res.json(rows);

    } catch (error) {
        console.error('Error saat mengambil data tugas:', error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
});

app.get('/api/user/me', (req, res) => {
  // NOTE: Nanti, setelah ada sistem login, 
  // kita akan mengambil data ini dari database berdasarkan user yang sedang login.
  // Untuk sekarang, kita kirim data dummy dulu.
  res.json({
    nama: 'Budi Sanjaya',
    lokasi: 'Relawan - Palembang'
  });
});

// Endpoint untuk data grafik TAHUNAN (per bulan)
app.get('/api/chart/tahunan', async (req, res) => {
  try {
    const sql = `
      SELECT MONTHNAME(created_at) as bulan, COUNT(*) as total 
      FROM tugas 
      WHERE created_at >= NOW() - INTERVAL 1 YEAR 
      GROUP BY bulan 
      ORDER BY MONTH(created_at);
    `;
    const [rows] = await pool.query(sql);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error server' });
  }
});

// Endpoint untuk data grafik BULANAN (per jenis bencana)
app.get('/api/chart/bulanan', async (req, res) => {
  try {
    const sql = `
      SELECT jenis_bencana, COUNT(*) as total 
      FROM tugas 
      WHERE created_at >= NOW() - INTERVAL 30 DAY 
      GROUP BY jenis_bencana 
      ORDER BY total DESC;
    `;
    const [rows] = await pool.query(sql);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error server' });
  }
});

// Endpoint untuk data grafik MINGGUAN (per hari)
app.get('/api/chart/mingguan', async (req, res) => {
  try {
    const sql = `
      SELECT DAYNAME(created_at) as hari, COUNT(*) as total 
      FROM tugas 
      WHERE created_at >= NOW() - INTERVAL 7 DAY 
      GROUP BY hari, DAYOFWEEK(created_at) 
      ORDER BY DAYOFWEEK(created_at);
    `;
    const [rows] = await pool.query(sql);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error server' });
  }
});

// Endpoint BARU untuk meng-update status sebuah tugas
app.put('/api/tugas/:id/status', async (req, res) => {
  const { id } = req.params; // Ambil ID tugas dari URL
  const { status, catatan } = req.body; // Ambil status baru dan catatan dari body
  
  // (Asumsi relawan_id = 1 untuk sementara, nanti ini diambil dari data login)
  const relawan_id = 1; 

  if (!status) {
    return res.status(400).json({ message: 'Status wajib diisi.' });
  }

  const connection = await pool.getConnection(); // Dapatkan koneksi dari pool

  try {
    await connection.beginTransaction(); // Mulai transaksi

    // Query 1: Update status di tabel 'tugas'
    const updateTugasSql = "UPDATE tugas SET status = ? WHERE id = ?";
    await connection.query(updateTugasSql, [status, id]);

    // Query 2: Catat riwayat perubahan di tabel 'laporan_status'
    const insertLaporanSql = "INSERT INTO laporan_status (tugas_id, relawan_id, catatan) VALUES (?, ?, ?)";
    await connection.query(insertLaporanSql, [id, relawan_id, catatan]);

    await connection.commit(); // Konfirmasi semua query berhasil
    res.json({ message: `Status tugas #${id} berhasil diupdate menjadi '${status}'` });

  } catch (error) {
    await connection.rollback(); // Batalkan semua query jika ada error
    console.error('Error saat update status:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  } finally {
    connection.release(); // Selalu lepaskan koneksi
  }
});

// Endpoint BARU untuk menerima upload dokumentasi
app.post('/api/dokumentasi', upload.single('foto'), async (req, res) => {
  try {
    const { deskripsi, lokasi_gps, tugas_id, relawan_id } = req.body;
    const file_path = req.file.path; // Path file yang disimpan oleh Multer

    if (!req.file) {
      return res.status(400).json({ message: 'File foto wajib diisi.' });
    }

    const sql = `
      INSERT INTO dokumentasi (tugas_id, relawan_id, file_path, deskripsi, lokasi_gps)
      VALUES (?, ?, ?, ?, ?)
    `;
    // Untuk sementara, kita isi tugas_id dan relawan_id dengan angka 1
    const values = [1, 1, file_path, deskripsi, lokasi_gps];

    await pool.query(sql, values);

    res.status(201).json({ message: 'Dokumentasi berhasil diunggah!' });
  } catch (error) {
    console.error("Error saat unggah dokumentasi:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});

// Ganti endpoint lama dengan yang ini
app.get('/api/laporan/mendesak', async (req, res) => {
  try {
    // Ambil 1 tugas terbaru yang statusnya masih "Baru"
    const sql = `
      SELECT * FROM tugas 
      WHERE status = 'Baru' 
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    const [rows] = await pool.query(sql);
    res.json(rows); 
  } catch (error) {
    console.error('Error saat mengambil data alert:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});

// Endpoint BARU untuk membuat tugas dari laporan yang masuk
app.post('/api/tugas', async (req, res) => {
  const { laporanId } = req.body;
  if (!laporanId) {
    return res.status(400).json({ message: 'laporanId wajib diisi.' });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Ambil data dari laporan_masuk
    const [laporanRows] = await connection.query('SELECT * FROM laporan_masuk WHERE id = ?', [laporanId]);
    if (laporanRows.length === 0) {
      throw new Error('Laporan tidak ditemukan.');
    }
    const laporan = laporanRows[0];

    // 2. Buat entri baru di tabel 'tugas' dengan menyalin data
    const tugasSql = `
      INSERT INTO tugas (judul_tugas, jenis_bencana, deskripsi, lokasi, prioritas, status, laporan_masuk_id, nomor_laporan)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    // (Untuk prioritas & status, kita bisa buat logika default atau terima dari admin)
    const tugasValues = [
      `${laporan.jenis_bencana} di ${laporan.lokasi}`, // Judul tugas otomatis
      laporan.jenis_bencana,
      laporan.deskripsi,
      laporan.lokasi,
      'Mendesak', // Prioritas default
      'Baru',     // Status default
      laporanId,
      laporan.nomor_laporan // <-- INI BAGIAN PENTINGNYA
    ];
    await connection.query(tugasSql, tugasValues);

    // 3. Update status laporan_masuk menjadi 'Divalidasi'
    await connection.query("UPDATE laporan_masuk SET status_validasi = 'Divalidasi' WHERE id = ?", [laporanId]);

    await connection.commit();
    res.status(201).json({ message: 'Tugas berhasil dibuat dari laporan.' });

  } catch (error) {
    await connection.rollback();
    console.error('Error saat membuat tugas:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  } finally {
    connection.release();
  }
});

const bcrypt = require('bcryptjs');

// Endpoint BARU untuk registrasi relawan baru
app.post('/api/auth/register', async (req, res) => {
  try {
    const { nama_lengkap, email, password, lokasi } = req.body;

    if (!nama_lengkap || !email || !password) {
      return res.status(400).json({ message: 'Nama, email, dan password wajib diisi.' });
    }

    // Enkripsi password sebelum disimpan
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const sql = `
      INSERT INTO relawan (nama_lengkap, email, password, lokasi) 
      VALUES (?, ?, ?, ?)
    `;
    const values = [nama_lengkap, email, hashedPassword, lokasi];

    await pool.query(sql, values);

    res.status(201).json({ message: 'Registrasi relawan berhasil!' });

  } catch (error) {
    // Tangani jika email sudah ada
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Email sudah terdaftar.' });
    }
    console.error('Error saat registrasi:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});

// Endpoint BARU untuk Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password wajib diisi.' });
    }

    // 1. Cari user berdasarkan email
    const sql = "SELECT * FROM relawan WHERE email = ?";
    const [rows] = await pool.query(sql, [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Email tidak ditemukan.' });
    }
    const user = rows[0];

    // 2. Bandingkan password yang diinput dengan yang ada di database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Password salah.' });
    }

    // 3. Jika password cocok, buat token JWT
    const payload = {
      id: user.id,
      nama: user.nama_lengkap
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }); // Token berlaku 1 jam

    res.json({ message: 'Login berhasil!', token: token });

  } catch (error) {
    console.error('Error saat login:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`http://localhost:${PORT}`);
});