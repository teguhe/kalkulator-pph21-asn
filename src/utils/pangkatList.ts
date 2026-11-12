export interface PangkatItem {
  value: string;
  label: string;
  keterangan?: string;
}

export interface PangkatGroup {
  group: string;
  items: PangkatItem[];
}

export const DAFTAR_PANGKAT_GOLONGAN: PangkatGroup[] = [
  {
    group: 'PNS - Golongan IV (Pembina)',
    items: [
      { value: 'Pembina Utama (IV/e)', label: 'Pembina Utama (IV/e)' },
      { value: 'Pembina Utama Madya (IV/d)', label: 'Pembina Utama Madya (IV/d)' },
      { value: 'Pembina Utama Muda (IV/c)', label: 'Pembina Utama Muda (IV/c)' },
      { value: 'Pembina Tingkat I (IV/b)', label: 'Pembina Tingkat I (IV/b)' },
      { value: 'Pembina (IV/a)', label: 'Pembina (IV/a)' },
    ]
  },
  {
    group: 'PNS - Golongan III (Penata)',
    items: [
      { value: 'Penata Tingkat I (III/d)', label: 'Penata Tingkat I (III/d)' },
      { value: 'Penata (III/c)', label: 'Penata (III/c)' },
      { value: 'Penata Muda Tingkat I (III/b)', label: 'Penata Muda Tingkat I (III/b)' },
      { value: 'Penata Muda (III/a)', label: 'Penata Muda (III/a)' },
    ]
  },
  {
    group: 'PNS - Golongan II (Pengatur)',
    items: [
      { value: 'Pengatur Tingkat I (II/d)', label: 'Pengatur Tingkat I (II/d)' },
      { value: 'Pengatur (II/c)', label: 'Pengatur (II/c)' },
      { value: 'Pengatur Muda Tingkat I (II/b)', label: 'Pengatur Muda Tingkat I (II/b)' },
      { value: 'Pengatur Muda (II/a)', label: 'Pengatur Muda (II/a)' },
    ]
  },
  {
    group: 'PNS - Golongan I (Juru)',
    items: [
      { value: 'Juru Tingkat I (I/d)', label: 'Juru Tingkat I (I/d)' },
      { value: 'Juru (I/c)', label: 'Juru (I/c)' },
      { value: 'Juru Muda Tingkat I (I/b)', label: 'Juru Muda Tingkat I (I/b)' },
      { value: 'Juru Muda (I/a)', label: 'Juru Muda (I/a)' },
    ]
  },
  {
    group: 'PPPK (Pegawai Pemerintah dengan Perjanjian Kerja)',
    items: [
      { value: 'PPPK Golongan XVII', label: 'PPPK Golongan XVII (Ahli Utama)' },
      { value: 'PPPK Golongan XVI', label: 'PPPK Golongan XVI (Ahli Utama)' },
      { value: 'PPPK Golongan XV', label: 'PPPK Golongan XV (Ahli Utama)' },
      { value: 'PPPK Golongan XIV', label: 'PPPK Golongan XIV (Ahli Madya)' },
      { value: 'PPPK Golongan XIII', label: 'PPPK Golongan XIII (Ahli Madya)' },
      { value: 'PPPK Golongan XII', label: 'PPPK Golongan XII (Ahli Madya)' },
      { value: 'PPPK Golongan XI', label: 'PPPK Golongan XI (Ahli Muda / S-3)' },
      { value: 'PPPK Golongan X', label: 'PPPK Golongan X (Setara S-2 / Magister)' },
      { value: 'PPPK Golongan IX', label: 'PPPK Golongan IX (Setara S-1 / Ahli Pertama)' },
      { value: 'PPPK Golongan VIII', label: 'PPPK Golongan VIII (Magister Terapan)' },
      { value: 'PPPK Golongan VII', label: 'PPPK Golongan VII (Setara D-IV / Sarjana Terapan)' },
      { value: 'PPPK Golongan VI', label: 'PPPK Golongan VI' },
      { value: 'PPPK Golongan V', label: 'PPPK Golongan V (Setara D-III / Terampil)' },
      { value: 'PPPK Golongan IV', label: 'PPPK Golongan IV (Setara SMA / Pemula)' },
      { value: 'PPPK Golongan III', label: 'PPPK Golongan III' },
      { value: 'PPPK Golongan II', label: 'PPPK Golongan II (Setara SMP)' },
      { value: 'PPPK Golongan I', label: 'PPPK Golongan I (Setara SD)' },
    ]
  },
  {
    group: 'Lainnya / Non-ASN',
    items: [
      { value: 'Non-ASN / Tenaga Kontrak / Honorer', label: 'Non-ASN / Tenaga Kontrak / Honorer' },
      { value: 'Pejabat Negara / Anggota Dewan', label: 'Pejabat Negara / Anggota Dewan' },
    ]
  }
];

export function renderPangkatOptionsHtml(currentValue: string): string {
  let hasMatch = false;
  
  const groupsHtml = DAFTAR_PANGKAT_GOLONGAN.map(g => {
    const optionsHtml = g.items.map(item => {
      const isSelected = currentValue === item.value;
      if (isSelected) hasMatch = true;
      return `<option value="${item.value}" ${isSelected ? 'selected' : ''}>${item.label}</option>`;
    }).join('');

    return `<optgroup label="${g.group}">${optionsHtml}</optgroup>`;
  }).join('');

  // If there's an existing custom value not in standard list, preserve it as a selected option
  const customOptionHtml = (currentValue && !hasMatch) 
    ? `<option value="${currentValue}" selected>${currentValue} (Kustom)</option>` 
    : '';

  const defaultOptionHtml = `<option value="" ${!currentValue ? 'selected' : ''} disabled>-- Pilih Pangkat / Golongan --</option>`;

  return `${defaultOptionHtml}${customOptionHtml}${groupsHtml}`;
}
