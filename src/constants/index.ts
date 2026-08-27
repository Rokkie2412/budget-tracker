export const TRANSACTION_TYPE = {
  IN: "IN",
  OUT: "OUT",
} as const;

export const ENC_ALGORITHM = "aes-256-cbc" as const;

export const HELP_COMMANDS = [
  { command: "masuk [nominal] [ket]", desc: "Catat pemasukan" },
  { command: "[nomimal] [ket]", desc: "Catat pengeluaran" },
  { command: "[ket] [nominal]", desc: "Catat pengeluaran" },
  { command: ".rekap", desc: "Lihat laporan bulan ini" },
  {
    command: ".cek | .history | .last [angka]",
    desc: "Lihat histori transaksi",
  },
  { command: ".batal", desc: "Hapus transaksi terakhir" },
];

export const BUDGET_CATEGORIES_EXPENSE = [
  "Bills",
  "Education",
  "Family Needs",
  "Food & Drinks",
  "Gift and Charity",
  "Groceries",
  "Health & Personal Care",
  "Hobby & Entertainment",
  "Loans",
  "Lending & Receivables",
  "Saving & Investment",
  "Shopping",
  "Sports",
  "Transportation",
  "Traveling",
  "Debt",
  "Other Expense",
] as const;

export const BUDGET_CATEGORIES_INCOME = [
  "Salary",
  "Business & Profit",
  "Freelance & Side Job",
  "Investment & Dividend",
  "Allowance & Gift",
  "Debt Repayment",
  "Bonus & Commission",
  "Rental Income",
  "Refund & Cashback",
  "Other Income",
] as const;

export const CATEGORY_COLORS: Record<string, string> = {
  "Food & Drinks": "#EF4444",
  Transportation: "#0284C7",
  Transportaion: "#0284C7",
  Bills: "#F59E0B",
  Groceries: "#10B981",
  "Hobby & Entertainment": "#8B5CF6",
  "Health & Personal Care": "#14B8A6",
  Shopping: "#6366F1",
  Education: "#3B82F6",
  "Family Needs": "#EC4899",
  "Gift and Charity": "#F43F5E",
  Traveling: "#84CC16",
  Sports: "#06B6D4",
  Loans: "#E11D48",
  "Lending & Receivables": "#D97706",
  "Saving & Investment": "#059669",
  Debt: "#DC2626",
  Other: "#64748B",

  Salary: "#10B981",
  "Business & Profit": "#3B82F6",
  "Freelance & Side Job": "#8B5CF6",
  "Investment & Dividend": "#059669",
  "Allowance & Gift": "#F59E0B",
  "Debt Repayment": "#14B8A6",
  "Bonus & Commission": "#F97316",
  "Rental Income": "#6366F1",
  "Refund & Cashback": "#06B6D4",
  "Other Income": "#64748B",
};

export const getCategoryColor = (category: string): string => {
  return CATEGORY_COLORS[category] || "#64748B";
};

export const FILTER_TYPE = {
  ALL: "all",
  INCOME: "income",
  EXPENSE: "expense",
} as const;

export const FILTER_DATE_LIST_TYPE = {
  THIS_MONTH: "thisMonth",
  LAST7_DAYS: "last7Days",
  LAST30_DAYS: "last30Days",
  CUSTOM_DATE: "customDate",
} as const;

