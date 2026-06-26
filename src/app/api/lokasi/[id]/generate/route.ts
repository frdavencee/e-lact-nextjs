import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, WidthType, BorderStyle, ShadingType,
} from 'docx'

const fmt = (date: any) => {
  if (!date) return '-'
  try { return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }
  catch { return '-' }
}

const infoRow = (label: string, value: string) =>
  new Paragraph({
    children: [
      new TextRun({ text: label.padEnd(22), bold: true }),
      new TextRun({ text: ': ' }),
      new TextRun({ text: value }),
    ],
    spacing: { after: 60 },
  })

const sectionTitle = (text: string) =>
  new Paragraph({
    children: [new TextRun({ text, bold: true, size: 26 })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 300, after: 200 },
    border: { bottom: { color: '000000', size: 6, style: BorderStyle.SINGLE } },
  })

const cell = (text: string, opts?: { bold?: boolean; center?: boolean; shade?: boolean }) =>
  new TableCell({
    children: [new Paragraph({
      children: [new TextRun({ text, bold: opts?.bold })],
      alignment: opts?.center ? AlignmentType.CENTER : AlignmentType.LEFT,
    })],
    shading: opts?.shade ? { fill: 'F0F0F0', type: ShadingType.CLEAR, color: 'auto' } : undefined,
  })

const makeBoqTable = (items: any[]) =>
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        tableHeader: true,
        children: ['No', 'Kode Item', 'Nama Item', 'Satuan', 'DRM', 'Aktual', 'Tambah', 'Kurang']
          .map(h => cell(h, { bold: true, center: true, shade: true })),
      }),
      ...items.map((item: any, i: number) =>
        new TableRow({ children: [
          cell(String(i + 1), { center: true }),
          cell(item.kode_item ?? '-'),
          cell(item.nama_item ?? '-'),
          cell(item.satuan ?? '-', { center: true }),
          cell(String(item.volume_drm ?? '-'), { center: true }),
          cell(String(item.volume_aktual ?? '-'), { center: true }),
          cell(String(item.volume_tambah ?? '-'), { center: true }),
          cell(String(item.volume_kurang ?? '-'), { center: true }),
        ]})
      ),
    ],
  })

