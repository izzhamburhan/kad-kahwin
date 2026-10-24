// All invitation details live here. Edit this file only; the page reads everything from it.
window.WEDDING = {
  couple: {
    groom: "Izzat",
    bride: "Aisyah",
    groomFull: "Muhammad Izzat bin Hamzah",
    brideFull: "Nur Aisyah binti Ahmad",
    hashtag: "#IzzatAisyahSelamanya",
  },

  // Hosts of the majlis (usually the bride's parents)
  hosts: {
    father: "Encik Ahmad bin Ismail",
    mother: "Puan Rohani binti Yusof",
  },

  event: {
    title: "Walimatul Urus Izzat & Aisyah",
    // ISO time with Malaysia offset (+08:00)
    start: "2026-12-19T11:00:00+08:00",
    end: "2026-12-19T16:00:00+08:00",
    timeLabel: "11:00 pagi – 4:00 petang",
  },

  venue: {
    name: "Dewan Seri Melati",
    address: "Jalan Melati 3, Taman Melati, 53100 Kuala Lumpur",
    // Text used for Google Maps / Waze search. A "lat,lng" pair is more precise.
    mapQuery: "Taman Melati, Kuala Lumpur",
  },

  schedule: [
    { time: "11:00 pagi", title: "Ketibaan tetamu" },
    { time: "12:30 tgh", title: "Ketibaan pengantin" },
    { time: "1:00 ptg", title: "Jamuan makan & bacaan doa" },
    { time: "4:00 ptg", title: "Majlis bersurai" },
  ],

  // Phone numbers in international format without "+" (used for tel: and wa.me links)
  contacts: [
    { name: "Ahmad", role: "Bapa pengantin", phone: "60123456789" },
    { name: "Rohani", role: "Ibu pengantin", phone: "60129876543" },
    { name: "Hafiz", role: "Abang pengantin", phone: "60131112222" },
  ],

  rsvp: {
    deadline: "2026-12-05",
    maxPax: 5,
    // Replies go to this WhatsApp number when no endpoint is set.
    whatsapp: "60123456789",
    // Optional: Google Apps Script web app URL to save replies into a Google Sheet (see README.md).
    endpoint: "",
  },

  gift: {
    bank: "Maybank",
    accountName: "Nur Aisyah binti Ahmad",
    accountNo: "1234 5678 9012",
    // Path to your real DuitNow QR image (e.g. "assets/duitnow.png"). Leave empty to show a generated placeholder QR.
    qrImage: "",
    // Optional wishlist: { name, link }
    wishlist: [
      // { name: "Set periuk seramik", link: "https://shopee.com.my/..." },
    ],
  },

  music: {
    // Path or URL to an mp3 you have the rights to (e.g. "assets/lagu.mp3").
    // Leave empty to play the built-in generated music-box melody.
    src: "",
  },
};
