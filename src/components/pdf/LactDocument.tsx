import React from 'react'
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

const s = StyleSheet.create({
  page: { fontFamily: 'Times-Roman', fontSize: 11, paddingTop: 40, paddingBottom: 40, paddingHorizontal: 50 },
  bold: { fontFamily: 'Times-Bold' },
  center: { textAlign: 'center' },
  mb4: { marginBottom: 4 },
  mb8: { marginBottom: 8 },
  mb16: { marginBottom: 16 },
  // Info table
  infoTable: { marginBottom: 12 },
  infoRow: { flexDirection: 'row', marginBottom: 3 },
  infoLabel: { width: 130, fontFamily: 'Times-Bold' },
  infoColon: { width: 12 },
  infoValue: { flex: 1 },
  // Section
  sectionTitle: { fontFamily: 'Times-Bold', fontSize: 14, textAlign: 'center', marginBottom: 12, paddingBottom: 4, borderBottom: '1pt solid #000' },
  // Signature
  sigRow: { flexDirection: 'row', marginTop: 20 },
  sigSpacer: { flex: 1 },
  sigBlock: { width: 200 },
  sigText: { textAlign: 'center', fontSize: 10 },
  sigBold: { fontFamily: 'Times-Bold', textAlign: 'center', fontSize: 10 },
  // BOQ table
  tableWrap: { borderTop: '0.5pt solid #000', borderLeft: '0.5pt solid #000', marginBottom: 12 },
  tableRow: { flexDirection: 'row' },
  th: { fontFamily: 'Times-Bold', fontSize: 9, padding: 4, borderRight: '0.5pt solid #000', borderBottom: '0.5pt solid #000', backgroundColor: '#f0f0f0' },
  td: { fontSize: 9, padding: 4, borderRight: '0.5pt solid #000', borderBottom: '0.5pt solid #000' },
  // Photo
  photoRow: { flexDirection: 'row', marginBottom: 6 },
  photoCell: { flex: 1, padding: 4, alignItems: 'center' },
  photoImg: { width: 155, height: 115 },
  photoCaption: { fontSize: 8, textAlign: 'center', marginTop: 3 },
})

const fmt = (date: any) => {
  if (!date) return '-'
  try { return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }
  catch { return '-' }
}

const toDataUrl = (filePath: string): string | null => {
  try {
    if (!existsSync(filePath)) return null
    const data = readFileSync(filePath)
    const ext = filePath.split('.').pop()?.toLowerCase() ?? 'jpg'
    const mime = ext === 'png' ? 'image/png' : ext === 'gif' ? 'image/gif' : 'image/jpeg'
    return `data:${mime};base64,${data.toString('base64')}`
  } catch { return null }
}

const imgPath = (fp: string) => toDataUrl(join(process.cwd(), 'public', fp))

const logoPath = () => {
  const base = process.env.LARAVEL_PATH ?? 'c:/xampp/htdocs/e-lact-telkom'
  for (const ext of ['png', 'jpg', 'jpeg']) {
    const result = toDataUrl(join(base, 'public', 'images', `logo.${ext}`))
    if (result) return result
  }
  return null
}

const InfoTable = ({ project, lokasi }: any) => (
  <View style={s.infoTable}>
    {([
      ['PROYEK', project?.name ?? '-'],
      ['KONTRAK', project?.contract_number ?? '-'],
      ['SURAT PESANAN', project?.purchase_order_number ?? '-'],
      ['BRANCH', (project?.branch?.name ?? lokasi.branch?.name ?? '-').toUpperCase()],
      ['LOKASI', `${lokasi.name} [${lokasi.code}]`],
      ['PELAKSANA', project?.implementer ?? '-'],
    ] as string[][]).map(([label, value]) => (
      <View key={label} style={s.infoRow}>
        <Text style={s.infoLabel}>{label}</Text>
        <Text style={s.infoColon}>:</Text>
        <Text style={s.infoValue}>{value}</Text>
      </View>
    ))}
  </View>
)