export const EXPENSE_KEYWORD_MAP: Record<string, string[]> = {
  "Food & Drinks": [
    "makan", "minum", "nasi", "kopi", "coffee", "cafe", "kafe", "resto", "restoran",
    "gofood", "grabfood", "shopeefood", "warteg", "bakso", "mie", "ayam", "sate",
    "snack", "sarapan", "lunch", "dinner", "boba", "tea", "teh", "pizza", "burger",
    "jus", "juice", "roti", "bakmi", "martabak", "seblak", "pecel", "soto", "gorengan",
    "angkringan", "padang", "fast food", "kfc", "mcd", "starbucks", "chatime", "kuliner",
    "nasi goreng", "nasgor", "nasi uduk", "nasi padang", "nasi kuning", "ayam geprek",
    "ayam bakar", "ayam goreng", "sate ayam", "sate kambing", "pecel lele", "mie ayam",
    "indomie", "mie goreng", "mie kuah", "terang bulan", "roti bakar", "pisang goreng",
    "tahu bulat", "cimol", "cilor", "batagor", "siomay", "rawon", "gule", "gulai",
    "rendang", "gado-gado", "ketoprak", "bubur", "bubur ayam", "dimsum", "ramen",
    "sushi", "bento", "steak", "pasta", "spaghetti", "hotdog", "kebab", "sandwich",
    "croissant", "waffle", "pancake", "donat", "donut", "jco", "roti o", "rotio",
    "hokben", "solaria", "dcrepes", "mixue", "haus", "janji jiwa", "kopi kenangan",
    "fore", "espresso", "cappuccino", "latte", "matcha", "es teh", "esteh", "teh botol",
    "smoothie", "cemilan", "jajanan", "maksi", "kantin", "dine in", "takeaway",
  ],
  Transportation: [
    "bensin", "pertalite", "pertamax", "solar", "spbu", "ojek", "gojek", "grab",
    "maxim", "indrive", "tol", "parkir", "parking", "kereta", "krl", "mrt", "lrt",
    "busway", "transjakarta", "tj", "tiket pesawat", "grabride", "goride", "gocar",
    "grabcar", "servis motor", "servis mobil", "bengkel", "oli", "tambal ban", "cuci motor",
    "cuci mobil", "helm", "stnk", "taxi", "taksi", "angkot", "bbm", "pertamax turbo",
    "dexlite", "pom bensin", "shell", "bp akr", "vivo", "etoll", "e-toll", "tarif tol",
    "kartu tol", "valet", "karcis parkir", "ojol", "mikrotrans", "jaklingko",
    "commuter line", "kereta api", "kai", "whoosh", "kereta cepat", "damri", "travel",
    "shuttle", "bluebird", "ganti oli", "isi angin", "nitrogen", "sparepart", "aki motor",
    "aki mobil", "kampas rem", "pajak motor", "pajak mobil", "sim", "garuda", "citilink",
    "lion air", "super air jet", "batik air", "airasia", "kapal feri", "pelni", "tiket kapal",
  ],
  Bills: [
    "listrik", "pln", "token", "pdam", "air", "wifi", "indihome", "biznet", "first media",
    "myrepublic", "telkom", "pulsa", "paket data", "kuota", "tagihan", "bill", "bpjs",
    "pbb", "internet", "iuran", "ipl", "kebersihan", "keamanan", "pajak", "gas elpiji",
    "gas lpg", "aqua galon", "token listrik", "tagihan pln", "tagihan air", "gas pgn",
    "isi ulang galon", "le minerale galon", "iuran sampah", "ipl apartemen", "iuran rt",
    "iuran rw", "telkomsel", "indosat", "xl", "axis", "smartfren", "by.u", "tri",
    "firstmedia", "cbn", "oxygen", "iconnet", "bpjs kesehatan", "bpjs ketenagakerjaan",
    "asuransi", "premi asuransi", "prudential", "allianz", "manulife", "axa", "pajak bumi",
    "sppt pbb",
  ],
  Groceries: [
    "sayur", "beras", "buah", "minyak", "bumbu", "pasar", "supermarket", "indomaret",
    "alfamart", "alfamidi", "superindo", "hypermart", "transmart", "daging", "telur",
    "ikan", "belanja dapur", "sembako", "sabun cuci", "detergen", "rinso", "molto",
    "lotte mart", "hero", "farmer market", "grand lucky", "tukang sayur", "warung madura",
    "minyak goreng", "gula", "garam", "daging sapi", "daging ayam", "udang", "cumi",
    "sayuran", "bayam", "kangkung", "wortel", "tomat", "cabai", "cabe", "bawang merah",
    "bawang putih", "bumbu dapur", "kecap", "saus", "sambal", "santan", "mentega",
    "keju", "apel", "pisang", "jeruk", "semangka", "melon", "alpukat", "sabun cuci piring",
    "mama lemon", "sunlight", "daia", "soklin", "pelembut", "downy", "bayfresh", "stella",
    "kamper", "plastik sampah", "tissue", "tisu", "sponge", "spons cuci",
  ],
  "Health & Personal Care": [
    "obat", "dokter", "apotek", "apotik", "kimia farma", "halodoc", "alodokter", "k24",
    "skincare", "sabun", "sampo", "shampoo", "salon", "potong rambut", "barbershop",
    "cukur", "vitamin", "suplemen", "rumah sakit", "rs", "klinik", "puskesmas",
    "periksa", "dental", "gigi", "kosmetik", "lotion", "makeup", "parfum", "facial",
    "sunscreen", "body wash", "deodorant", "pasta gigi", "sikat gigi", "resep dokter",
    "konsul dokter", "guardian", "watsons", "century", "laboratorium", "tes darah",
    "rontgen", "swab", "rapid", "dokter gigi", "tambal gigi", "scaling gigi", "cabut gigi",
    "kacamata optik", "optik melawai", "optik seis", "softlens", "sangobion", "enervon c",
    "imboost", "panadol", "bodrex", "paracetamol", "tolak angin", "antangin",
    "minyak kayu putih", "freshcare", "salonpas", "hansaplast", "betadine", "perban",
    "facial wash", "toner", "serum", "moisturizer", "somethinc", "avoskin", "scarlett",
    "wardah", "emina", "kahf", "make over", "maybelline", "lipstik", "bedak", "cushion",
    "eyeliner", "maskara", "kondisioner", "sabun mandi", "body lotion", "cologne",
    "pomade", "wax rambut", "creambath", "hair spa", "manicure", "pedicure", "waxing",
    "pijat", "massage", "reflexology", "spa",
  ],
  "Hobby & Entertainment": [
    "nonton", "bioskop", "cinema", "xxi", "cgv", "cinepolis", "game", "steam", "playstation",
    "ps5", "xbox", "nintendo", "netflix", "spotify", "youtube", "disney", "prime",
    "konser", "tiket konser", "topup", "top up", "diamond", "mlbb", "genshin", "valorant",
    "main", "rekreasi", "karaoke", "billiard", "komik", "manga", "action figure",
    "tiket bioskop", "popcorn", "fan meeting", "pameran", "museum", "inul vizta",
    "masterpiece", "timezone", "funworld", "dufan", "ancol", "taman safari",
    "top up game", "mobile legends", "pubg", "free fire", "genshin impact", "honkai",
    "steam wallet", "ps store", "ps plus", "nintendo switch", "eshop", "game pass",
    "gacha", "youtube premium", "disney hotstar", "prime video", "hbo go", "vidio",
    "wetv", "iqiyi", "apple music", "crunchyroll", "webtoon", "buku komik", "novel",
    "gundam", "gunpla", "lego", "hot wheels", "trading card", "pokemon card", "kpop album",
  ],
  Shopping: [
    "belanja", "beli", "baju", "kaos", "kemeja", "celana", "jeans", "sepatu", "sandal",
    "tas", "ransel", "pakaian", "jaket", "hoodie", "lazada", "shopee", "tokopedia",
    "tiktok shop", "zalora", "uniqlo", "h&m", "zara", "aksesoris", "fashion", "jam tangan",
    "kacamata", "casing", "headset", "earphone", "gadget", "t-shirt", "blouse", "tunik",
    "gamis", "celana panjang", "celana pendek", "rok", "sweater", "cardigan", "jas",
    "blazer", "undergarment", "celana dalam", "bra", "boxer", "kaos kaki", "sneakers",
    "sepatu kerja", "pantofel", "heels", "backpack", "tote bag", "sling bag", "dompet",
    "wallet", "topi", "ikat pinggang", "gesper", "dasi", "blibli", "pull&bear", "bershka",
    "stradivarius", "erigo", "roughneck", "matahari", "ramayana", "smartwatch",
    "perhiasan", "kalung", "cincin", "gelang", "anting", "casing hp", "tempered glass",
    "charger", "kabel data", "powerbank", "tws", "airpods", "keyboard", "mouse", "flashdisk",
  ],
  Education: [
    "spp", "kuliah", "sekolah", "buku", "les", "kursus", "ukt", "tuition", "course",
    "udemy", "coursera", "book", "modul", "semester", "ujian", "skripsi", "wisuda",
    "seminar", "workshop", "alat tulis", "fotocopy", "print", "uang sekolah", "uang gedung",
    "daftar ulang", "uang kuliah", "biaya semester", "toga", "sidang", "almamater",
    "buku pelajaran", "buku paket", "lks", "modul kuliah", "les privat", "bimbingan belajar",
    "bimbel", "kumon", "ef", "english first", "kursus bahasa", "kursus stir mobil",
    "kursus coding", "bootcamp", "sertifikasi", "toefl", "ielts", "toeic", "hsk",
    "skillshare", "dicoding", "revou", "webinar", "konferensi", "atk", "buku tulis",
    "pulpen", "pensil", "penghapus", "tipp-ex", "spidol", "stabilo", "penggaris",
    "map", "binder", "kertas hvs", "print dokumen", "jilid",
  ],
  "Family Needs": [
    "popok", "susu", "pampers", "baby", "bayi", "anak", "kebutuhan rumah", "keluarga",
    "belanja bulanan keluarga", "perabotan", "kasur", "sprei", "alat dapur", "mainan anak",
    "mamy poko", "sweety", "merries", "susu formula", "morinaga", "sgm", "dancow",
    "chil kid", "bubur bayi", "promina", "cerelac", "baju bayi", "botol susu", "dot",
    "stroller", "lego anak", "buku cerita anak", "belanja bulanan rumah", "sarung bantal",
    "selimut", "handuk", "keset", "sapu", "pelan", "ember", "gantungan baju", "rak piring",
    "wajan", "panci", "spatula", "pisau dapur", "tupperware", "kotak makan", "termos",
    "bohlam", "lampu kamar", "perbaikan rumah", "tukang bangunan",
  ],
  "Gift and Charity": [
    "sedekah", "infaq", "zakat", "donasi", "kado", "hadiah", "sumbangan",
    "charity", "gift", "angpao", "kondangan", "amplop", "traktir", "patungan",
    "infak", "zakat fitrah", "zakat mal", "kitabisa", "wakaf", "santunan anak yatim",
    "celengan masjid", "kotak amal", "kado ulang tahun", "hadiah ultah", "kado pernikahan",
    "kado wisuda", "kado bayi", "amplop kondangan", "uang kondangan", "hampers",
    "parcel lebaran", "parcel natal", "buket bunga", "traktir teman", "patungan makan",
    "sawer", "tips pelayan", "tip kurir", "tip ojol",
  ],
  "Saving & Investment": [
    "tabungan", "menabung", "saham", "reksadana", "bibit", "ajaib", "bareksa", "crypto",
    "binance", "indodax", "tokocrypto", "emas", "antam", "deposit", "deposito", "save",
    "invest", "investasi", "btc", "rdpu", "rdpt", "nabung", "buka rekening",
    "reksadana saham", "ihsg", "ipo", "beli saham", "bitcoin", "ethereum", "eth",
    "solana", "usdt", "pintu", "pluang", "stockbit", "emas antam", "logam mulia",
    "tabungan emas", "pegadaian", "p2p lending", "sukuk", "ori", "sbr", "sbn",
    "obligasi negara",
  ],
  Loans: [
    "cicilan", "pinjaman", "kpr", "leasing", "angsuran", "kredit", "paylater", "spaylater",
    "gopaylater", "kredivo", "akulaku", "pinjol", "finmas", "ada kami", "kredit rumah",
    "cicilan motor", "cicilan mobil", "fif", "adira", "oto finance", "baf", "wom finance",
    "kredit hp", "kredit laptop", "home credit", "megazip", "shopee paylater",
    "lazada paylater", "indodana", "pinjaman online",
  ],
  "Lending & Receivables": [
    "pinjamkan", "talangan", "piutang", "pinjemin", "utangin", "talangin",
    "pinjaman teman", "kasih pinjam",
  ],
  Debt: [
    "bayar utang", "lunas utang", "bayar hutang", "lunas", "utang", "hutang",
    "pelunasan hutang", "bayar cicilan teman", "balikin pinjaman", "lunasin utang",
  ],
  Sports: [
    "gym", "fitness", "futsal", "badminton", "bulutangkis", "renang", "workout",
    "sewa lapangan", "raket", "bola", "running", "lari", "jersey", "sepatu lari",
    "yoga", "pilates", "padel", "membership gym", "celebrity fitness", "fitness first",
    "sewa lapangan futsal", "sewa lapangan badminton", "raket badminton", "shuttlecock",
    "kolam renang", "tiket renang", "tenis", "sewa lapangan tenis", "padel tennis",
    "golf", "driving range", "basket", "voli", "calisthenics", "zumba", "aerobik",
    "marathon", "lari pagi", "matras yoga", "dumbell", "protein whey", "creatine",
  ],
  Traveling: [
    "hotel", "tiket liburan", "villa", "tour", "staycation", "homestay", "pantai",
    "wisata", "liburan", "traveloka", "tiket.com", "airbnb", "paspor", "visa",
    "resort", "hostel", "agoda", "booking.com", "traveloka hotel", "tiket.com hotel",
    "glamping", "camping", "sewa tenda", "tour guide", "paket liburan", "tempat wisata",
    "tiket masuk wisata", "gunung", "sewa mobil liburan", "sewa motor liburan",
    "bikin paspor", "perpanjang paspor", "bagasi pesawat", "asuransi perjalanan",
  ],
  "Other Expense": [
    "biaya admin", "admin bank", "transfer", "rupa-rupa", "lain-lain", "denda", "materai",
    "biaya transfer", "biaya tarik tunai", "biaya top up", "denda tilang", "meterai",
    "fotocopy ktp", "legalisir", "biaya notaris", "ongkir", "ongkos kirim",
  ],
};