const makeOpmTable = (records: any[]) =>
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        tableHeader: true,
        children: ['Nama ODP', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8']
          .map(h => cell(h, { bold: true, center: true, shade: true })),
      }),
      ...records.map((opm: any) =>
        new TableRow({ children: [
          cell(opm.odp_name ?? '-', { bold: true }),
          ...[opm.port_1, opm.port_2, opm.port_3, opm.port_4, opm.port_5, opm.port_6, opm.port_7, opm.port_8]
            .map(v => cell(v ?? '-', { center: true })),
        ]})
      ),
    ],
  })

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const lokasi = await prisma.lokasi.findUnique({
      where: { id: Number(id) },
      include: {
        branch: true,
        project: { include: { waspangRelation: true, branch: true } },
        commissioningTest: { include: { personel: true } },
        boqItems: true,
        markingKabel: true,
        opmRecords: true,
        otdrFiles: true,
      },
    })

    if (!lokasi) return NextResponse.json({ error: 'Lokasi tidak ditemukan.' }, { status: 404 })

    const project = lokasi.project
    const ct = lokasi.commissioningTest
    const branch = (project?.branch?.name ?? lokasi.branch?.name ?? '-').toUpperCase()
    const children: any[] = []

    // Cover
    children.push(
      new Paragraph({ text: 'LAPORAN COMMISSIONING TEST (LACT)', heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER, spacing: { after: 400 } }),
      infoRow('PROYEK', project?.name ?? '-'),
      infoRow('KONTRAK', project?.contract_number ?? '-'),
      infoRow('SURAT PESANAN', project?.purchase_order_number ?? '-'),
      infoRow('BRANCH', branch),
      infoRow('LOKASI', `${lokasi.name} [${lokasi.code}]`),
      infoRow('PELAKSANA', project?.implementer ?? '-'),
      new Paragraph({ children: [new TextRun({ text: '', break: 1 })], pageBreakBefore: true }),
    )

    // CT
    if (ct) {
      children.push(
        sectionTitle('LAPORAN COMMISIONING TEST'),
        infoRow('PROYEK', project?.name ?? '-'),
        infoRow('LOKASI', `${lokasi.name} [${lokasi.code}]`),
        new Paragraph({ spacing: { after: 120 } }),
        new Paragraph({ children: [new TextRun({ text: `Pada hari ini ${fmt(ct.tanggal)} yang bertanda tangan di bawah ini :` })], spacing: { after: 120 } }),
        infoRow('Nama', ct.personel?.nama ?? '-'),
        infoRow('NIK', ct.personel?.nik ?? '-'),
        infoRow('Jabatan', 'WASPANG PT. TELKOM AKSES'),
        new Paragraph({ spacing: { after: 120 } }),
        new Paragraph({ children: [new TextRun({ text: `Sehubungan dengan ${lokasi.name} [${lokasi.code}] menerangkan bahwa telah melaksanakan pemeriksaan kesisteman (Commisioning Test) dan fisik pada lokasi ${lokasi.name} [${lokasi.code}] sebagai berikut :` })], spacing: { after: 120 } }),
        new Paragraph({ children: [new TextRun({ text: `1.   Pelaksanaan pekerjaan ${ct.status_pekerjaan === 'telah' ? 'telah' : 'belum'} diselesaikan dengan spesifikasi teknis TELKOM` })], spacing: { after: 60 } }),
        new Paragraph({ children: [new TextRun({ text: `2.   Hasil pekerjaan ${ct.status_hasil === 'dapat' ? 'dapat' : 'tidak dapat'} diterima dan ${ct.status_kelayakan === 'layak' ? 'layak' : 'tidak layak'} untuk diajukan Uji Terima (UT)` })], spacing: { after: 200 } }),
        new Paragraph({ children: [new TextRun({ text: 'Demikian Laporan Commisioning Test dan Hasil Ukur ini dibuat dengan sebenarnya dan dapat dipertanggung jawabkan.' })], spacing: { after: 600 } }),
        new Paragraph({ children: [new TextRun({ text: `${branch}, ${ct.tanggal ? fmt(ct.tanggal) : fmt(new Date())}` })], alignment: AlignmentType.RIGHT }),
        new Paragraph({ children: [new TextRun({ text: 'WASPANG' })], alignment: AlignmentType.RIGHT }),
        new Paragraph({ children: [new TextRun({ text: project?.implementer ?? 'PT TELKOM AKSES' })], alignment: AlignmentType.RIGHT, spacing: { after: 600 } }),
        new Paragraph({ children: [new TextRun({ text: ct.personel?.nama ?? '', bold: true })], alignment: AlignmentType.RIGHT }),
        new Paragraph({ children: [new TextRun({ text: `NIK : ${ct.personel?.nik ?? ''}` })], alignment: AlignmentType.RIGHT }),
        new Paragraph({ children: [new TextRun({ text: '', break: 1 })], pageBreakBefore: true }),
      )
    }

    // BOQ
    if (lokasi.boqItems?.length > 0) {
      children.push(
        sectionTitle('LAPORAN BILL OF QUANTITY'),
        infoRow('PROYEK', project?.name ?? '-'),
        infoRow('LOKASI', `${lokasi.name} [${lokasi.code}]`),
        new Paragraph({ spacing: { after: 200 } }),
        makeBoqTable(lokasi.boqItems),
        new Paragraph({ children: [new TextRun({ text: '', break: 1 })], pageBreakBefore: true }),
      )
    }

    // OPM
    if (lokasi.opmRecords?.length > 0) {
      children.push(
        sectionTitle('LAMPIRAN EVIDENT HASIL UKUR OPM'),
        infoRow('PROYEK', project?.name ?? '-'),
        infoRow('LOKASI', `${lokasi.name} [${lokasi.code}]`),
        new Paragraph({ spacing: { after: 200 } }),
        makeOpmTable(lokasi.opmRecords),
      )
    }

    const doc = new Document({ sections: [{ children }] })
    const buffer = await Packer.toBuffer(doc)

    await prisma.generateLog.create({
      data: { lokasi_id: Number(id), generated_by: session.user?.email ?? null, generated_at: new Date(), versi: 1 },
    }).catch(() => {})

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="LACT_${lokasi.code}.docx"`,
      },
    })
  } catch (e: any) {
    console.error('DOCX generation error:', e)
    return NextResponse.json({ error: 'Gagal generate DOCX: ' + e.message }, { status: 500 })
  }
}
