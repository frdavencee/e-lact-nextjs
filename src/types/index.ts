export interface Branch {
  id: number
  name: string
  code: string | null
  created_at: string
  updated_at: string
}

export interface Personel {
  id: number
  nama: string
  nik: string
  jabatan: string | null
  position: string | null
}

export interface Project {
  id: number
  lokasi_id: number | null
  name: string
  contract_number: string | null
  purchase_order_number: string | null
  branch_id: number | null
  implementer: string | null
  waspang_id: number | null
  waspangRelation?: Personel | null
  branch?: Branch | null
}

export interface CommissioningTestImage {
  id: number
  commissioning_test_id: number
  file_path: string
  label: string | null
  urutan: number
}

export interface CommissioningTest {
  id: number
  lokasi_id: number
  personel_id: number | null
  tanggal: string | null
  kota_ttd: string | null
  status_pekerjaan: string | null
  status_hasil: string | null
  status_kelayakan: string | null
  personel?: Personel | null
  images?: CommissioningTestImage[]
}

export interface BoqItem {
  id: number
  lokasi_id: number
  kode_item: string | null
  nama_item: string | null
  satuan: string | null
  volume: number | null
  keterangan: string | null
}

export interface MarkingKabel {
  id: number
  lokasi_id: number
  jenis_kabel: string | null
  panjang_meter: number | null
}

export interface FotoLampiran {
  id: number
  lokasi_id: number
  file_path: string
  label: string | null
  kategori: string | null
  urutan: number
}

export interface OpmRecord {
  id: number
  lokasi_id: number
  odp_name: string | null
  port_1: string | null
  port_2: string | null
  port_3: string | null
  port_4: string | null
  port_5: string | null
  port_6: string | null
  port_7: string | null
  port_8: string | null
  notes: string | null
}

export interface OtdrFile {
  id: number
  lokasi_id: number
  odp_name: string | null
  file_path: string
}

export interface GenerateLog {
  id: number
  lokasi_id: number
  generated_by: string | null
  generated_at: string | null
  file_path: string | null
  versi: number | null
  created_at: string
}

export interface Lokasi {
  id: number
  code: string
  name: string
  branch_id: number | null
  status: string
  created_at: string
  updated_at: string
  branch?: Branch | null
  project?: Project | null
  commissioningTest?: CommissioningTest | null
  boqItems?: BoqItem[]
  markingKabel?: MarkingKabel[]
  fotoLampiran?: FotoLampiran[]
  opmRecords?: OpmRecord[]
  otdrFiles?: OtdrFile[]
  generateLogs?: GenerateLog[]
}