export const INCOME_KEYWORD_MAP: Record<string, string[]> = {
  Salary: [
    "gaji", "payroll", "salary", "upah", "gajian", "thr", "tunjangan", "honor", "honorarium",
    "gaji bulanan", "gaji pokok", "tunjangan makan", "tunjangan transport", "tunjangan jabatan",
    "tunjangan hari raya", "gaji ke-13", "uang makan kantor", "uang saku kantor",
  ],
  "Business & Profit": [
    "omset", "omzet", "jualan", "usaha", "toko", "dagang", "laba", "keuntungan", "orderan",
    "profit", "sales", "penjualan", "pelanggan", "customer", "invoice", "proyek bisnis",
    "hasil jualan", "keuntungan jualan", "orderan masuk", "closing", "invoice dibayar",
    "penjualan toko", "dagangan", "hasil panen", "hasil ternak", "toko online",
    "pesanan pelanggan", "omzet harian", "omzet bulanan",
  ],
  "Freelance & Side Job": [
    "freelance", "side job", "side income", "project", "proyek", "tip", "fee", "komisi jasa",
    "desain", "ngoding", "jasa", "konsultasi", "bikin web", "editing", "fotografi",
    "side hustle", "penghasilan sampingan", "fee proyek", "uang proyek", "project fee",
    "fee desain", "fee ngoding", "jasa pembuatan", "jasa foto", "jasa video", "honor mc",
    "fee narasumber", "fee pembicara", "jasa servis", "jasa konsultasi", "tip customer",
    "tips ojol", "upah lemburan freelance",
  ],
  "Bonus & Commission": [
    "bonus", "insentif", "komisi", "reward", "bonus tahunan", "insentif lembur", "lemburan",
    "hadiah lomba", "juara", "bounty", "bonus performa", "bonus target", "bonus kpi",
    "komisi penjualan", "komisi affiliate", "affiliate shopee", "affiliate tiktok",
    "komisi sales", "hadiah giveaway", "uang lembur",
  ],
  "Investment & Dividend": [
    "dividen", "dividend", "return", "bunga bank", "bunga", "capital gain", "profit saham",
    "profit crypto", "bagi hasil", "royalti", "kupon obligasi", "sbn", "gain saham",
    "cuan saham", "cuan crypto", "bunga deposito", "bunga tabungan", "kupon sukuk",
    "kupon sbr", "kupon ori", "hasil reksadana", "royalti buku", "royalti lagu", "passive income",
  ],
  "Allowance & Gift": [
    "uang jajan", "transfer ortu", "dikasih", "kado", "angpao", "hadiah", "pemberian",
    "dari papa", "dari mama", "dari orang tua", "kiriman ortu", "hibah", "uang saku",
    "transferan ortu", "kiriman orang tua", "dari ayah", "dari ibu", "dari suami",
    "dari istri", "dikasih uang", "hadiah uang", "angpao imlek", "salam tempel",
    "kado uang", "warisan",
  ],
  "Rental Income": [
    "sewa kos", "uang kos", "kost", "kontrakan", "sewa mobil", "sewa rumah", "rental",
    "sewa properti", "sewa ruko", "sewa lapak", "kost bulanan", "uang kontrakan",
    "sewa kontrakan", "sewa apartemen", "rental mobil", "sewa kamera", "sewa alat",
    "pendapatan sewa",
  ],
  "Refund & Cashback": [
    "cashback", "refund", "pengembalian", "poin", "promo", "voucher balik", "kembalian",
    "cashback gopay", "cashback ovo", "cashback shopee", "cashback tokopedia", "refund tiket",
    "refund shopee", "refund tokopedia", "pengembalian dana", "voucher cashback",
    "kembalian lebih", "klaim asuransi", "reimburse", "reimbursement kantor",
  ],
  "Debt Repayment": [
    "bayar utang teman", "balikin uang", "dibayar", "pelunasan utang", "piutang balik",
    "dibalikin", "kembalian utang", "pelunasan utang teman", "uang kembali",
    "balikin pinjaman", "teman lunasin utang", "piutang cair", "piutang dibayar",
    "kembalian talangan",
  ],
  "Other Income": [
    "temuan", "rezeki", "rejeki", "pemasukan lain", "income lain", "klaim",
    "rejeki nomplok", "nemu uang", "sumber lain",
  ],
};