const Paraf = ({ lokasi }: any) => {
  const waspang = lokasi.project?.waspangRelation
  const ct = lokasi.commissioningTest
  const branch = (lokasi.project?.branch?.name ?? lokasi.branch?.name ?? 'SEMARANG').toUpperCase()
  const tgl = ct?.tanggal ? fmt(ct.tanggal) : fmt(new Date())
  const ctImg = ct?.images?.[0] ? imgPath(ct.images[0].file_path) : null
  return (
    <View style={s.sigRow}>
      <View style={s.sigSpacer} />
      <View style={s.sigBlock}>
        <Text style={s.sigBold}>{branch}, {tgl}</Text>
        <Text style={s.sigText}>WASPANG</Text>
        <Text style={s.sigText}>{lokasi.project?.implementer ?? 'PT TELKOM AKSES'}</Text>
        {ctImg
          ? <Image src={ctImg} style={{ width: 100, height: 50, marginVertical: 6, alignSelf: 'center' }} />
          : <View style={{ height: 40 }} />
        }
        {waspang && <>
          <Text style={s.sigBold}>{waspang.nama ?? waspang.name}</Text>
          <Text style={s.sigText}>NIK : {waspang.nik}</Text>
        </>}
      </View>
    </View>
  )
}

const CTSignature = ({ lokasi, ct }: any) => {
  const waspang = ct?.personel
  const branch = (lokasi.project?.branch?.name ?? lokasi.branch?.name ?? 'SEMARANG').toUpperCase()
  const tgl = ct?.tanggal ? fmt(ct.tanggal) : fmt(new Date())
  const ctImg = ct?.images?.[0] ? imgPath(ct.images[0].file_path) : null
  return (
    <View style={s.sigRow}>
      <View style={s.sigSpacer} />
      <View style={s.sigBlock}>
        <Text style={s.sigBold}>{branch}, {tgl}</Text>
        <Text style={s.sigText}>WASPANG</Text>
        <Text style={s.sigText}>{lokasi.project?.implementer ?? 'PT TELKOM AKSES'}</Text>
        {ctImg
          ? <Image src={ctImg} style={{ width: 100, height: 50, marginVertical: 6, alignSelf: 'center' }} />
          : <View style={{ height: 40 }} />
        }
        {waspang && <>
          <Text style={s.sigBold}>{waspang.nama ?? waspang.name}</Text>
          <Text style={s.sigText}>NIK : {waspang.nik}</Text>
        </>}
      </View>
    </View>
  )
}

const PhotoGrid = ({ photos }: { photos: any[] }) => {
  const rows: any[][] = []
  for (let i = 0; i < photos.length; i += 3) rows.push(photos.slice(i, i + 3))
  return (
    <View>
      {rows.map((row, ri) => (
        <View key={ri} style={s.photoRow}>
          {row.map((p: any) => {
            const src = imgPath(p.file_path)
            return (
              <View key={p.id} style={s.photoCell}>
                {src ? <Image src={src} style={s.photoImg} /> : <View style={[s.photoImg, { backgroundColor: '#eee' }]} />}
                {p.label && <Text style={s.photoCaption}>{p.label}</Text>}
              </View>
            )
          })}
          {Array.from({ length: 3 - row.length }).map((_, i) => <View key={i} style={s.photoCell} />)}
        </View>
      ))}
    </View>
  )
}

const FOTO_SECTIONS = [
  { label: 'LAMPIRAN EVIDENT PEKERJAAN', cats: ['evident_penarikan_kabel', 'evident_instalasi_aksesoris', 'evident_closure', 'evident_odp'] },
  { label: 'LAMPIRAN MARKING KABEL', cats: ['marking_kabel', 'laporan_boq'] },
  { label: 'LAMPIRAN EVIDENCE ODP', cats: ['odp_solid', 'pemasangan_odp'] },
  { label: 'LAMPIRAN EVIDENCE AKSESORIS', cats: ['aksesoris_hl', 'aksesoris_sc'] },
  { label: 'LAMPIRAN EVIDENCE CLOSURE & SPLITER 1:4', cats: ['closure_splitter'] },
  { label: 'LAMPIRAN EVIDENT HASIL UKUR OPM', cats: ['opm_hasil_ukur'] },
  { label: 'LAMPIRAN DATA PENGUKURAN OPM PROJECT OUTSIDE PLANT FIBER OPTIC', cats: ['data_pengukuran_opm'] },
  { label: 'LAMPIRAN MANCORE', cats: ['mancore'] },
  { label: 'LAMPIRAN EVIDENT AS BUILD DRAWING (ABD)', cats: ['as_build_drawing'] },
]

