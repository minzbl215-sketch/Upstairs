/* ============================================================
   STORY.JS — "Lantai Atas", bab 1: Kunci Lama

   Struktur scene sama seperti sebelumnya (lihat komentar di tiap
   objek). Yang baru: STORY.cutscenes — sekuens sinematik full-
   screen yang bisa dipanggil dari hotspot (cutscene: "id") atau
   otomatis di awal (STORY.openingCutscene) / akhir (goto:"END").
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
      bg(ctx, w, h) {
        ctx.fillStyle = "#0d0f10";
        ctx.fillRect(0, 0, w, h);
        // lantai keramik retak
        ctx.fillStyle = "#15181a";
        ctx.fillRect(0, h * 0.58, w, h * 0.42);
        for (let i = 0; i < 6; i++) {
          ctx.strokeStyle = "rgba(0,0,0,.4)";
          ctx.beginPath();
          ctx.moveTo(i * w / 5, h * 0.58); ctx.lineTo(i * w / 5, h);
          ctx.stroke();
        }
        // dinding koridor
        ctx.fillStyle = "#1c2022";
        ctx.fillRect(0, h * 0.2, w, h * 0.38);
        // lampu neon di plafon (berkedip lewat animasi terpisah di game.js)
        ctx.fillStyle = "#b8d8c9";
        ctx.fillRect(w * 0.38, h * 0.12, w * 0.24, h * 0.015);
        // pintu unit 14B
        ctx.fillStyle = "#2b2420";
        ctx.fillRect(w * 0.4, h * 0.22, w * 0.2, h * 0.38);
        ctx.strokeStyle = "#000"; ctx.strokeRect(w * 0.4, h * 0.22, w * 0.2, h * 0.38);
        ctx.fillStyle = "#b8d8c9";
        ctx.fillRect(w * 0.47, h * 0.34, w * 0.06, h * 0.02); // plat nomor
        // kotak surat di dinding kiri
        ctx.fillStyle = "#3a3530";
        ctx.fillRect(w * 0.1, h * 0.42, w * 0.1, h * 0.08);
      },
      hotspots: [
        {
          id: "kotak_surat",
          x: 0.15, y: 0.46, r: 0.08,
          requiresFlag: null,
          lines: [
            { name: "", text: "Kotak surat unit ini penuh, tak pernah diambil." },
            { name: "", text: "Semua atas nama yang sama: Ny. Aminah. Tertanggal dua tahun lalu." },
          ],
          setFlag: "cek_surat",
          oneTime: true,
        },
        {
          id: "pintu_unit",
          x: 0.5, y: 0.4, r: 0.1,
          requiresFlag: "cek_surat",
          lockedLines: [
            { name: "", text: "Kunci ini gak akan cocok kalau aku belum yakin ini unit yang benar." },
          ],
          lines: [
            { name: "", text: "Kunci warisan itu masuk pas ke lubangnya. Seperti memang untuk pintu ini." },
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
        // jendela dengan lampu kota di kejauhan
        ctx.fillStyle = "#0e1a1c";
        ctx.fillRect(w * 0.62, h * 0.18, w * 0.28, h * 0.3);
        for (let i = 0; i < 14; i++) {
          ctx.fillStyle = Math.random() > 0.5 ? "rgba(184,216,201,0.5)" : "rgba(184,216,201,0.15)";
          ctx.fillRect(w * 0.64 + Math.random() * w * 0.24, h * 0.2 + Math.random() * h * 0.24, 2, 2);
        }
        // TV tua
        ctx.fillStyle = "#1a1a1a";
        ctx.fillRect(w * 0.1, h * 0.5, w * 0.18, h * 0.14);
        ctx.fillStyle = "#050505";
        ctx.fillRect(w * 0.12, h * 0.52, w * 0.14, h * 0.08);
        // foto keluarga di dinding
        ctx.strokeStyle = "#4a3f30"; ctx.lineWidth = 3;
        ctx.strokeRect(w * 0.42, h * 0.28, w * 0.1, h * 0.13);
        ctx.fillStyle = "#2a2a2a";
        ctx.fillRect(w * 0.42, h * 0.28, w * 0.1, h * 0.13);
        // pintu kamar
        ctx.fillStyle = "#201c18";
        ctx.fillRect(w * 0.78, h * 0.42, w * 0.14, h * 0.3);
      },
      hotspots: [
        {
          id: "tv_tua",
          x: 0.19, y: 0.54, r: 0.09,
          requiresFlag: null,
          lines: [
            { name: "", text: "Aku tekan tombolnya. Yang muncul cuma semut layar — dan sesaat, sebuah siluet." },
            { name: "", text: "Aku matikan lagi. Cepat." },
          ],
          setFlag: "tv_hidup",
          oneTime: true,
        },
        {
          id: "foto_keluarga",
          x: 0.47, y: 0.34, r: 0.08,
          requiresFlag: null,
          lines: [
            { name: "", text: "Foto tiga orang: ibu, dan dua anak. Salah satu wajah sudah tergores habis." },
          ],
          setFlag: "lihat_foto",
          cutscene: "kilas_balik",
          oneTime: true,
        },
        {
          id: "pintu_kamar",
          x: 0.85, y: 0.55, r: 0.09,
          requiresFlag: "lihat_foto",
          lockedLines: [
            { name: "", text: "Belum. Aku belum mau masuk ke sana dulu." },
          ],
          lines: [
            { name: "", text: "Pintu kamar itu sedikit terbuka, seakan menungguku." },
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
        // ranjang kecil
        ctx.fillStyle = "#1c1a17";
        ctx.fillRect(w * 0.08, h * 0.44, w * 0.26, h * 0.14);
        // jendela
        ctx.fillStyle = "#0e1a1c";
        ctx.fillRect(w * 0.66, h * 0.2, w * 0.2, h * 0.22);
        // lemari besar di kanan
        ctx.fillStyle = "#1f1b17";
        ctx.fillRect(w * 0.7, h * 0.4, w * 0.22, h * 0.34);
        ctx.strokeStyle = "#000";
        ctx.beginPath(); ctx.moveTo(w * 0.81, h * 0.4); ctx.lineTo(w * 0.81, h * 0.74); ctx.stroke();
      },
      hotspots: [
        {
          id: "lemari",
          x: 0.81, y: 0.58, r: 0.1,
          requiresFlag: null,
          lines: [
            { name: "", text: "Engselnya berkarat. Aku tarik pelan-pelan pintunya." },
          ],
          jumpscare: "lemari_jumpscare",
          setFlag: "buka_lemari",
          oneTime: true,
        },
        {
          id: "jendela",
          x: 0.76, y: 0.28, r: 0.09,
          requiresFlag: "buka_lemari",
          lockedLines: [
            { name: "", text: "Jantungku masih berdebar. Belum sekarang." },
          ],
          lines: [
            { name: "", text: "Dari jendela ini, aku bisa lihat lantai 14 gedung sebelah." },
            { name: "", text: "Ada seseorang berdiri di sana. Menghadap ke arahku. Persis di jendela yang sama." },
          ],
          cutscene: "akhir_bab",
          goto: "END",
        },
      ],
    },

  ],

  // -----------------------------------------------------------
  // CUTSCENES — animasi latar ambient + narasi bertahap (tap lanjut)
  // -----------------------------------------------------------
  cutscenes: {

    kedatangan: {
      lines: [
        "Lift gedung ini sudah rusak sejak lama. Sepuluh lantai naik lewat tangga, gelap.",
        "Kunci warisan dari nenek ada di sakuku — katanya, ini unit terakhir milik keluarga kami.",
        "Lantai 14. Koridornya sepi. Terlalu sepi untuk gedung yang katanya masih ditempati.",
      ],
      draw(ctx, w, h, t) {
        ctx.fillStyle = "#050607";
        ctx.fillRect(0, 0, w, h);
        // cahaya senter bergoyang naik tangga
        const bob = Math.sin(t / 380) * w * 0.03;
        const cx = w * 0.5 + bob, cy = h * 0.55;
        const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, w * 0.4);
        grad.addColorStop(0, "rgba(184,216,201,0.14)");
        grad.addColorStop(1, "rgba(184,216,201,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
        // garis-garis tangga
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
      ],
      draw(ctx, w, h, t) {
        const flick = (Math.sin(t / 90) > 0.7 || Math.sin(t / 230) > 0.85) ? 0.05 : 0.4;
        ctx.fillStyle = "#08090a";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = `rgba(184,216,201,${flick})`;
        ctx.fillRect(0, 0, w, h);
        // siluet perabotan
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
        "Bingkai itu jatuh dari tanganku. Suaranya menghilang seketika.",
      ],
      draw(ctx, w, h, t) {
        // sephia/desaturated flashback look
        ctx.fillStyle = "#2a2117";
        ctx.fillRect(0, 0, w, h);
        const grad = ctx.createRadialGradient(w/2, h*0.4, 10, w/2, h*0.4, w*0.6);
        grad.addColorStop(0, "rgba(201,180,140,0.25)");
        grad.addColorStop(1, "rgba(20,16,10,0.85)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
        // dua siluet kecil bermain
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