export const predictCategory = (
  description: string,
  type: "OUT" | "IN",
): string | null => {
  const normalized = description
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?[\]]/g, " ")
    .trim();

  if (!normalized) return null;

  const keywordMap = type === "IN" ? INCOME_KEYWORD_MAP : EXPENSE_KEYWORD_MAP;
  const words = normalized.split(/\s+/).filter(Boolean);

  let bestMatch: { category: string; length: number; isExact: boolean } | null =
    null;

  for (const [category, keywords] of Object.entries(keywordMap)) {
    for (const keyword of keywords) {
      const lowerKeyword = keyword.toLowerCase().trim();
      const keywordWords = lowerKeyword.split(/\s+/).filter(Boolean);

      // 1. Exact full match
      if (normalized === lowerKeyword) {
        return category;
      }

      // 2. Multi-word phrase matching
      if (keywordWords.length > 1) {
        if (normalized.includes(lowerKeyword)) {
          if (!bestMatch || lowerKeyword.length > bestMatch.length) {
            bestMatch = { category, length: lowerKeyword.length, isExact: true };
          }
        }
      } else {
        // 3. Single-word token exact match
        if (words.includes(lowerKeyword)) {
          if (!bestMatch || lowerKeyword.length > bestMatch.length) {
            bestMatch = { category, length: lowerKeyword.length, isExact: false };
          }
        }
      }
    }
  }

  return bestMatch ? bestMatch.category : null;
};


