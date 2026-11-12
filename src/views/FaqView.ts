export function renderFaqView(): string {
  const faqList = [
    {
      id: 'faq-1',
      kategori: 'Perpajakan & TER',
      tanya: 'Apa itu Tarif Efektif Rata-Rata (TER) PPh 21 berdasarkan PP 58/2023 dan PMK 168/2023?',
      jawab: `
        <p class="mb-2"><strong>Tarif Efektif Rata-Rata (TER)</strong> adalah skema pemotongan PPh Pasal 21 bulanan yang mulai berlaku sejak 1 Januari 2024 sesuai Peraturan Pemerintah Nomor 58 Tahun 2023 dan Peraturan Menteri Keuangan Nomor 168 Tahun 2023.</p>
        <p class="mb-2">Tujuan utama TER adalah menyederhanakan penghitungan PPh 21 bulanan untuk masa Januari hingga November. Bendahara tidak perlu lagi menghitung biaya jabatan, iuran pensiun, dan menyetahunkan penghasilan setiap bulan. Cukup mengalikan <strong>Total Penghasilan Bruto Sebulan</strong> dengan persentase tarif TER yang sesuai.</p>
        <p>TER terbagi menjadi 3 kategori:</p>
        <ul class="list-disc pl-5 mt-1 space-y-1 text-slate-700">
          <li><strong>TER A:</strong> Untuk PTKP TK/0 (54 jt), TK/1 (58,5 jt), dan K/0 (58,5 jt). Memiliki 44 lapisan tarif (0% s.d. 34%).</li>
          <li><strong>TER B:</strong> Untuk PTKP TK/2 (63 jt), TK/3 (67,5 jt), K/1 (63 jt), dan K/2 (67,5 jt). Memiliki 40 lapisan tarif (0% s.d. 34%).</li>
          <li><strong>TER C:</strong> Khusus untuk PTKP K/3 (72 jt). Memiliki 41 lapisan tarif (0% s.d. 34%).</li>
        </ul>
      `
    },
    {
      id: 'faq-2',
      kategori: 'Perpajakan & TER',
      tanya: 'Bagaimana hubungan Status PTKP dengan Kategori TER?',
      jawab: `
        <p class="mb-2">Status Penghasilan Tidak Kena Pajak (PTKP) ditentukan per 1 Januari tahun pajak berjalan. Hubungan resmi antara status PTKP dan Kategori TER adalah sebagai berikut:</p>
        <div class="overflow-x-auto my-3">
          <table class="w-full text-xs border border-slate-200">
            <thead class="bg-slate-100 font-bold text-slate-700">
              <tr>
                <th class="p-2 border">Status PTKP</th>
                <th class="p-2 border">Keterangan</th>
                <th class="p-2 border">Nilai PTKP Tahunan</th>
                <th class="p-2 border">Kategori TER</th>
              </tr>
            </thead>
            <tbody>
              <tr><td class="p-2 border font-mono">TK/0</td><td class="p-2 border">Tidak Kawin, 0 Tanggungan</td><td class="p-2 border">Rp 54.000.000</td><td class="p-2 border font-bold text-emerald-700">Kategori A</td></tr>
              <tr><td class="p-2 border font-mono">TK/1</td><td class="p-2 border">Tidak Kawin, 1 Tanggungan</td><td class="p-2 border">Rp 58.500.000</td><td class="p-2 border font-bold text-emerald-700">Kategori A</td></tr>
              <tr><td class="p-2 border font-mono">K/0</td><td class="p-2 border">Kawin, 0 Tanggungan</td><td class="p-2 border">Rp 58.500.000</td><td class="p-2 border font-bold text-emerald-700">Kategori A</td></tr>
              <tr><td class="p-2 border font-mono">TK/2</td><td class="p-2 border">Tidak Kawin, 2 Tanggungan</td><td class="p-2 border">Rp 63.000.000</td><td class="p-2 border font-bold text-blue-700">Kategori B</td></tr>
              <tr><td class="p-2 border font-mono">TK/3</td><td class="p-2 border">Tidak Kawin, 3 Tanggungan</td><td class="p-2 border">Rp 67.500.000</td><td class="p-2 border font-bold text-blue-700">Kategori B</td></tr>
              <tr><td class="p-2 border font-mono">K/1</td><td class="p-2 border">Kawin, 1 Tanggungan</td><td class="p-2 border">Rp 63.000.000</td><td class="p-2 border font-bold text-blue-700">Kategori B</td></tr>
              <tr><td class="p-2 border font-mono">K/2</td><td class="p-2 border">Kawin, 2 Tanggungan</td><td class="p-2 border">Rp 67.500.000</td><td class="p-2 border font-bold text-blue-700">Kategori B</td></tr>
              <tr><td class="p-2 border font-mono">K/3</td><td class="p-2 border">Kawin, 3 Tanggungan</td><td class="p-2 border">Rp 72.000.000</td><td class="p-2 border font-bold text-purple-700">Kategori C</td></tr>
            </tbody>
          </table>
        </div>
      `
    },
    {
      id: 'faq-3',
      kategori: 'Akhir Periode & Rekonsiliasi',
      tanya: 'Mengapa sering terjadi Kurang Bayar yang besar pada bulan Desember bagi ASN/PNS?',
      jawab: `
        <p class="mb-2">Banyak pegawai ASN/PNS terkejut ketika potongan pajak di bulan Desember jauh lebih besar daripada bulan-bulan sebelumnya. Ini terjadi karena 2 faktor utama:</p>
        <ol class="list-decimal pl-5 space-y-1.5 text-slate-700">
          <li><strong>Rekonsiliasi Tarif Progresif Pasal 17 UU HPP:</strong> Pada bulan Desember (atau masa pajak terakhir), metode TER tidak lagi digunakan. Penghitungan dilakukan secara akumulatif setahun penuh menggunakan rumus normal: <em>(Penghasilan Bruto Setahun - Biaya Jabatan - Iuran Pensiun - PTKP) = PKP</em>. PKP kemudian dikenakan tarif progresif Pasal 17 (5%, 15%, 25%, 30%, 35%).</li>
          <li><strong>Split Withholding (Pemotongan Terpisah per Komponen):</strong> Dalam sistem birokrasi pemerintah, Gaji rutin dibayarkan lewat SKPD/Biro Kepegawaian, TPP dibayarkan terpisah, dan honorarium lintas kegiatan dibayarkan oleh panitia/OPD lain. Ketika dipotong secara parsial di masing-masing slip, bruto berada pada rentang tarif TER yang rendah. Namun ketika semua penghasilan digabungkan di akhir tahun, total PKP melonjak ke lapisan tarif 15% atau 25%, menimbulkan kekurangan potong yang harus diselesaikan di bulan Desember.</li>
        </ol>
      `
    },
    {
      id: 'faq-4',
      kategori: 'Multi Bendahara (Split Withholding)',
      tanya: 'Bagaimana penanganan penghasilan dari OPD/Bendahara yang berbeda?',
      jawab: `
        <p class="mb-2">Aplikasi ini secara khusus menyediakan input <strong>NPWP Bendahara Pemotong</strong> untuk masing-masing 4 komponen penghasilan di setiap bulan.</p>
        <p class="mb-2">Jika Anda menerima honorarium narasumber atau upah dari OPD luar (misal Dinas Pendidikan atau Badan Pendapatan Daerah), masukkan nominal bruto beserta pajak yang telah dipotong pada bukti potong mereka ke <em>Penghasilan Lainnya 2</em> dan sertakan NPWP Bendahara bersangkutan.</p>
        <p>Aplikasi akan membuat <strong>Tabel Rekapitulasi Split Withholding</strong> yang memisahkan jumlah bruto dan kredit pajak per masing-masing bendahara, sehingga rekonsiliasi akhir tahun di instansi induk tetap transparan dan akurat.</p>
      `
    },
    {
      id: 'faq-5',
      kategori: 'Formulir BPA2',
      tanya: 'Apa itu Formulir 1721-BPA2 dan bagaimana cara mencetaknya?',
      jawab: `
        <p class="mb-2"><strong>Formulir 1721-BPA2</strong> adalah Bukti Pemotongan Pajak Penghasilan Pasal 21 bagi Pegawai Tetap / ASN yang diterbitkan oleh instansi pemotong untuk membuktikan pemotongan pajak selama masa pajak atau tahun berjalan.</p>
        <p class="mb-2">Untuk mencetak formulir BPA2 di aplikasi ini:</p>
        <ol class="list-decimal pl-5 space-y-1 text-slate-700">
          <li>Buka tab <strong>Cetak Bukti Potong 1721-BPA2</strong>.</li>
          <li>Pilih entitas pemotong (Konsolidasi Instansi Utama atau per Bendahara spesifik).</li>
          <li>Periksa nomor bukti potong dan kelengkapan data.</li>
          <li>Klik tombol <strong>Cetak / Print PDF (A4)</strong>. Browser akan otomatis membuka dialog cetak yang sudah diformat khusus tanpa elemen antarmuka website.</li>
        </ol>
      `
    },
    {
      id: 'faq-6',
      kategori: 'Pelaporan SPT Tahunan',
      tanya: 'Bagaimana cara menggunakan data ini untuk lapor SPT Tahunan di DJP Online?',
      jawab: `
        <p class="mb-2">Setiap awal tahun (paling lambat 31 Maret), setiap ASN wajib melaporkan SPT Tahunan Orang Pribadi melalui e-Filing DJP Online:</p>
        <ul class="list-disc pl-5 space-y-1 text-slate-700">
          <li>Jika penghasilan bruto setahun &le; Rp 60.000.000 dan hanya dari satu pemberi kerja, gunakan formulir <strong>1770 SS</strong>.</li>
          <li>Jika penghasilan bruto setahun &gt; Rp 60.000.000 atau memiliki penghasilan lain/multi bendahara, gunakan formulir <strong>1770 S</strong>.</li>
        </ul>
        <p class="mt-2">Angka-angka yang Anda peroleh dari Formulir 1721-BPA2 di tab cetak (Penghasilan Bruto, Pengurang, PTKP, PPh Terutang, dan Bukti Potong Pajak) dapat langsung disalin ke isian Bukti Potong Bagian A pada formulir 1770 S di DJP Online.</p>
      `
    },
    {
      id: 'faq-7',
      kategori: 'Panduan Aplikasi',
      tanya: 'Bagaimana sistem Kuota Perhitungan dan Fitur Simpan/Muat JSON bekerja?',
      jawab: `
        <p class="mb-2"><strong>Kuota Perhitungan:</strong></p>
        <ul class="list-disc pl-5 space-y-1 text-slate-700 mb-3">
          <li><strong>Tamu (Tanpa Login):</strong> Diberikan kuota 3x perhitungan per hari.</li>
          <li><strong>Login Google:</strong> Diberikan kuota 25x perhitungan per hari secara cuma-cuma.</li>
          <li><strong>Admin:</strong> Memiliki kuota tanpa batas (Unlimited).</li>
        </ul>
        <p class="mb-2"><strong>Penyimpanan Data Lokal (Ekspor & Impor JSON):</strong></p>
        <ul class="list-disc pl-5 space-y-1 text-slate-700">
          <li>Gunakan tombol <strong>Ekspor</strong> untuk mengunduh seluruh data Anda ke file <code>.json</code> yang aman di perangkat lokal Anda. Data tidak disimpan permanen di server luar untuk menjaga privasi.</li>
          <li>Gunakan tombol <strong>Impor</strong> untuk memuat kembali file JSON cadangan Anda kapan saja. File akan divalidasi dengan skema ketat untuk menjamin integritas data.</li>
          <li>Gunakan tombol <strong>Template Dummy</strong> jika Anda ingin melihat sampel pengisian ASN/PNS siap pakai.</li>
        </ul>
      `
    }
  ];

  const faqItemsHtml = faqList.map((item, idx) => {
    return `
      <div class="faq-item border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs transition-all hover:border-slate-300" data-kategori="${item.kategori.toLowerCase()}" data-search="${(item.tanya + ' ' + item.jawab).toLowerCase()}">
        <button class="faq-toggle w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-slate-900 hover:bg-slate-50 transition">
          <div class="flex items-center gap-3">
            <span class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold shrink-0">
              ${idx + 1}
            </span>
            <div>
              <span class="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mr-2">${item.kategori}</span>
              <span class="text-sm sm:text-base">${item.tanya}</span>
            </div>
          </div>
          <svg class="w-5 h-5 text-slate-400 shrink-0 transform transition-transform duration-200 faq-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div class="faq-content hidden px-5 pb-5 pt-2 text-xs sm:text-sm text-slate-600 border-t border-slate-100 leading-relaxed bg-slate-50/50">
          ${item.jawab}
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="space-y-6 max-w-4xl mx-auto">
      <!-- Header Banner -->
      <div class="bg-linear-to-r from-teal-800 to-emerald-900 rounded-2xl p-6 text-white shadow-sm">
        <div class="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold mb-3 w-fit">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Pusat Bantuan & Tanya Jawab (FAQ)
        </div>
        <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">Panduan Perpajakan PPh 21 & Penggunaan Aplikasi</h2>
        <p class="text-xs sm:text-sm text-emerald-100">
          Temukan jawaban atas pertanyaan umum seputar regulasi PP 58/2023, PMK 168/2023, skema TER bulanan, rekonsiliasi akhir tahun, bukti potong BPA2, dan tata cara penggunaan aplikasi.
        </p>

        <!-- Search input -->
        <div class="mt-5 relative">
          <svg class="w-5 h-5 text-slate-400 absolute left-3.5 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="text" id="faq-search-input" placeholder="Cari topik atau kata kunci (contoh: TER, Desember, Biaya Jabatan, BPA2)..." 
            class="w-full pl-10 pr-4 py-2.5 bg-white text-slate-900 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-400 shadow-sm" />
        </div>
      </div>

      <!-- FAQ Accordion List -->
      <div id="faq-container" class="space-y-3">
        ${faqItemsHtml}
      </div>
    </div>
  `;
}
