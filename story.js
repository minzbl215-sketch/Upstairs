/* ============================================================
   STORY.JS — "Lantai Atas", bab 1: Kunci Lama

   Struktur scene sama seperti sebelumnya. STORY.cutscenes untuk
   sekuens sinematik. STORY.puzzles untuk teka-teki kode 3 digit
   (dipicu lewat hotspot.puzzle = "id", dicek sebelum jumpscare/
   cutscene/goto pada hotspot yang sama).
============================================================ */

const STORY = {

  openingCutscene: "kedatangan",
  startScene: "depan_unit",

  scenes: [

    // ---------------------------------------------------------
    {
      id: "depan_unit",
      label: "Lorong Lantai 14",
      playerStart: { x: 0.5, y: 0.66 },
      bg(ctx, w, h, t) {
        ctx.fillStyle = "#0d0f10";
        ctx.fillRect(0, 0, w, h);

        // pintu lift rusak di ujung lorong (paling kiri, jauh)
        ctx.fillStyle = "#161a1b";
        ctx.fillRect(0, h * 0.24, w * 0.02, h * 0.34);

        // sosok misterius — muncul samar & langka di ujung lorong dekat lift,
        // lalu hilang lagi. Murni ambient, gak bisa didekati/diinteraksi.
        const flicker = Math.sin((t || 0) / 4200);
        if (flicker > 0.93) {
          const op = (flicker - 0.93) / 0.07 * 0.35;
          ctx.fillStyle = `rgba(159,180,176,${op})`;
          ctx.beginPath(); ctx.arc(w * 0.03, h * 0.44, w * 0.014, 0, Math.PI * 2); ctx.fill(); // kepala
          ctx.fillRect(w * 0.018, h * 0.46, w * 0.024, h * 0.1); // badan
        }
        // lantai keramik retak
        ctx.fillStyle = "#15181a";
        ctx.fillRect(0, h * 0.58, w, h * 0.42);
        for (let i = 0; i < 10; i++) {
          ctx.strokeStyle = "rgba(0,0,0,.35)";
          ctx.beginPath();
          ctx.moveTo(i * w / 9, h * 0.58); ctx.lineTo(i * w / 9, h);
          ctx.stroke();
        }
        // noda lembab di lantai
        ctx.fillStyle = "rgba(20,30,26,0.4)";
        ctx.beginPath(); ctx.ellipse(w * 0.25, h * 0.85, w * 0.06, h * 0.03, 0, 0, Math.PI * 2); ctx.fill();
        // dinding koridor
        ctx.fillStyle = "#1c2022";
        ctx.fillRect(0, h * 0.2, w, h * 0.38);
        // retakan & noda dinding
        ctx.strokeStyle = "rgba(0,0,0,.3)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(w * 0.08, h * 0.22); ctx.lineTo(w * 0.12, h * 0.4); ctx.lineTo(w * 0.09, h * 0.5); ctx.stroke();
        // pipa air vertikal
        ctx.fillStyle = "#2a2f30";
        ctx.fillRect(w * 0.02, h * 0.2, w * 0.012, h * 0.38);
        ctx.fillStyle = "rgba(154,74,43,0.5)"; // karat
        ctx.fillRect(w * 0.017, h * 0.3, w * 0.008, h * 0.04);
        // kabel menjuntai dari plafon
        ctx.strokeStyle = "#161616"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(w * 0.3, h * 0.2); ctx.quadraticCurveTo(w * 0.32, h * 0.3, w * 0.29, h * 0.34); ctx.stroke();
        // kotak alat pemadam di dinding kanan
        ctx.fillStyle = "#5c1f1f";
        ctx.fillRect(w * 0.88, h * 0.32, w * 0.06, h * 0.14);
        ctx.strokeStyle = "#000"; ctx.strokeRect(w * 0.88, h * 0.32, w * 0.06, h * 0.14);
        // lampu neon di plafon (berkedip lewat animasi terpisah di game.js)
        ctx.fillStyle = "#b8d8c9";
        ctx.fillRect(w * 0.38, h * 0.12, w * 0.24, h * 0.015);
        // pintu unit 14B
        ctx.fillStyle = "#2b2420";
        ctx.fillRect(w * 0.4, h * 0.22, w * 0.2, h * 0.38);
        ctx.strokeStyle = "#000"; ctx.strokeRect(w * 0.4, h * 0.22, w * 0.2, h * 0.38);
        ctx.fillStyle = "#b8d8c9";
        ctx.fillRect(w * 0.47, h * 0.34, w * 0.06, h * 0.02); // plat nomor
        ctx.fillStyle = "#8a8a80";
        ctx.beginPath(); ctx.arc(w * 0.57, h * 0.42, w * 0.006, 0, Math.PI * 2); ctx.fill(); // gagang pintu
        // keset usang depan pintu
        ctx.fillStyle = "#3a3226";
        ctx.fillRect(w * 0.42, h * 0.6, w * 0.16, h * 0.05);
        // kotak surat di dinding kiri
        ctx.fillStyle = "#3a3530";
        ctx.fillRect(w * 0.1, h * 0.42, w * 0.1, h * 0.08);
        ctx.strokeStyle = "#000"; ctx.strokeRect(w * 0.1, h * 0.42, w * 0.1, h * 0.08);
        // tanaman mati dalam pot di sudut
        ctx.fillStyle = "#4a3a2a";
        ctx.fillRect(w * 0.94, h * 0.68, w * 0.04, h * 0.06);
        ctx.strokeStyle = "#2a2018"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(w * 0.96, h * 0.68); ctx.lineTo(w * 0.955, h * 0.58); ctx.lineTo(w * 0.965, h * 0.6); ctx.stroke();

        // Pak Tirta — tetangga tua, satu-satunya penghuni lain yang keliatan
        ctx.save();
        ctx.translate(w * 0.68, h * 0.7);
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.beginPath(); ctx.ellipse(0, 17, 11, 3, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#3a352e"; // celana
        ctx.fillRect(-6, 0, 5, 14); ctx.fillRect(1, 0, 5, 14);
        ctx.fillStyle = "#4a4038"; // cardigan
        ctx.fillRect(-8, -16, 16, 18);
        ctx.fillStyle = "#caa07a"; // tangan pegang tongkat
        ctx.fillRect(6, -8, 3, 12);
        ctx.strokeStyle = "#2a2018"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(9, -6); ctx.lineTo(9, 16); ctx.stroke(); // tongkat
        ctx.fillStyle = "#caa07a";
        ctx.beginPath(); ctx.arc(0, -21, 6, 0, Math.PI * 2); ctx.fill(); // kepala
        ctx.fillStyle = "#8a8a80"; // rambut putih
        ctx.beginPath(); ctx.arc(0, -24, 6.3, Math.PI * 1.05, Math.PI * 1.95); ctx.fill();
        ctx.restore();
      },
      hotspots: [
        {
          id: "tetangga",
          x: 0.68, y: 0.65, r: 0.08,
          requiresFlag: null,
          lines: [
            { name: "Pak Tirta", text: "Kamu... keluarga dari Bu Aminah?" },
            { name: "Ray", text: "Iya, Pak. Saya cucunya." },
            { name: "Pak Tirta", text: "Sudah lama sekali gak ada yang ke unit itu. Kami kira gak akan ada yang datang lagi." },
            { name: "Ray", text: "Memangnya kenapa, Pak?" },
            { name: "Pak Tirta", text: "...gak, gak apa-apa. Kamu hati-hati aja ya." },
            { name: "Pak Tirta", text: "Kalau nanti denger suara aneh malam-malam, jangan dibalas ngobrol. Cukup diam saja." },
            { name: "Ray", text: "Maksud Bapak apa—" },
            { name: "", text: "Belum sempat aku menyelesaikan kalimat, dia sudah membalikkan badan dan berjalan pelan menjauh." },
            { name: "Ray", text: "Aku menatap punggungnya yang menghilang di ujung koridor. Entah kenapa, aku tidak mengejar untuk bertanya lagi." },
          ],
          setFlag: "temu_tetangga",
          oneTime: true,
        },
        {
          id: "kotak_surat",
          x: 0.15, y: 0.46, r: 0.08,
          requiresFlag: null,
          lines: [
            { name: "Ray", text: "Kotak surat unit ini penuh, tak pernah diambil." },
            { name: "Ray", text: "Semua atas nama yang sama: Ny. Aminah. Tertanggal dua tahun lalu." },
            { name: "Ray", text: "Satu amplop belum sempat disegel. Isinya cuma satu baris tulisan tangan:" },
            { name: "surat", text: "\"...kalau kamu baca ini, berarti aku sudah tidak sempat menjelaskan.\"" },
            { name: "Ray", text: "Aku masukkan lagi amplop itu ke sakuku. Tanganku sedikit gemetar." },
          ],
          setFlag: "cek_surat",
          oneTime: true,
        },
        {
          id: "apar",
          x: 0.91, y: 0.4, r: 0.07,
          requiresFlag: null,
          lines: [
            { name: "Ray", text: "Kotak alat pemadam ini kosong. Kacanya retak, seperti pernah dipukul dari dalam." },
            { name: "Ray", text: "Aneh — kenapa dari dalam?" },
          ],
          oneTime: true,
        },
        {
          id: "pintu_unit",
          x: 0.5, y: 0.4, r: 0.1,
          requiresFlag: "cek_surat",
          lockedLines: [
            { name: "Ray", text: "Kunci ini gak akan cocok kalau aku belum yakin ini unit yang benar." },
            { name: "Ray", text: "Aku harus pastikan dulu dari surat-surat di kotak pos itu." },
          ],
          lines: [
            { name: "Ray", text: "Kunci warisan itu masuk pas ke lubangnya. Seperti memang untuk pintu ini." },
            { name: "Ray", text: "Sebelum memutarnya, aku menarik napas panjang." },
          ],
          cutscene: "masuk_unit",
          goto: "ruang_tengah",
        },
      ],
    },

    // ---------------------------------------------------------
    {
      id: "ruang_tengah",
      label: "Unit 14B — Ruang Tengah",
      playerStart: { x: 0.5, y: 0.7 },
      bg(ctx, w, h) {
        ctx.fillStyle = "#0a0c0d";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#141718";
        ctx.fillRect(0, h * 0.55, w, h * 0.45);
        // karpet usang
        ctx.fillStyle = "#241f1a";
        ctx.fillRect(w * 0.28, h * 0.66, w * 0.24, h * 0.2);
        // jendela dengan lampu kota di kejauhan
        ctx.fillStyle = "#0e1a1c";
        ctx.fillRect(w * 0.62, h * 0.18, w * 0.28, h * 0.3);
        for (let i = 0; i < 14; i++) {
          ctx.fillStyle = Math.random() > 0.5 ? "rgba(184,216,201,0.5)" : "rgba(184,216,201,0.15)";
          ctx.fillRect(w * 0.64 + Math.random() * w * 0.24, h * 0.2 + Math.random() * h * 0.24, 2, 2);
        }
        // sofa tua di kiri
        ctx.fillStyle = "#26302c";
        ctx.fillRect(w * 0.02, h * 0.56, w * 0.2, h * 0.14);
        ctx.fillRect(w * 0.02, h * 0.5, w * 0.2, h * 0.08);
        // meja kecil + tumpukan koran
        ctx.fillStyle = "#2a2018";
        ctx.fillRect(w * 0.3, h * 0.62, w * 0.1, h * 0.05);
        ctx.fillStyle = "#3a352a";
        ctx.fillRect(w * 0.31, h * 0.58, w * 0.08, h * 0.04);
        // rak buku kecil
        ctx.fillStyle = "#1c1712";
        ctx.fillRect(w * 0.02, h * 0.36, w * 0.1, h * 0.14);
        ctx.strokeStyle = "#000"; ctx.strokeRect(w * 0.02, h * 0.36, w * 0.1, h * 0.14);
        for (let i = 0; i < 5; i++) {
          ctx.fillStyle = ["#5c1f1f", "#4a3a2a", "#2a3733", "#3a3226", "#1a2a24"][i];
          ctx.fillRect(w * 0.025 + i * w * 0.018, h * 0.38, w * 0.015, h * 0.1);
        }
        // jam dinding berhenti
        ctx.beginPath(); ctx.arc(w * 0.5, h * 0.15, w * 0.025, 0, Math.PI * 2);
        ctx.strokeStyle = "#5a4a30"; ctx.lineWidth = 1.5; ctx.stroke();
        // TV tua
        ctx.fillStyle = "#1a1a1a";
        ctx.fillRect(w * 0.1, h * 0.5, w * 0.18, h * 0.14);
        ctx.fillStyle = "#050505";
        ctx.fillRect(w * 0.12, h * 0.52, w * 0.14, h * 0.08);
        // kalender dinding
        ctx.fillStyle = "#e4ddc8";
        ctx.fillRect(w * 0.2, h * 0.24, w * 0.07, h * 0.09);
        ctx.strokeStyle = "#b13b3b"; ctx.lineWidth = 1.5;
        ctx.strokeRect(w * 0.222, h * 0.29, w * 0.026, h * 0.026);
        // foto keluarga di dinding
        ctx.strokeStyle = "#4a3f30"; ctx.lineWidth = 3;
        ctx.strokeRect(w * 0.42, h * 0.28, w * 0.1, h * 0.13);
        ctx.fillStyle = "#2a2a2a";
        ctx.fillRect(w * 0.42, h * 0.28, w * 0.1, h * 0.13);
        // bingkai foto kedua, kosong
        ctx.strokeStyle = "#3a3025"; ctx.lineWidth = 2;
        ctx.strokeRect(w * 0.54, h * 0.3, w * 0.06, h * 0.09);
        // pintu kamar
        ctx.fillStyle = "#201c18";
        ctx.fillRect(w * 0.78, h * 0.42, w * 0.14, h * 0.3);
        ctx.strokeStyle = "#000"; ctx.strokeRect(w * 0.78, h * 0.42, w * 0.14, h * 0.3);
      },
      hotspots: [
        {
          id: "tv_tua",
          x: 0.19, y: 0.54, r: 0.09,
          requiresFlag: null,
          lines: [
            { name: "Ray", text: "Debu tebal di atas TV ini. Tapi kabelnya masih tercolok ke listrik." },
            { name: "Ray", text: "Aku tekan tombolnya. Yang muncul cuma semut layar." },
          ],
          jumpscare: "tv_jumpscare",
          setFlag: "tv_hidup",
          oneTime: true,
        },
        {
          id: "kalender_dinding",
          x: 0.235, y: 0.3, r: 0.07,
          requiresFlag: null,
          lines: [
            { name: "Ray", text: "Kalender ini berhenti di bulan yang sama, dua tahun lalu." },
            { name: "Ray", text: "Ada tanggal yang dilingkari tebal pakai spidol merah: angka 9, dan di sampingnya angka 2 dicoret berkali-kali seperti diulang-ulang." },
            { name: "Ray", text: "Di bawahnya, tulisan kecil nyaris tak terbaca: \"jangan lupa kodenya, sebelum dia pulang.\"" },
          ],
          setFlag: "baca_kalender",
          oneTime: true,
        },
        {
          id: "foto_keluarga",
          x: 0.47, y: 0.34, r: 0.08,
          requiresFlag: null,
          lines: [
            { name: "Ray", text: "Foto tiga orang: ibu, dan dua anak. Salah satu wajah sudah tergores habis." },
            { name: "Ray", text: "Aku coba mengingat — apa aku pernah lihat wajah ini sebelumnya?" },
          ],
          setFlag: "lihat_foto",
          cutscene: "kilas_balik",
          oneTime: true,
        },
        {
          id: "rak_buku",
          x: 0.07, y: 0.42, r: 0.07,
          requiresFlag: null,
          lines: [
            { name: "Ray", text: "Buku-buku lama, sebagian sampulnya sudah lepas." },
            { name: "Ray", text: "Satu buku diary kecil terselip di baris paling bawah, terkunci gembok mini." },
            { name: "Ray", text: "Aku belum punya kuncinya. Kusimpan dulu di saku." },
          ],
          setFlag: "temu_diary",
          oneTime: true,
        },
        {
          id: "pintu_kamar",
          x: 0.85, y: 0.55, r: 0.09,
          requiresFlag: "lihat_foto",
          lockedLines: [
            { name: "Ray", text: "Belum. Aku belum mau masuk ke sana dulu." },
          ],
          lines: [
            { name: "Ray", text: "Pintu kamar itu sedikit terbuka, seakan menungguku." },
            { name: "Ray", text: "Dari celahnya, aku bisa mencium bau apak yang lebih tajam." },
          ],
          goto: "kamar",
        },
      ],
    },

    // ---------------------------------------------------------
    {
      id: "kamar",
      label: "Unit 14B — Kamar",
      playerStart: { x: 0.5, y: 0.7 },
      bg(ctx, w, h) {
        ctx.fillStyle = "#0a0b0c";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#131515";
        ctx.fillRect(0, h * 0.55, w, h * 0.45);
        // karpet kecil
        ctx.fillStyle = "#1e1a16";
        ctx.fillRect(w * 0.38, h * 0.68, w * 0.18, h * 0.16);
        // ranjang kecil
        ctx.fillStyle = "#1c1a17";
        ctx.fillRect(w * 0.08, h * 0.44, w * 0.26, h * 0.14);
        ctx.fillStyle = "#26221c";
        ctx.fillRect(w * 0.08, h * 0.4, w * 0.26, h * 0.05); // bantal/selimut
        // nakas kecil + lampu tidur
        ctx.fillStyle = "#221e19";
        ctx.fillRect(w * 0.36, h * 0.5, w * 0.06, h * 0.08);
        ctx.fillStyle = "#b8d8c9";
        ctx.beginPath(); ctx.arc(w * 0.39, h * 0.48, w * 0.008, 0, Math.PI * 2); ctx.fill();
        // meja rias dengan cermin kecil
        ctx.fillStyle = "#221e19";
        ctx.fillRect(w * 0.46, h * 0.52, w * 0.14, h * 0.08);
        ctx.fillStyle = "#0e1a1c";
        ctx.fillRect(w * 0.48, h * 0.34, w * 0.1, h * 0.18);
        ctx.strokeStyle = "#3a3025"; ctx.lineWidth = 2;
        ctx.strokeRect(w * 0.48, h * 0.34, w * 0.1, h * 0.18);
        // poster/bingkai di dinding
        ctx.strokeStyle = "#3a3025"; ctx.lineWidth = 2;
        ctx.strokeRect(w * 0.14, h * 0.28, w * 0.08, h * 0.1);
        // keranjang cucian di sudut
        ctx.fillStyle = "#2a3733";
        ctx.beginPath(); ctx.ellipse(w * 0.62, h * 0.58, w * 0.035, h * 0.03, 0, 0, Math.PI * 2); ctx.fill();
        // jendela
        ctx.fillStyle = "#0e1a1c";
        ctx.fillRect(w * 0.66, h * 0.2, w * 0.2, h * 0.22);
        // lemari besar di kanan
        ctx.fillStyle = "#1f1b17";
        ctx.fillRect(w * 0.7, h * 0.4, w * 0.22, h * 0.34);
        ctx.strokeStyle = "#000";
        ctx.beginPath(); ctx.moveTo(w * 0.81, h * 0.4); ctx.lineTo(w * 0.81, h * 0.74); ctx.stroke();
        ctx.fillStyle = "#3a3025";
        ctx.beginPath(); ctx.arc(w * 0.795, h * 0.58, w * 0.006, 0, Math.PI * 2); ctx.fill();
      },
      hotspots: [
        {
          id: "meja_rias",
          x: 0.53, y: 0.44, r: 0.08,
          requiresFlag: null,
          lines: [
            { name: "Ray", text: "Di atas meja rias ada bedak lama dan sisir berkarat." },
            { name: "Ray", text: "Terselip di sudut cermin, secarik kertas kecil terselip, tulisannya buru-buru:" },
            { name: "catatan", text: "\"...7. jangan buka lemari itu sebelum aku pulang.\"" },
            { name: "Ray", text: "Angka 7. Entah kenapa terasa penting." },
          ],
          setFlag: "baca_catatan",
          oneTime: true,
        },
        {
          id: "lemari",
          x: 0.81, y: 0.58, r: 0.1,
          requiresFlag: null,
          lines: [
            { name: "Ray", text: "Pegangan lemari ini dingin, dan ada kunci gembok kecil bertulisan angka." },
            { name: "Ray", text: "Sepertinya butuh kode tiga digit untuk membukanya." },
          ],
          puzzle: "lemari_kode",
          jumpscare: "lemari_jumpscare",
          setFlag: "buka_lemari",
          oneTime: true,
        },
        {
          id: "jendela",
          x: 0.76, y: 0.28, r: 0.09,
          requiresFlag: "buka_lemari",
          lockedLines: [
            { name: "Ray", text: "Jantungku masih berdebar. Belum sekarang." },
          ],
          lines: [
            { name: "Ray", text: "Dari jendela ini, aku bisa lihat lantai 14 gedung sebelah." },
            { name: "Ray", text: "Ada seseorang berdiri di sana. Menghadap ke arahku. Persis di jendela yang sama." },
          ],
          cutscene: "akhir_bab",
          goto: "END",
        },
      ],
    },

  ],

  // -----------------------------------------------------------
  // PUZZLES — kode 3 digit, jawabannya string 3 karakter
  // -----------------------------------------------------------
  puzzles: {
    lemari_kode: {
      solution: "927",
      prompt: "kode gembok lemari — 3 digit",
    },
  },

  // -----------------------------------------------------------
  // CUTSCENES — animasi latar ambient + narasi bertahap (tap lanjut)
  // -----------------------------------------------------------
  cutscenes: {

    kedatangan: {
      lines: [
        "Lift gedung ini sudah rusak sejak lama. Sepuluh lantai naik lewat tangga, gelap.",
        "Kunci warisan dari nenek ada di sakuku — katanya, ini unit terakhir milik keluarga kami.",
        "Aku belum pernah dengar cerita soal unit ini sebelumnya. Aneh, padahal keluarga kami suka cerita apa saja.",
        "Lantai 14. Koridornya sepi. Terlalu sepi untuk gedung yang katanya masih ditempati.",
      ],
      draw(ctx, w, h, t) {
        ctx.fillStyle = "#050607";
        ctx.fillRect(0, 0, w, h);
        const bob = Math.sin(t / 380) * w * 0.03;
        const cx = w * 0.5 + bob, cy = h * 0.55;
        const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, w * 0.4);
        grad.addColorStop(0, "rgba(184,216,201,0.14)");
        grad.addColorStop(1, "rgba(184,216,201,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "rgba(255,255,255,0.05)";
        for (let i = 0; i < 8; i++) {
          ctx.beginPath();
          ctx.moveTo(0, h * 0.3 + i * h * 0.06);
          ctx.lineTo(w, h * 0.36 + i * h * 0.06);
          ctx.stroke();
        }
      },
    },

    masuk_unit: {
      lines: [
        "Pintu berderit terbuka. Bau lembab dan debu langsung menyergap.",
        "Lampu menyala sendiri saat aku meraba saklar — sekejap, lalu berkedip liar.",
        "Semua perabotan masih di tempatnya. Seperti ditinggal terburu-buru.",
        "Di lantai, ada jejak kaki kecil di antara debu. Cuma satu jalur, menuju kamar.",
      ],
      draw(ctx, w, h, t) {
        const flick = (Math.sin(t / 90) > 0.7 || Math.sin(t / 230) > 0.85) ? 0.05 : 0.4;
        ctx.fillStyle = "#08090a";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = `rgba(184,216,201,${flick})`;
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(w * 0.1, h * 0.55, w * 0.25, h * 0.15);
        ctx.fillRect(w * 0.65, h * 0.4, w * 0.2, h * 0.3);
      },
    },

    kilas_balik: {
      lines: [
        "Sesaat aku pegang bingkai itu, dunia terasa memutar.",
        "Ruangan yang sama, tapi lebih terang. Ada tawa anak kecil, samar.",
        "\"...jangan ganggu adikmu, dia cuma mau main cermin sebentar...\"",
        "Suara ibu itu familiar. Terlalu familiar.",
        "Bingkai itu jatuh dari tanganku. Suaranya menghilang seketika.",
      ],
      draw(ctx, w, h, t) {
        ctx.fillStyle = "#2a2117";
        ctx.fillRect(0, 0, w, h);
        const grad = ctx.createRadialGradient(w/2, h*0.4, 10, w/2, h*0.4, w*0.6);
        grad.addColorStop(0, "rgba(201,180,140,0.25)");
        grad.addColorStop(1, "rgba(20,16,10,0.85)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
        const wob = Math.sin(t / 300) * 6;
        ctx.fillStyle = "rgba(10,8,5,0.6)";
        ctx.beginPath(); ctx.arc(w * 0.42 + wob, h * 0.55, w * 0.03, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(w * 0.4 + wob, h * 0.58, w * 0.04, h * 0.1);
        ctx.beginPath(); ctx.arc(w * 0.55 - wob, h * 0.56, w * 0.025, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(w * 0.535 - wob, h * 0.585, w * 0.032, h * 0.09);
      },
    },

    akhir_bab: {
      lines: [
        "Sosok itu tidak bergerak. Aku juga tidak.",
        "Lalu, perlahan, ia mengangkat tangan dan melambai — seperti mengenaliku.",
        "Lampu di unit seberang mati. Lalu lampu di kamarku ikut mati.",
        "Dalam gelap, aku dengar suara pintu lemari di belakangku, perlahan terbuka sendiri.",
        "Dan suara itu — suara yang sama dari kilas balik tadi — berbisik dari sangat dekat:",
        "\"...akhirnya kamu pulang juga.\"",
      ],
      draw(ctx, w, h, t) {
        const dark = Math.min(1, t / 2200);
        ctx.fillStyle = `rgba(0,0,0,${0.15 + dark * 0.8})`;
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#050505";
        ctx.fillRect(0, 0, w, h * 0.15);
      },
      then: "END",
    },
  },

  // -----------------------------------------------------------
  jumpscares: {
    tv_jumpscare: {
      duration: 420,
      draw(ctx, w, h, t) {
        ctx.fillStyle = t < 0.4 ? "#dfe3df" : "#08090a";
        ctx.fillRect(0, 0, w, h);
        for (let i = 0; i < 400; i++) {
          ctx.fillStyle = Math.random() > 0.5 ? "#000" : "#fff";
          ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
        }
        ctx.fillStyle = "rgba(0,0,0,0.85)";
        ctx.beginPath();
        ctx.ellipse(w * 0.5, h * 0.45, w * 0.06, h * 0.045, 0, 0, Math.PI * 2);
        ctx.ellipse(w * 0.5, h * 0.62, w * 0.14, h * 0.09, 0, 0, Math.PI * 2);
        ctx.fill();
      },
      vibrate: [30, 20, 60],
    },
    lemari_jumpscare: {
      duration: 550,
      draw(ctx, w, h, t) {
        ctx.fillStyle = t < 0.5 ? "#ffffff" : "#1a2a24";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.ellipse(w * 0.4, h * 0.4, w * 0.045, h * 0.028, 0, 0, Math.PI * 2);
        ctx.ellipse(w * 0.6, h * 0.4, w * 0.045, h * 0.028, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(w * 0.5, h * 0.56, w * 0.1, h * 0.07, 0, 0, Math.PI * 2);
        ctx.fill();
      },
      vibrate: [40, 30, 120],
    },
  },
};