export function LactDocument({ lokasi }: { lokasi: any }) {
  const project = lokasi.project
  const ct = lokasi.commissioningTest
  const fotos = lokasi.fotoLampiran ?? []
  const logo = logoPath()

  const tocItems: string[] = []
  let no = 1
  if (ct) tocItems.push(`${no++}.   Laporan Commisioning Test`)
  if (lokasi.boqItems?.length > 0) tocItems.push(`${no++}.   Lampiran Bill Of Quantity`)
  if (lokasi.opmRecords?.length > 0 || lokasi.otdrFiles?.length > 0)
    tocItems.push(`${no++}.   Hasil Ukur OPM & OTDR (End To End Sesuai SOW)`)
  if (fotos.some((f: any) => f.kategori === 'mancore'))
    tocItems.push(`${no++}.   Lampiran Mancore`)
  tocItems.push(`${no++}.   Berita Acara Lapangan & Dokumen Pendukung Lainnya`)

  const otdrByOdp: Record<string, any[]> = {}
  ;(lokasi.otdrFiles ?? []).forEach((f: any) => {
    const k = f.odp_name ?? 'Lainnya'
    if (!otdrByOdp[k]) otdrByOdp[k] = []
    otdrByOdp[k].push(f)
  })

  return (
    <Document>
      {/* COVER */}
      <Page size="A4" style={s.page}>
        <Text style={[s.bold, s.center, { fontSize: 20, marginBottom: 24 }]}>LAPORAN  COMMISSIONING TEST (LACT)</Text>
        <InfoTable project={project} lokasi={lokasi} />
        {logo
          ? <View style={{ alignItems: 'center', marginVertical: 24 }}><Image src={logo} style={{ width: 280, height: 140 }} /></View>
          : <View style={{ height: 60 }} />
        }
        <View style={{ marginTop: 60, alignItems: 'center' }}>
          <Text style={[s.bold, s.center, s.mb8]}>ANTARA</Text>
          <Text style={[s.bold, s.center, s.mb8]}>{project?.pihak_pertama ?? 'PT. TELKOM INFRASTRUKTUR INDONESIA, Tbk.'}</Text>
          <Text style={[s.bold, s.center, s.mb8]}>DENGAN</Text>
          <Text style={[s.bold, s.center]}>{(project?.implementer ?? 'PT. TELKOM AKSES').toUpperCase()}</Text>
        </View>
      </Page>

      {/* DAFTAR ISI */}
      <Page size="A4" style={s.page}>
        <View style={{ paddingTop: 60, alignItems: 'center', marginBottom: 40 }}>
          <Text style={[s.bold, s.center, { fontSize: 16, marginBottom: 6 }]}>DAFTAR ISI</Text>
          <Text style={[s.bold, s.center, { fontSize: 13, marginBottom: 4 }]}>DOKUMEN LAPORAN COMMISIONING TEST</Text>
          <Text style={[s.bold, s.center, { fontSize: 13 }]}>(LACT)</Text>
        </View>
        <View style={{ marginTop: 20 }}>
          {tocItems.map((item, i) => <Text key={i} style={{ marginBottom: 10 }}>{item}</Text>)}
        </View>
      </Page>

      {/* CT */}
      {ct && (
        <Page size="A4" style={s.page}>
          <Text style={s.sectionTitle}>LAPORAN COMMISIONING TEST</Text>
          <InfoTable project={project} lokasi={lokasi} />
          <Text style={s.mb8}>Pada hari ini {fmt(ct.tanggal)} yang bertanda tangan di bawah ini :</Text>
          {[['Nama', ct.personel?.nama ?? '-'], ['NIK', ct.personel?.nik ?? '-'], ['Jabatan', 'WASPANG PT. TELKOM AKSES']].map(([l, v]) => (
            <View key={l} style={[s.infoRow, s.mb4]}>
              <Text style={[s.infoLabel, { width: 80 }]}>{l}</Text>
              <Text style={s.infoColon}>:</Text>
              <Text>{v}</Text>
            </View>
          ))}
          <Text style={[s.mb8, { marginTop: 6 }]}>Sehubungan dengan {lokasi.name} [{lokasi.code}] menerangkan bahwa telah melaksanakan pemeriksaan kesisteman (Commisioning Test) dan fisik pada lokasi {lokasi.name} [{lokasi.code}] sebagai berikut :</Text>
          <Text style={s.mb4}>1.   Pelaksanaan pekerjaan {ct.status_pekerjaan === 'telah' ? 'telah' : 'belum'} diselesaikan dengan spesifikasi teknis TELKOM</Text>
          <Text style={s.mb8}>2.   Hasil pekerjaan {ct.status_hasil === 'dapat' ? 'dapat' : 'tidak dapat'} diterima dan {ct.status_kelayakan === 'layak' ? 'layak' : 'tidak layak'} untuk diajukan Uji Terima (UT)</Text>
          <Text style={s.mb16}>Demikian Laporan Commisioning Test dan Hasil Ukur ini dibuat dengan sebenarnya dan dapat dipertanggung jawabkan.</Text>
          <CTSignature lokasi={lokasi} ct={ct} />
        </Page>
      )}

      {/* BOQ */}
      {lokasi.boqItems?.length > 0 && (
        <Page size="A4" style={s.page}>
          <Text style={s.sectionTitle}>LAPORAN BILL OF QUANTITY</Text>
          <InfoTable project={project} lokasi={lokasi} />
          <View style={s.tableWrap}>
            <View style={s.tableRow}>
              {([['No',0.4],['Kode Item',1.2],['Nama Item',2],['Satuan',0.8],['DRM',0.75],['Aktual',0.75],['Tambah',0.75],['Kurang',0.75],['Keterangan',2]] as [string,number][]).map(([h,f]) => (
                <Text key={h} style={[s.th, { flex: f }]}>{h}</Text>
              ))}
            </View>
            {lokasi.boqItems.map((item: any, i: number) => (
              <View key={item.id} style={s.tableRow}>
                <Text style={[s.td, { flex: 0.4 }]}>{i + 1}</Text>
                <Text style={[s.td, { flex: 1.2 }]}>{item.kode_item ?? '-'}</Text>
                <Text style={[s.td, { flex: 2 }]}>{item.nama_item ?? '-'}</Text>
                <Text style={[s.td, { flex: 0.8 }]}>{item.satuan ?? '-'}</Text>
                <Text style={[s.td, { flex: 0.75 }]}>{item.volume_drm ?? '-'}</Text>
                <Text style={[s.td, { flex: 0.75 }]}>{item.volume_aktual ?? '-'}</Text>
                <Text style={[s.td, { flex: 0.75 }]}>{item.volume_tambah ?? '-'}</Text>
                <Text style={[s.td, { flex: 0.75 }]}>{item.volume_kurang ?? '-'}</Text>
                <Text style={[s.td, { flex: 2 }]}>{item.keterangan ?? '-'}</Text>
              </View>
            ))}
          </View>
          <Paraf lokasi={lokasi} />
        </Page>
      )}

      {/* FOTO SECTIONS */}
      {FOTO_SECTIONS.flatMap(({ label, cats }) => {
        const photos = fotos.filter((f: any) => cats.includes(f.kategori))
        if (photos.length === 0) return []
        const chunks: any[][] = []
        for (let i = 0; i < photos.length; i += 6) chunks.push(photos.slice(i, i + 6))
        return chunks.map((chunk, ci) => (
          <Page key={`${label}-${ci}`} size="A4" style={s.page}>
            <Text style={s.sectionTitle}>{label}</Text>
            <InfoTable project={project} lokasi={lokasi} />
            <PhotoGrid photos={chunk} />
            <Paraf lokasi={lokasi} />
          </Page>
        ))
      })}

      {/* OPM */}
      {lokasi.opmRecords?.length > 0 && (
        <Page size="A4" style={s.page}>
          <Text style={s.sectionTitle}>LAMPIRAN EVIDENT HASIL UKUR OPM</Text>
          <InfoTable project={project} lokasi={lokasi} />
          {lokasi.opmRecords.map((opm: any) => (
            <View key={opm.id} style={[s.tableWrap, { marginBottom: 12 }]}>
              <View style={s.tableRow}>
                <Text style={[s.th, { width: 90 }]}>Nama ODP</Text>
                {['P1','P2','P3','P4','P5','P6','P7','P8'].map(p => (
                  <Text key={p} style={[s.th, { flex: 1 }]}>{p}</Text>
                ))}
              </View>
              <View style={s.tableRow}>
                <Text style={[s.td, s.bold, { width: 90 }]}>{opm.odp_name ?? '-'}</Text>
                {(['port_1','port_2','port_3','port_4','port_5','port_6','port_7','port_8'] as const).map(p => (
                  <Text key={p} style={[s.td, { flex: 1 }]}>{opm[p] ?? '-'}</Text>
                ))}
              </View>
            </View>
          ))}
          <Paraf lokasi={lokasi} />
        </Page>
      )}

      {/* OTDR */}
      {Object.entries(otdrByOdp).map(([odp, files]) => (
        <Page key={odp} size="A4" style={s.page}>
          <Text style={s.sectionTitle}>LAMPIRAN HASIL UKUR OTDR {odp.toUpperCase()}</Text>
          <InfoTable project={project} lokasi={lokasi} />
          {files.map((f: any) => {
            const src = imgPath(f.file_path)
            return src ? <Image key={f.id} src={src} style={{ width: 460, height: 280, marginBottom: 8 }} /> : null
          })}
          <Paraf lokasi={lokasi} />
        </Page>
      ))}
    </Document>
  )
}
