export interface FaqItem {
  id: string;
  kategori: string;
  kategoriKey: string;
  tanya: string;
  jawab: string;
}

export function renderFaqView(): string {
  const faqList: FaqItem[] = [
    // -------------------------------------------------------------------------
    // 1. Regulasi Baru & Konsep TER
    // -------------------------------------------------------------------------
    {
      id: 'faq-1',
      kategori: 'Regulasi Baru & Konsep TER',
      kategoriKey: 'regulasi-ter',
      tanya: 'Apa latar belakang diterbitkannya PP 58/2023 dan PMK 168/2023 tentang TER PPh 21?',
      jawab: `
        <p>Pemerintah menerbitkan <strong>Peraturan Pemerintah Nomor 58 Tahun 2023</strong> dan <strong>Peraturan Menteri Keuangan Nomor 168 Tahun 2023</strong> mulai 1 Januari 2024 dengan tujuan memberikan <strong>kemudahan, kesederhanaan, kepastian hukum, dan transparansi</strong> bagi pemotong dan penerima penghasilan.</p>
        <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
          <p class="font-bold flex items-center gap-1.5 text-emerald-800">
            <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Penting Dipahami: Bukan Pajak Baru &amp; Tidak Menambah Beban Pajak
          </p>
          <p>Pemberlakuan Tarif Efektif Rata-Rata (TER) <strong>sama sekali bukan jenis pajak baru</strong> dan <strong>tidak menimbulkan tambahan beban pajak</strong> bagi pegawai. Total PPh Pasal 21 terutang selama satu tahun kalender tetap sama persis dengan perhitungan tarif normal Pasal 17 UU PPh.</p>
        </div>
        <p class="pt-1">Ketentuan ini mencabut dan memperbarui beberapa regulasi sebelumnya, antara lain:</p>
        <ul class="list-disc pl-5 space-y-1 text-slate-700">
          <li>Mencabut Pasal 2 ayat (3) Peraturan Pemerintah Nomor 80 Tahun 2010.</li>
          <li>Mencabut PMK Nomor 250/PMK.03/2008, PMK Nomor 252/PMK.03/2008, dan PMK Nomor 102/PMK.010/2016.</li>
          <li>Mencabut sebagian ketentuan dalam PMK Nomor 262/PMK.03/2010.</li>
        </ul>
      `
    },
    {
      id: 'faq-2',
      kategori: 'Regulasi Baru & Konsep TER',
      kategoriKey: 'regulasi-ter',
      tanya: 'Bagaimana pembagian Kategori TER Bulanan (A, B, C) dan hubungannya dengan PTKP?',
      jawab: `
        <p>Berdasarkan PP 58/2023, <strong>Tarif Efektif Bulanan</strong> digunakan untuk memotong PPh 21 pegawai tetap pada masa selain masa pajak terakhir (Januari s.d. November). Pemotong cukup mengalikan <strong>Penghasilan Bruto Sebulan</strong> dengan persentase tarif pada kategori TER yang bersesuaian.</p>
        <p class="font-semibold text-slate-800">Pembagian 3 Kategori TER Bulanan:</p>
        <div class="overflow-x-auto my-3 rounded-xl border border-slate-200 shadow-xs">
          <table class="w-full text-xs">
            <thead class="bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
              <tr>
                <th class="py-2.5 px-3 text-left">Kategori TER</th>
                <th class="py-2.5 px-3 text-left">Status PTKP</th>
                <th class="py-2.5 px-3 text-right">Nilai PTKP Tahunan</th>
                <th class="py-2.5 px-3 text-left">Rentang Tarif 0%</th>
                <th class="py-2.5 px-3 text-center">Jumlah Lapisan</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 bg-white">
              <tr>
                <td class="py-2.5 px-3 font-bold text-emerald-700">Kategori A</td>
                <td class="py-2.5 px-3 font-mono font-semibold">TK/0, TK/1, K/0</td>
                <td class="py-2.5 px-3 text-right font-mono">Rp 54 jt &amp; Rp 58,5 jt</td>
                <td class="py-2.5 px-3">Bruto s.d. Rp 5.400.000</td>
                <td class="py-2.5 px-3 text-center font-mono">44 Lapisan (0% - 34%)</td>
              </tr>
              <tr>
                <td class="py-2.5 px-3 font-bold text-blue-700">Kategori B</td>
                <td class="py-2.5 px-3 font-mono font-semibold">TK/2, TK/3, K/1, K/2</td>
                <td class="py-2.5 px-3 text-right font-mono">Rp 63 jt &amp; Rp 67,5 jt</td>
                <td class="py-2.5 px-3">Bruto s.d. Rp 6.200.000</td>
                <td class="py-2.5 px-3 text-center font-mono">40 Lapisan (0% - 34%)</td>
              </tr>
              <tr>
                <td class="py-2.5 px-3 font-bold text-purple-700">Kategori C</td>
                <td class="py-2.5 px-3 font-mono font-semibold">K/3</td>
                <td class="py-2.5 px-3 text-right font-mono">Rp 72 jt</td>
                <td class="py-2.5 px-3">Bruto s.d. Rp 6.600.000</td>
                <td class="py-2.5 px-3 text-center font-mono">41 Lapisan (0% - 34%)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="text-xs text-slate-600"><em>Rumus Masa Januari s.d. November:</em><br>
        <code class="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono font-bold">PPh 21 Sebulan = Penghasilan Bruto Sebulan × Tarif TER</code></p>
      `
    },
    {
      id: 'faq-3',
      kategori: 'Regulasi Baru & Konsep TER',
      kategoriKey: 'regulasi-ter',
      tanya: 'Bagaimana ketentuan pemotongan PPh 21 untuk Pegawai Tidak Tetap dan TER Harian?',
      jawab: `
        <p>Bagi <strong>Pegawai Tidak Tetap</strong> (tenaga honorer lepas, upah borongan, atau upah satuan):</p>
        <div class="space-y-2 mt-2 text-xs text-slate-700">
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <h5 class="font-bold text-slate-900 mb-1">1. Upah Dibayar Harian / Mingguan / Satuan / Borongan:</h5>
            <ul class="list-disc pl-5 space-y-1">
              <li>Upah bruto <strong>s.d. Rp 450.000/hari</strong>: Tarif TER Harian <strong>0%</strong> (Bebas Potong).</li>
              <li>Upah bruto <strong>&gt; Rp 450.000 s.d. Rp 2.500.000/hari</strong>: Tarif TER Harian <strong>0,5%</strong> dari total upah bruto harian.</li>
              <li>Upah bruto <strong>&gt; Rp 2.500.000/hari</strong>: Dikenakan <code>Tarif Progresif Pasal 17 × (50% × Bruto Harian)</code>.</li>
            </ul>
          </div>
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <h5 class="font-bold text-slate-900 mb-1">2. Upah Dibayar Bulanan:</h5>
            <p>Jika Pegawai Tidak Tetap menerima honorarium/upah secara bulanan, pemotongan pajaknya menggunakan <strong>Tarif Efektif Bulanan (TER A, B, atau C)</strong> sesuai status PTKP pegawai tersebut dikalikan seluruh penghasilan bruto bulan bersangkutan.</p>
          </div>
        </div>
      `
    },
    {
      id: 'faq-4',
      kategori: 'Regulasi Baru & Konsep TER',
      kategoriKey: 'regulasi-ter',
      tanya: 'Bagaimana ketentuan pemotongan PPh 21 bagi Penerima Pensiun Berkala?',
      jawab: `
        <p>Untuk penerima pensiun berkala (seperti Pensiunan ASN yang dibayarkan rutin setiap bulan melalui PT Taspen):</p>
        <ul class="list-disc pl-5 space-y-1.5 text-slate-700 my-2">
          <li><strong>Masa Januari s.d. November:</strong> Dihitung menggunakan <strong>TER Bulanan (Kategori A, B, atau C)</strong> sesuai status PTKP dikalikan penghasilan bruto uang pensiun sebulan.</li>
          <li><strong>Masa Pajak Terakhir (Desember):</strong> Dihitung menggunakan <strong>Tarif Progresif Pasal 17 UU PPh</strong> atas Penghasilan Neto Setahun (Uang pensiun setahun dikurangi <strong>Biaya Pensiun</strong> 5% maksimal Rp 2.400.000/tahun atau Rp 200.000/bulan, serta dikurangi PTKP).</li>
        </ul>
      `
    },

    // -------------------------------------------------------------------------
    // 2. Rekonsiliasi Akhir Tahun (Desember)
    // -------------------------------------------------------------------------
    {
      id: 'faq-5',
      kategori: 'Rekonsiliasi Akhir Tahun (Desember)',
      kategoriKey: 'rekonsiliasi-desember',
      tanya: 'Bagaimana rumus resmi perhitungan PPh 21 pada Masa Pajak Terakhir (Desember)?',
      jawab: `
        <p>Pada <strong>Masa Pajak Terakhir</strong> (bulan Desember atau bulan ketika pegawai berhenti/pensiun), skema <strong>TER tidak lagi digunakan</strong>. Pemotong wajib menghitung ulang PPh 21 setahun penuh secara akurat dengan tahapan resmi berikut:</p>
        <ol class="list-decimal pl-5 space-y-2 text-slate-700 my-3">
          <li><strong>Hitung Total Bruto Setahun:</strong> Jumlahkan Gaji Pokok, Seluruh Tunjangan Melekat, TPP/Tukin, Upah Pungut, Honorarium panitia dinas, Bonus/THR, Premi Asuransi JKK/JKM dibayar pemberi kerja, dan Natura objek pajak.</li>
          <li><strong>Hitung Pengurang Bruto Setahun:</strong>
            <ul class="list-disc pl-5 mt-1 space-y-0.5 text-xs">
              <li><em>Biaya Jabatan:</em> 5% × Bruto Setahun (Maksimal Rp 6.000.000 per tahun atau Rp 500.000 per bulan bekerja).</li>
              <li><em>Iuran Pensiun &amp; THT:</em> Sebesar iuran yang dibayar sendiri oleh pegawai (dipotong dari slip).</li>
              <li><em>Zakat / Sumbangan Keagamaan Wajib:</em> Yang disalurkan melalui pemotong ke BAZNAS/LAZ resmi.</li>
            </ul>
          </li>
          <li><strong>Hitung Penghasilan Neto Setahun:</strong> <code>Penghasilan Bruto Setahun - Total Pengurang</code>.</li>
          <li><strong>Hitung Penghasilan Kena Pajak (PKP):</strong> <code>Penghasilan Neto Setahun - Nilai PTKP Tahunan</code> (dibulatkan ke bawah ke ribuan rupiah penuh).</li>
          <li><strong>Hitung PPh 21 Terutang Setahun:</strong> Dikenakan Tarif Progresif Pasal 17 ayat (1) huruf a UU PPh (UU HPP):
            <div class="grid grid-cols-2 gap-2 mt-1 text-xs font-mono bg-slate-100 p-2.5 rounded-lg">
              <div>s.d. Rp 60 Juta: <strong>5%</strong></div>
              <div>&gt; Rp 60 jt s.d. Rp 250 jt: <strong>15%</strong></div>
              <div>&gt; Rp 250 jt s.d. Rp 500 jt: <strong>25%</strong></div>
              <div>&gt; Rp 500 jt s.d. Rp 5 Miliar: <strong>30%</strong></div>
              <div class="col-span-2">&gt; Rp 5 Miliar: <strong>35%</strong></div>
            </div>
          </li>
          <li><strong>Hitung PPh Masa Terakhir (Desember):</strong><br>
            <code class="bg-emerald-50 text-emerald-900 border border-emerald-200 px-2 py-1 rounded font-mono font-bold block mt-1">
              PPh Terutang Desember = (PPh Terutang Setahun) - (Akumulasi PPh Dipotong Jan s.d. Nov)
            </code>
          </li>
        </ol>
      `
    },
    {
      id: 'faq-6',
      kategori: 'Rekonsiliasi Akhir Tahun (Desember)',
      kategoriKey: 'rekonsiliasi-desember',
      tanya: 'Mengapa sering terjadi potongan pajak yang melonjak tinggi (Kurang Bayar) di bulan Desember bagi ASN?',
      jawab: `
        <p>Banyak pegawai ASN terkejut ketika slip gaji bulan Desember mengalami potongan pajak yang jauh lebih tinggi dibanding bulan-bulan sebelumnya. Menurut Buku Panduan DJP 2024, kondisi ini wajar dan disebabkan oleh 2 faktor utama:</p>
        <div class="space-y-2.5 my-2">
          <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
            <h5 class="font-bold mb-1 flex items-center gap-1.5 text-amber-800">
              <span>1. Pergeseran Lapisan Tarif Progresif Pasal 17 (Bracket Creep)</span>
            </h5>
            <p>Pada bulan Januari s.d. November, pemotongan menggunakan persentase TER bulanan yang didesain berdasarkan rata-rata penghasilan rutin bulanan. Namun saat Desember, seluruh penghasilan setahun diakumulasikan. Ketika Penghasilan Kena Pajak (PKP) menembus batas Rp 60.000.000, kelebihannya dikenakan tarif 15%, dan di atas Rp 250.000.000 dikenakan 25%. Selisih akumulasi tarif progresif ini seluruhnya dibebankan pada bulan Desember.</p>
          </div>
          <div class="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-900">
            <h5 class="font-bold mb-1 flex items-center gap-1.5 text-rose-800">
              <span>2. Dampak Split Withholding (Pemotongan Terpisah Lintas Komponen / OPD)</span>
            </h5>
            <p>Gaji rutin, TPP, honorarium kepanitiaan, dan uang makan dibayarkan melalui daftar pembayaran terpisah atau dari bendahara OPD berbeda. Ketika dipotong secara parsial, masing-masing slip berada pada rentang TER yang rendah (bahkan 0% s.d. 1,5%). Saat seluruhnya digabungkan di akhir tahun, total PKP melonjak tinggi sehingga memicu kekurangan potong yang harus dilunasi di bulan Desember.</p>
          </div>
        </div>
      `
    },
    {
      id: 'faq-7',
      kategori: 'Rekonsiliasi Akhir Tahun (Desember)',
      kategoriKey: 'rekonsiliasi-desember',
      tanya: 'Bagaimana penanganan Kelebihan Pemotongan (Lebih Bayar) di masa pajak terakhir?',
      jawab: `
        <p>Berdasarkan <strong>Pasal 19 dan 21 PMK Nomor 168 Tahun 2023</strong>, jika hasil penghitungan PPh 21 setahun lebih kecil daripada jumlah PPh 21 yang telah dipotong pada masa Januari s.d. November, maka terjadi <strong>Kelebihan Pemotongan Pajak</strong>.</p>
        <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-2 my-2">
          <h5 class="font-bold text-emerald-800">Kewajiban Mutlak Pemotong Pajak (Instansi/Bendahara):</h5>
          <ol class="list-decimal pl-5 space-y-1">
            <li>Pemotong Pajak <strong>wajib mengembalikan kelebihan pemotongan</strong> tersebut kepada pegawai yang bersangkutan secara utuh.</li>
            <li>Pengembalian dilakukan bersamaan dengan penyerahan Bukti Pemotongan PPh Pasal 21 (paling lambat akhir bulan berikutnya setelah masa pajak terakhir berakhir).</li>
            <li>Bagi Pemotong, kelebihan setor tersebut dapat dikompensasikan ke SPT Masa PPh Pasal 21 bulan-bulan berikutnya tanpa harus berurutan.</li>
          </ol>
        </div>
      `
    },
    {
      id: 'faq-8',
      kategori: 'Rekonsiliasi Akhir Tahun (Desember)',
      kategoriKey: 'rekonsiliasi-desember',
      tanya: 'Bagaimana perhitungan bagi pegawai yang mulai bekerja atau pensiun di tengah tahun?',
      jawab: `
        <p>Bagi pegawai ASN yang mutasi, baru diangkat (CPNS), atau memasuki masa pensiun di tengah tahun berjalan:</p>
        <ul class="list-disc pl-5 space-y-2 text-xs text-slate-700 my-2">
          <li><strong>Masa Kerja Berjalan:</strong> Dipotong setiap bulan menggunakan TER Bulanan sesuai kelompok PTKP dan total bruto pada bulan tersebut.</li>
          <li><strong>Masa Pajak Terakhir (Bulan Berhenti / Mutasi / Pensiun):</strong>
            <div class="mt-1 pl-3 border-l-2 border-emerald-400 space-y-1">
              <p><strong>WNI (Kewajiban Subjektif Sejak Awal Tahun):</strong> Penghasilan neto dihitung berdasarkan jumlah riil yang nyata-nyata diterima selama bulan bekerja (<strong>TIDAK DISETALUNAKAN</strong>). Nilai PTKP yang dikurangkan tetap diberikan <strong>penuh setahun (12 bulan utuh)</strong>.</p>
              <p><strong>WNA atau WNI yang Pindah ke LN Permanen (Kewajiban Subjektif Sebagian Tahun):</strong> Penghasilan neto disetahunkan secara proporsional, dikurangi PTKP, dihitung PPh terutang, lalu dikalikan rasio masa kerja <code>(n / 12)</code>.</p>
            </div>
          </li>
        </ul>
      `
    },

    // -------------------------------------------------------------------------
    // 3. Komponen Penambah & Pengurang Bruto
    // -------------------------------------------------------------------------
    {
      id: 'faq-9',
      kategori: 'Komponen Penambah & Pengurang Bruto',
      kategoriKey: 'bruto-pengurang',
      tanya: 'Apa saja unsur penghasilan yang wajib ditambahkan ke dalam Penghasilan Bruto ASN?',
      jawab: `
        <p>Sesuai PMK 168/2023, <strong>Penghasilan Bruto Pegawai Tetap</strong> yang menjadi dasar pemotongan PPh 21 meliputi seluruh penerimaan dalam bentuk uang maupun natura yang bersumber dari APBN/APBD atau kas pemberi kerja:</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 my-2 text-xs">
          <div class="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span class="font-bold text-slate-900 block mb-1">1. Penghasilan Rutin:</span>
            <ul class="list-disc pl-4 space-y-0.5 text-slate-700">
              <li>Gaji Pokok ASN</li>
              <li>Tunjangan Istri/Suami &amp; Anak</li>
              <li>Tunjangan Jabatan / Fungsional / Umum</li>
              <li>Tunjangan Beras &amp; Tunjangan Lainnya</li>
            </ul>
          </div>
          <div class="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span class="font-bold text-slate-900 block mb-1">2. Tunjangan Kinerja &amp; Honor:</span>
            <ul class="list-disc pl-4 space-y-0.5 text-slate-700">
              <li>Tambahan Penghasilan Pegawai (TPP) / Tukin</li>
              <li>Upah Pungut Pajak / Retribusi Daerah</li>
              <li>Honorarium kegiatan kedinasan</li>
              <li>Uang lembur &amp; uang makan rutin</li>
            </ul>
          </div>
          <div class="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span class="font-bold text-slate-900 block mb-1">3. Penghasilan Tidak Teratur:</span>
            <ul class="list-disc pl-4 space-y-0.5 text-slate-700">
              <li>Tunjangan Hari Raya (THR)</li>
              <li>Gaji Ketiga Belas (Gaji-13)</li>
              <li>Bonus, Gratifikasi, atau Jasa Produksi</li>
            </ul>
          </div>
          <div class="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span class="font-bold text-slate-900 block mb-1">4. Premi &amp; Fasilitas:</span>
            <ul class="list-disc pl-4 space-y-0.5 text-slate-700">
              <li>Premi Asuransi JKK &amp; JKM dibayar Pemerintah</li>
              <li>Imbalan Natura/Kenikmatan non-kecualian (PMK 66/2023)</li>
            </ul>
          </div>
        </div>
      `
    },
    {
      id: 'faq-10',
      kategori: 'Komponen Penambah & Pengurang Bruto',
      kategoriKey: 'bruto-pengurang',
      tanya: 'Komponen apa saja yang BUKAN merupakan penambah penghasilan bruto ASN?',
      jawab: `
        <p>Pemotong pajak tidak boleh memasukkan unsur berikut ke dalam penghasilan bruto pegawai:</p>
        <ul class="list-disc pl-5 space-y-1.5 text-slate-700 text-xs sm:text-sm my-2">
          <li><strong>Iuran Pensiun dan Iuran THT/JHT yang dibayar oleh Pemberi Kerja/Pemerintah:</strong> Pembayaran iuran ini oleh instansi bukan merupakan objek pajak saat disetorkan (pajak baru dipotong saat pensiun dicairkan di kemudian hari).</li>
          <li><strong>Natura dan Kenikmatan yang Dikecualikan dari Objek PPh (PMK 66/2023):</strong>
            <ul class="list-circle pl-5 mt-1 space-y-0.5 text-xs text-slate-600">
              <li>Makanan dan minuman yang disediakan bagi seluruh pegawai di tempat kerja.</li>
              <li>Pakaian seragam dinas harian (PSH, PDH, Korpri) dan perlengkapan keselamatan kerja.</li>
              <li>Sarana/fasilitas di daerah tertentu (3T).</li>
              <li>Bingkisan hari raya keagamaan untuk seluruh pegawai.</li>
            </ul>
          </li>
          <li><strong>Zakat atau sumbangan keagamaan yang diterima pegawai</strong> dari badan/lembaga amil zakat.</li>
        </ul>
      `
    },
    {
      id: 'faq-11',
      kategori: 'Komponen Penambah & Pengurang Bruto',
      kategoriKey: 'bruto-pengurang',
      tanya: 'Berapa batas maksimal Biaya Jabatan dan Iuran Pensiun sebagai pengurang bruto?',
      jawab: `
        <p>Berdasarkan PMK 168/2023, pengurang penghasilan bruto yang sah pada Masa Pajak Terakhir (Desember) meliputi:</p>
        <div class="space-y-2 mt-2 text-xs">
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span class="font-bold text-slate-900 block mb-0.5">1. Biaya Jabatan (Pegawai Tetap):</span>
            <p class="text-slate-700">Diberikan kepada <strong>seluruh pegawai tetap</strong> (termasuk ASN tanpa jabatan struktural) sebesar <strong>5% dari Penghasilan Bruto</strong>, dengan batas maksimal <strong>Rp 500.000 per bulan</strong> atau <strong>Rp 6.000.000 per tahun</strong>.</p>
          </div>
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span class="font-bold text-slate-900 block mb-0.5">2. Iuran Pensiun / THT / JHT:</span>
            <p class="text-slate-700">Dihitung sebesar <strong>nominal riil yang dipotong dari penghasilan pegawai</strong> (iuran yang ditanggung sendiri oleh pegawai dan disetorkan ke PT Taspen atau dana pensiun yang disahkan OJK/Kemenkeu).</p>
          </div>
        </div>
        <p class="text-xs text-slate-600 pt-1"><em>Catatan:</em> Pengurang Biaya Jabatan dan Iuran Pensiun hanya dihitung pada Masa Pajak Terakhir (Desember), karena pada masa Januari-November hal ini telah otomatis diperhitungkan dalam formulasi tabel TER.</p>
      `
    },
    {
      id: 'faq-12',
      kategori: 'Komponen Penambah & Pengurang Bruto',
      kategoriKey: 'bruto-pengurang',
      tanya: 'Apakah zakat atau sumbangan keagamaan wajib dapat menjadi pengurang pajak PPh 21?',
      jawab: `
        <p><strong>YA, BISA.</strong> Sesuai ketentuan Pasal 10 PMK 168/2023, zakat atas penghasilan atau sumbangan keagamaan yang sifatnya wajib dapat dikurangkan dari penghasilan bruto pada perhitungan masa pajak terakhir dengan syarat:</p>
        <ol class="list-decimal pl-5 space-y-1 text-slate-700 text-xs my-2">
          <li>Dibayarkan oleh pegawai <strong>melalui pemberi kerja</strong> (misal dipotong langsung dari daftar gaji oleh Bendahara Gaji), ATAU dibayarkan langsung oleh pegawai dengan melampirkan fotokopi bukti setor valid.</li>
          <li>Disalurkan kepada <strong>Badan Amil Zakat Nasional (BAZNAS)</strong>, <strong>Lembaga Amil Zakat (LAZ)</strong> resmi yang dibentuk atau disahkan oleh Pemerintah, atau lembaga keagamaan resmi yang dibentuk atau disahkan oleh Pemerintah.</li>
        </ol>
      `
    },

    // -------------------------------------------------------------------------
    // 4. PTKP & Ketentuan Wanita
    // -------------------------------------------------------------------------
    {
      id: 'faq-13',
      kategori: 'PTKP & Ketentuan Wanita',
      kategoriKey: 'ptkp-wanita',
      tanya: 'Berapa besaran resmi PTKP saat ini dan siapa saja yang sah menjadi tanggungan?',
      jawab: `
        <p>Berdasarkan <strong>PMK Nomor 101/PMK.010/2016</strong> yang berlaku hingga saat ini, besaran Penghasilan Tidak Kena Pajak (PTKP) tahunan adalah:</p>
        <ul class="list-disc pl-5 space-y-1 text-slate-700 text-xs sm:text-sm my-2">
          <li>Untuk Wajib Pajak Sendiri: <strong>Rp 54.000.000</strong> per tahun.</li>
          <li>Tambahan untuk Wajib Pajak Kawin: <strong>Rp 4.500.000</strong> per tahun.</li>
          <li>Tambahan untuk setiap anggota keluarga sedarah dan semenda yang menjadi tanggungan sepenuhnya: <strong>Rp 4.500.000</strong> per orang (maksimal 3 orang).</li>
        </ul>
        <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1 my-2">
          <h5 class="font-bold text-amber-900">Aturan Sah Tanggungan Keluarga (Garis Lurus Satu Derajat):</h5>
          <ul class="list-disc pl-5 space-y-1">
            <li><strong>Yang Sah:</strong> Orang tua kandung, mertua, anak kandung, anak tiri, dan anak angkat yang sah secara hukum, yang tidak berpenghasilan dan menjadi tanggungan sepenuhnya.</li>
            <li><strong>TIDAK Boleh:</strong> Saudara kandung, saudara ipar, paman, bibi, keponakan, dan sepupu (karena hubungan garis ke samping, bukan garis lurus).</li>
          </ul>
        </div>
        <p class="text-xs text-slate-600"><em>Waktu Penentuan:</em> Status PTKP ditentukan berdasarkan keadaan pada tanggal <strong>1 Januari</strong> tahun pajak berjalan. Perkawinan atau kelahiran anak setelah 1 Januari baru diakui pada tahun pajak berikutnya.</p>
      `
    },
    {
      id: 'faq-14',
      kategori: 'PTKP & Ketentuan Wanita',
      kategoriKey: 'ptkp-wanita',
      tanya: 'Bagaimana status PTKP bagi ASN Wanita / Karyawati (Lajang vs Menikah)?',
      jawab: `
        <p>Sistem perpajakan di Indonesia memandang keluarga sebagai <strong>satu kesatuan ekonomis</strong>, di mana pemenuhan kewajiban perpajakan dipusatkan pada suami sebagai kepala keluarga:</p>
        <div class="space-y-2 mt-2 text-xs">
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span class="font-bold text-slate-900 block mb-0.5">1. Wanita Belum Menikah (Lajang):</span>
            <p class="text-slate-700">Diberikan status PTKP diri sendiri (<strong>TK/0</strong>) ditambah tanggungan orang tua kandung jika memenuhi syarat (maksimal TK/3).</p>
          </div>
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span class="font-bold text-slate-900 block mb-0.5">2. Wanita Menikah (Bersuami):</span>
            <p class="text-slate-700">Secara default berstatus <strong>TK/0 (Kategori TER A)</strong>, baik suaminya bekerja maupun tidak bekerja, karena tunjangan kawin dan tanggungan anak telah diperhitungkan pada status PTKP suami.</p>
          </div>
          <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950">
            <span class="font-bold text-emerald-900 block mb-0.5">3. Pengecualian Karyawati Bersuami Memperoleh Status K/...:</span>
            <p class="text-emerald-900">Karyawati kawin dapat memperoleh status Kawin dan memperhitungkan tanggungan anak (K/1, K/2, K/3) <strong>hanya jika</strong> menyerahkan surat keterangan tertulis dari Pemerintah Daerah serendah-rendahnya <strong>Kecamatan</strong> yang menerangkan bahwa suaminya benar-benar tidak menerima/memperoleh penghasilan.</p>
          </div>
        </div>
      `
    },
    {
      id: 'faq-15',
      kategori: 'PTKP & Ketentuan Wanita',
      kategoriKey: 'ptkp-wanita',
      tanya: 'Bagaimana pemotongan pajak bagi pasangan yang Pisah Harta (PH) atau Memilih Terpisah (MT)?',
      jawab: `
        <p>Bagi suami-istri yang memiliki perjanjian pemisahan harta dan penghasilan (<strong>Pisah Harta / PH</strong>) atau istri yang menghendaki menjalankan hak dan kewajiban perpajakan sendiri (<strong>Memilih Terpisah / MT</strong>):</p>
        <ul class="list-disc pl-5 space-y-1.5 text-slate-700 text-xs sm:text-sm my-2">
          <li><strong>Pemotongan Bulanan di Kantor Istri:</strong> Pemotong di instansi tempat istri bekerja tetap memotong PPh 21 menggunakan status <strong>TK/0 (TER Kategori A)</strong>.</li>
          <li><strong>Pemotongan Bulanan di Kantor Suami:</strong> Suami dipotong sesuai status PTKP yang sebenarnya (misal K/1, K/2, atau K/3).</li>
          <li><strong>Pelaporan Akhir Tahun di SPT Tahunan:</strong> Penghasilan neto suami dan istri digabungkan. PPh terutang dihitung kembali berdasarkan tarif Pasal 17 UU PPh atas Penghasilan Kena Pajak gabungan, kemudian dialokasikan secara proporsional sesuai perbandingan penghasilan neto masing-masing.</li>
        </ul>
      `
    },

    // -------------------------------------------------------------------------
    // 5. Bukan Pegawai & Peserta Kegiatan
    // -------------------------------------------------------------------------
    {
      id: 'faq-16',
      kategori: 'Bukan Pegawai & Peserta Kegiatan',
      kategoriKey: 'bukan-pegawai',
      tanya: 'Bagaimana skema pemotongan PPh 21 Bukan Pegawai (Narasumber, Konsultan, Tenaga Ahli)?',
      jawab: `
        <p>Berdasarkan PMK 168/2023, tata cara pemotongan PPh 21 Bukan Pegawai <strong>disederhanakan secara revolusioner</strong>:</p>
        <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1.5 my-2">
          <p class="font-bold text-emerald-900">Perubahan Signifikan di PMK 168/2023:</p>
          <ul class="list-disc pl-5 space-y-1">
            <li>Tidak ada lagi pembedaan imbalan "berkesinambungan" dan "tidak berkesinambungan".</li>
            <li><strong>Tidak ada lagi perhitungan kumulatif</strong> dengan penghasilan sebelumnya.</li>
            <li>Setiap kali dilakukan pembayaran kepada Bukan Pegawai, rumus pemotongannya adalah:</li>
          </ul>
          <div class="p-2.5 bg-white rounded-lg border border-emerald-300 font-mono text-center font-bold text-emerald-900 my-1">
            DPP = 50% × Penghasilan Bruto<br>
            PPh 21 = Tarif Pasal 17 UU PPh × DPP
          </div>
        </div>
        <p class="text-xs text-slate-600"><em>Contoh:</em> Instansi mengundang Guru Besar luar sebagai narasumber workshop dengan honorarium bruto Rp 10.000.000. DPP = 50% × Rp 10.000.000 = Rp 5.000.000. PPh 21 (5%) = Rp 250.000. Honorarium bersih yang diterima narasumber = Rp 9.750.000.</p>
      `
    },
    {
      id: 'faq-17',
      kategori: 'Bukan Pegawai & Peserta Kegiatan',
      kategoriKey: 'bukan-pegawai',
      tanya: 'Bagaimana pemotongan PPh 21 bagi Peserta Kegiatan (Uang Saku, Sidang Rapat, Lomba)?',
      jawab: `
        <p><strong>Peserta Kegiatan</strong> adalah orang pribadi yang menerima imbalan sehubungan dengan keikutsertaannya dalam suatu kegiatan kedinasan, seperti peserta perlombaan, peserta rapat dinas, peserta pelatihan/diklat, atau peserta sidang.</p>
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 space-y-1.5 my-2">
          <p class="font-bold text-slate-900">Formula Pemotongan Peserta Kegiatan:</p>
          <div class="p-2 bg-white rounded border border-slate-300 font-mono text-center font-bold text-slate-900">
            PPh 21 = Tarif Pasal 17 UU PPh × Penghasilan Bruto
          </div>
          <p class="text-rose-700 font-medium"><em>Perhatian Perbedaan Penting:</em> Dasar Pengenaan Pajak (DPP) bagi Peserta Kegiatan adalah <strong>100% dari Penghasilan Bruto</strong> (tidak dikalikan 50% seperti Bukan Pegawai), dan dipotong pada setiap kali pembayaran tanpa kumulasi.</p>
        </div>
      `
    },
    {
      id: 'faq-18',
      kategori: 'Bukan Pegawai & Peserta Kegiatan',
      kategoriKey: 'bukan-pegawai',
      tanya: 'Bagaimana pemotongan atas imbalan kepada Mantan Pegawai dan Penarikan Dana Pensiun?',
      jawab: `
        <ul class="list-disc pl-5 space-y-2 text-xs sm:text-sm text-slate-700 my-2">
          <li><strong>Mantan Pegawai:</strong> Yang menerima jasa produksi, tantiem, gratifikasi, bonus, atau imbalan lain dari mantan instansi pemberi kerjanya dipotong PPh 21 dengan: <code>Tarif Progresif Pasal 17 × Penghasilan Bruto</code> secara kumulatif pada tahun takwim yang bersangkutan.</li>
          <li><strong>Penarikan Dana Pensiun oleh Pegawai Aktif:</strong> Penarikan dana dari dana pensiun yang pendiriannya telah disahkan Menteri Keuangan dipotong PPh 21 dengan: <code>Tarif Progresif Pasal 17 × Jumlah Bruto yang ditarik</code>.</li>
          <li><strong>Wajib Pajak Luar Negeri (PPh Pasal 26):</strong> Imbalan kepada WPLN dipotong PPh Pasal 26 sebesar <strong>20% dari Penghasilan Bruto</strong> bersifat final, kecuali diatur lain oleh Perjanjian Penghindaran Pajak Berganda (P3B / Tax Treaty).</li>
        </ul>
      `
    },

    // -------------------------------------------------------------------------
    // 6. Kewajiban Bendahara & Multi-OPD
    // -------------------------------------------------------------------------
    {
      id: 'faq-19',
      kategori: 'Kewajiban Bendahara & Multi-OPD',
      kategoriKey: 'kewajiban-bendahara',
      tanya: 'Apakah Bendahara wajib menerbitkan Bukti Potong jika PPh terutang bernilai Nihil (Rp 0)?',
      jawab: `
        <p><strong>YA, WAJIB.</strong> Berdasarkan ketentuan PMK 168/2023:</p>
        <ol class="list-decimal pl-5 space-y-1.5 text-xs sm:text-sm text-slate-700 my-2">
          <li>Pemotong Pajak (Bendahara Pengeluaran / SKPD) <strong>wajib membuat Bukti Pemotongan PPh Pasal 21</strong> dan memberikannya kepada penerima penghasilan untuk setiap masa pajak.</li>
          <li>Kewajiban ini tetap berlaku <strong>meskipun PPh Pasal 21 yang terutang bernilai Nihil (Rp 0)</strong>, termasuk karena penghasilan bruto berada pada rentang TER 0%.</li>
          <li>Bukti Pemotongan merupakan dokumen resmi hak pegawai yang menjadi sarana akuntabilitas kredit pajak serta kelengkapan pelaporan SPT Tahunan di DJP Online.</li>
        </ol>
      `
    },
    {
      id: 'faq-20',
      kategori: 'Kewajiban Bendahara & Multi-OPD',
      kategoriKey: 'kewajiban-bendahara',
      tanya: 'Bagaimana penanganan masalah Split Withholding (Penghasilan dari Berbagai OPD/Bendahara)?',
      jawab: `
        <p>Dalam birokrasi pemerintahan daerah maupun kementerian, seorang pegawai ASN sering menerima penghasilan dari bendahara pengeluaran yang terpisah:</p>
        <ul class="list-disc pl-5 space-y-1 text-xs text-slate-700 my-2">
          <li>Gaji Induk dibayarkan oleh Bendahara SKPD/BKD.</li>
          <li>Tambahan Penghasilan Pegawai (TPP) dibayarkan oleh Bendahara Sekretariat Daerah / BPKAD.</li>
          <li>Honorarium narasumber atau uang lembur kegiatan dibayarkan oleh OPD pelaksana lain.</li>
        </ul>
        <p class="text-xs text-slate-700">Aplikasi ini memfasilitasi pencatatan <strong>NPWP Bendahara Pemotong</strong> tersendiri pada setiap kolom slip per bulan. Aplikasi menyajikan <strong>Tabel Rekapitulasi Multi-Bendahara</strong> yang mengelompokkan bruto dan potongan per instansi, serta menghitung proyeksi rekonsiliasi akhir tahun di instansi induk agar tidak terjadi lonjakan kekurangan potong yang tak terduga.</p>
      `
    },
    {
      id: 'faq-21',
      kategori: 'Kewajiban Bendahara & Multi-OPD',
      kategoriKey: 'kewajiban-bendahara',
      tanya: 'Apakah pegawai yang tidak memiliki NPWP masih dikenakan tarif 20% lebih tinggi?',
      jawab: `
        <p><strong>TIDAK LAGI.</strong> Sejak berlakunya PMK 168/2023 dan terintegrasinya Nomor Induk Kependudukan (NIK) menjadi Nomor Pokok Wajib Pajak (NPWP 16 digit), ketentuan penalti tarif 20% lebih tinggi bagi Wajib Pajak yang tidak ber-NPWP <strong>telah resmi dihapuskan</strong> untuk pemotongan PPh Pasal 21.</p>
        <p class="text-xs text-slate-700 mt-1">Pemotongan PPh Pasal 21 bagi Wajib Pajak Orang Pribadi dalam negeri kini menggunakan NIK yang divalidasi dengan data Kependudukan dan Pencatatan Sipil (Dukcapil) dengan pengenaan tarif normal yang sama.</p>
      `
    },

    // -------------------------------------------------------------------------
    // 7. Bukti Potong BPA2 & SPT Tahunan
    // -------------------------------------------------------------------------
    {
      id: 'faq-22',
      kategori: 'Bukti Potong BPA2 & SPT Tahunan',
      kategoriKey: 'bpa2-spt',
      tanya: 'Apa itu Formulir 1721-BPA2 dan bagaimana cara mencetaknya di aplikasi?',
      jawab: `
        <p><strong>Formulir 1721-BPA2</strong> adalah Bukti Pemotongan Pajak Penghasilan Pasal 21 bagi Pegawai Tetap / ASN yang merangkum rincian penghasilan bruto setahun, pengurang sah (biaya jabatan dan iuran pensiun), PTKP, PKP, dan PPh 21 yang telah dipotong dan dilunasi selama masa pajak berjalan sesuai format standar e-Bupot DJP.</p>
        <p class="font-semibold text-slate-800 text-xs sm:text-sm mt-2">Tata cara mencetak di aplikasi:</p>
        <ol class="list-decimal pl-5 space-y-1 text-xs text-slate-700 my-2">
          <li>Buka tab <strong>4. Cetak Bukti Potong 1721-BPA2</strong>.</li>
          <li>Pilih rentang masa pajak (misal <strong>Masa 01 - 12</strong> untuk satu tahun penuh, atau periode mutasi).</li>
          <li>Pilih entitas pemotong (Konsolidasi Instansi Utama atau per Bendahara tertentu).</li>
          <li>Klik tombol <strong>Cetak / Print PDF (A4)</strong> atau <strong>Unduh File HTML</strong>.</li>
        </ol>
      `
    },
    {
      id: 'faq-23',
      kategori: 'Bukti Potong BPA2 & SPT Tahunan',
      kategoriKey: 'bpa2-spt',
      tanya: 'Bagaimana cara menggunakan Formulir BPA2 untuk pelaporan SPT Tahunan di DJP Online?',
      jawab: `
        <p>Paling lambat 31 Maret setiap tahunnya, ASN wajib melaporkan SPT Tahunan Orang Pribadi melalui e-Filing DJP Online:</p>
        <ul class="list-disc pl-5 space-y-1 text-xs text-slate-700 my-2">
          <li>Jika penghasilan bruto setahun &le; Rp 60.000.000 dan hanya dari 1 pemberi kerja: gunakan formulir <strong>1770 SS</strong>.</li>
          <li>Jika penghasilan bruto setahun &gt; Rp 60.000.000 atau menerima penghasilan dari multi-bendahara: gunakan formulir <strong>1770 S</strong>.</li>
        </ul>
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 space-y-1 my-2">
          <p class="font-bold text-slate-900">Langkah Pengisian Formulir 1770 S di DJP Online:</p>
          <ol class="list-decimal pl-5 space-y-1">
            <li>Salin <strong>Penghasilan Bruto (Angka 1)</strong> ke isian Penghasilan Neto Dalam Negeri.</li>
            <li>Salin <strong>Pengurang (Biaya Jabatan &amp; Iuran Pensiun - Angka 2)</strong> ke isian Pengurang Bruto.</li>
            <li>Pilih <strong>Status PTKP</strong> yang tertera pada Profil Formulir BPA2.</li>
            <li>Buka <strong>Bagian Bukti Potong Pihak Lain</strong>: Masukkan NPWP Instansi Pemotong, Nama Instansi, Nomor Bukti Potong BPA2, Tanggal, dan Nilai PPh Dipotong (Angka 8).</li>
            <li>Status SPT Anda akan bernilai <strong>NIHIL</strong> jika seluruh pemotongan telah dicocokkan dengan benar.</li>
          </ol>
        </div>
      `
    },

    // -------------------------------------------------------------------------
    // 8. Panduan Aplikasi & Privasi
    // -------------------------------------------------------------------------
    {
      id: 'faq-24',
      kategori: 'Panduan Aplikasi & Privasi',
      kategoriKey: 'aplikasi-privasi',
      tanya: 'Bagaimana sistem Kuota Perhitungan harian dan aturan Login Akun Google?',
      jawab: `
        <p>Untuk menjaga kestabilan sistem backend dan mencegah automated scraping, aplikasi menerapkan kebijakan autentikasi pengguna:</p>
        <ul class="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-700 my-2">
          <li><strong>Wajib Login Google:</strong> Semua pengguna wajib masuk menggunakan Akun Google resmi terlebih dahulu sebelum menggunakan fitur perhitungan dan cetak bukti potong.</li>
          <li><strong>Kuota Pengguna:</strong> Setiap akun Google diberikan kuota <strong>25x perhitungan per hari</strong> secara cuma-cuma yang diperbarui otomatis setiap pergantian hari.</li>
          <li><strong>Administrator:</strong> Memiliki kuota tanpa batas (Unlimited) serta akses ke panel pengawasan rekapitulasi proses di Dashboard Admin.</li>
        </ul>
      `
    },
    {
      id: 'faq-25',
      kategori: 'Panduan Aplikasi & Privasi',
      kategoriKey: 'aplikasi-privasi',
      tanya: 'Apakah data gaji, NIK, dan nominal TPP saya aman dan tersimpan di server?',
      jawab: `
        <p><strong>SANGAT AMAN.</strong> Aplikasi ini memprioritaskan privasi dan kepatuhan perlindungan data pribadi (UU PDP):</p>
        <ul class="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-700 my-2">
          <li>Seluruh data profil pegawai, rincian nominal gaji, TPP, nomor SK, dan NIK diproses <strong>secara lokal di browser Anda (Local Storage)</strong>.</li>
          <li>Data penghasilan finansial Anda <strong>tidak pernah dikirimkan atau disimpan di basis data server luar</strong>.</li>
          <li>Gunakan tombol <strong>Ekspor JSON</strong> di menu <em>Data Pegawai &amp; Instansi</em> untuk menyimpan cadangan data Anda secara aman di komputer/laptop pribadi Anda.</li>
          <li>Bila bekerja di komputer umum/bersama, klik tombol <strong>Reset</strong> untuk menghapus seluruh jejak data dari peramban setelah selesai mencetak.</li>
        </ul>
      `
    }
  ];

  const categories = [
    { key: 'all', label: 'Semua Topik' },
    { key: 'regulasi-ter', label: 'Regulasi & TER' },
    { key: 'rekonsiliasi-desember', label: 'Rekonsiliasi Desember' },
    { key: 'bruto-pengurang', label: 'Bruto & Pengurang' },
    { key: 'ptkp-wanita', label: 'PTKP & Karyawati' },
    { key: 'bukan-pegawai', label: 'Bukan Pegawai & Kegiatan' },
    { key: 'kewajiban-bendahara', label: 'Kewajiban Pemotong' },
    { key: 'bpa2-spt', label: 'Bukti Potong & SPT' },
    { key: 'aplikasi-privasi', label: 'Aplikasi & Privasi' }
  ];

  const categoryPillsHtml = categories.map(cat => `
    <button type="button" 
      class="faq-cat-filter px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer border ${cat.key === 'all' ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100 border-slate-200'}" 
      data-filter="${cat.key}">
      ${cat.label}
    </button>
  `).join('');

  const faqItemsHtml = faqList.map((item, idx) => {
    // Strip HTML tags and double quotes for clean data-search attribute
    const cleanSearch = (item.tanya + ' ' + item.kategori + ' ' + item.jawab.replace(/<[^>]*>/g, ' '))
      .replace(/["']/g, '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();

    return `
      <div class="faq-item border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs transition-all hover:border-slate-300" 
        data-kategori="${item.kategoriKey}" 
        data-search="${cleanSearch}">
        <button type="button" class="faq-toggle w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-slate-900 hover:bg-slate-50 transition cursor-pointer">
          <div class="flex items-center gap-3 min-w-0">
            <span class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold shrink-0">
              ${idx + 1}
            </span>
            <div class="min-w-0">
              <span class="inline-block text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mb-1">${item.kategori}</span>
              <div class="text-sm sm:text-base font-bold text-slate-900 leading-snug">${item.tanya}</div>
            </div>
          </div>
          <svg class="w-5 h-5 text-slate-400 shrink-0 transform transition-transform duration-200 faq-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div class="faq-content hidden px-6 py-5 text-xs sm:text-sm text-slate-700 border-t border-slate-200 leading-relaxed bg-slate-50/70 space-y-3">
          ${item.jawab}
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="space-y-6 max-w-4xl mx-auto">
      <!-- Header Banner -->
      <div class="bg-linear-to-r from-teal-800 to-emerald-900 rounded-2xl p-6 text-white shadow-sm">
        <div class="flex items-center justify-between gap-4 mb-3">
          <div class="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold w-fit">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Pusat Pengetahuan Resmi &amp; Panduan PPh 21/26
          </div>
          <button class="btn-back-to-calc inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/20 transition cursor-pointer">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            <span>Kembali ke Kalkulator</span>
          </button>
        </div>
        <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">Pedoman Cermat Pemotongan PPh Pasal 21/26</h2>
        <p class="text-xs sm:text-sm text-emerald-100 max-w-3xl leading-relaxed">
          Disusun komprehensif berdasarkan <strong>Buku Cermat Pemotongan PPh 21/26 DJP</strong>, <strong>PP No. 58 Tahun 2023</strong>, <strong>PMK No. 168 Tahun 2023</strong>, serta ketentuan teknis perpajakan ASN, Pegawai Tidak Tetap, dan Bukan Pegawai.
        </p>

        <!-- Search Bar with clear button -->
        <div class="mt-5 relative">
          <svg class="w-5 h-5 text-slate-400 absolute left-3.5 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="text" id="faq-search-input" placeholder="Cari topik, pasal, atau kata kunci (contoh: TER, Desember, Biaya Jabatan, Bukan Pegawai, PTKP)..." 
            class="w-full pl-10 pr-10 py-2.5 bg-white text-slate-900 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-400 shadow-sm" />
          <button id="btn-clear-faq-search" type="button" class="hidden absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      </div>

      <!-- Controls & Filter Toolbar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <!-- Category Pills -->
        <div class="flex flex-wrap items-center gap-1.5" id="faq-category-pills">
          ${categoryPillsHtml}
        </div>

        <!-- Quick actions -->
        <div class="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <span id="faq-count-text" class="text-xs text-slate-500 font-medium">Menampilkan ${faqList.length} pertanyaan</span>
          <div class="flex items-center gap-1">
            <button id="btn-faq-expand-all" type="button" class="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer">
              Buka Semua
            </button>
            <button id="btn-faq-collapse-all" type="button" class="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer">
              Tutup Semua
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div id="faq-empty-state" class="hidden bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div class="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <h4 class="text-base font-bold text-slate-800">Pertanyaan Tidak Ditemukan</h4>
        <p class="text-xs text-slate-500 max-w-sm mx-auto">Tidak ada materi FAQ yang sesuai dengan kata kunci atau filter kategori yang dipilih. Silakan coba kata kunci lain.</p>
        <button id="btn-reset-faq-filter" type="button" class="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition cursor-pointer">
          Reset Filter &amp; Pencarian
        </button>
      </div>

      <!-- FAQ Accordion List -->
      <div id="faq-container" class="space-y-3">
        ${faqItemsHtml}
      </div>
    </div>
  `;
}
