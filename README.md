# Lantai Atas

Game horror 2D berbasis web (HTML/CSS/JS murni) — bab 1 "Kunci Lama". Setting: apartemen kosong di lantai teratas gedung tua. Ada 3 ruangan yang bisa dijelajahi, 4 cutscene sinematik, sistem dialog, dan 1 jumpscare scripted.

## Cara main lokal
Buka `index.html` langsung di browser HP/laptop — file statis, gak butuh server.

## Cara upload ke GitHub Pages
1. Buat repo baru di GitHub (Public)
2. Upload semua file & folder ini: `index.html`, `style.css`, `story.js`, `game.js`, `manifest.json`, `service-worker.js`, `README.md`, dan folder `assets/` (isinya ikon + foto)
3. Settings → Pages → Source: **Deploy from a branch** → Branch `main` / `root` → Save
4. Tunggu 1-2 menit, buka link `https://username-lu.github.io/nama-repo/`

## Install jadi app di HP
- **Android (Chrome):** notifikasi "Install app" muncul otomatis, atau titik tiga → "Add to Home screen"
- **iPhone (Safari):** tombol Share → "Add to Home Screen"

## Struktur cerita bab 1
1. **Cutscene — Kedatangan**: naik tangga ke lantai 14
2. **Scene — Lorong**: cek kotak surat, buka pintu unit
3. **Cutscene — Masuk Unit**: lampu berkedip saat masuk
4. **Scene — Ruang Tengah**: TV tua, foto keluarga (trigger flashback)
5. **Cutscene — Kilas Balik**: visi masa lalu penghuni sebelumnya
6. **Scene — Kamar**: buka lemari (jumpscare), lihat ke jendela
7. **Cutscene — Akhir Bab**: cliffhanger, sosok di gedung seberang

## Nambah cerita / bab baru
Semua isi ada di `story.js`:
- `STORY.scenes` — ruangan yang bisa dijelajahi (sama seperti sebelumnya: `bg()`, `playerStart`, `hotspots`)
- `STORY.cutscenes` — sekuens sinematik. Tiap cutscene punya `lines` (narasi bertahap, tap buat lanjut) dan `draw(ctx,w,h,elapsedMs)` (animasi latar berjalan terus selama cutscene tampil)
- Hotspot bisa punya `cutscene: "id"` untuk main cutscene sebelum lanjut (dicek sebelum `goto`)
- `STORY.jumpscares` — sama seperti sebelumnya

`game.js` (mesin game) gak perlu diubah kecuali mau nambah mekanik baru.

## Orientasi layar

Game ini didesain **landscape (horizontal)**. Kalau HP dipegang tegak, otomatis muncul layar "putar HP kamu" sampai HP diputar ke horizontal — jadi gak akan ketampil versi gepeng/rusak.

Pas tap "ketuk untuk masuk", game juga otomatis coba masuk fullscreen + kunci ke landscape (kalau browser-nya support). Kalau browser gak support, tetap aman — layar "putar HP" di atas jadi cadangannya.

## Kontrol
- Tap di layar → jalan ke titik itu
- Tap dekat objek bercahaya → "ketuk untuk berinteraksi"
- Tap saat dialog/cutscene → percepat teks / lanjut

## Ganti foto di loading screen
Timpa `assets/user-photo.jpg` dengan foto lu sendiri (idealnya persegi, ~400x400px), upload ulang ke GitHub di folder `assets/`.
