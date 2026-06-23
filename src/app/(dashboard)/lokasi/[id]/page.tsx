'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { FileText, Download, ChevronDown, ChevronUp } from 'lucide-react'
import InfoProyekSection from '@/components/lokasi/InfoProyekSection'
import CommissioningTestSection from '@/components/lokasi/CommissioningTestSection'
import BoqSection from '@/components/lokasi/BoqSection'
import MarkingKabelSection from '@/components/lokasi/MarkingKabelSection'
import OpmSection from '@/components/lokasi/OpmSection'
import OtdrSection from '@/components/lokasi/OtdrSection'
import FotoUploadBox from '@/components/lokasi/FotoUploadBox'

const FOTO_SECTIONS = [
  {
    key: 'evident_pekerjaan',
    label: 'Lampiran Evident Pekerjaan',
    categories: [
      { value: 'evident_penarikan_kabel', label: 'Penarikan Kabel' },
      { value: 'evident_instalasi_aksesoris', label: 'Instalasi Aksesoris' },
      { value: 'evident_closure', label: 'Closure' },
      { value: 'evident_odp', label: 'ODP' },
    ],
  },
  {
    key: 'evidence_odp',
    label: 'Lampiran Evidence ODP',
    categories: [
      { value: 'odp_solid', label: 'ODP Solid' },
      { value: 'pemasangan_odp', label: 'Pemasangan ODP' },
    ],
  },
  {
    key: 'evidence_aksesoris',
    label: 'Lampiran Evidence Aksesoris',
    categories: [
      { value: 'aksesoris_hl', label: 'Aksesoris HL' },
      { value: 'aksesoris_sc', label: 'Aksesoris SC' },
    ],
  },
  {
    key: 'evidence_closure',
    label: 'Lampiran Evidence Closure & Spliter 1:4',
    categories: [
      { value: 'closure_splitter', label: 'Closure & Splitter' },
    ],
  },
  {
    key: 'opm_foto',
    label: 'Lampiran Evident Hasil Ukur OPM',
    categories: [
      { value: 'opm_hasil_ukur', label: 'Hasil Ukur OPM' },
    ],
  },
  {
    key: 'mancore',
    label: 'Lampiran Mancore',
    categories: [
      { value: 'mancore', label: 'Mancore' },
    ],
  },
  {
    key: 'abd',
    label: 'Lampiran Evident As Build Drawing (ABD)',
    categories: [
      { value: 'as_build_drawing', label: 'As Build Drawing' },
    ],
  },
]

export default function LokasiDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [lokasi, setLokasi] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [openSection, setOpenSection] = useState<string | null>('info')

  useEffect(() => { fetchLokasi() }, [id])

  const fetchLokasi = async () => {
    setLoading(true)
    const res = await fetch(`/api/lokasi/${id}`)
    if (res.ok) setLokasi(await res.json())
    setLoading(false)
  }

  const handleGenerate = async () => {
    setGenerating(true)
    const res = await fetch(`/api/lokasi/${id}/generate`)
    if (res.ok) {
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `LACT_${lokasi?.code}.docx`
      a.click()
      window.URL.revokeObjectURL(url)
      fetchLokasi()
    } else {
      const err = await res.json()
      alert(err.error || 'Gagal generate dokumen')
    }
    setGenerating(false)
  }

  const toggleSection = (section: string) =>
    setOpenSection(prev => (prev === section ? null : section))

  const badgeColor: Record<string, string> = {
    belum: 'bg-gray-100 text-gray-600',
    draft: 'bg-yellow-100 text-yellow-700',
    siap: 'bg-blue-100 text-blue-700',
    generated: 'bg-green-100 text-green-700',
  }

  const staticSections = [
    { key: 'info', label: 'Info Proyek' },
    { key: 'ct', label: 'Commissioning Test' },
    { key: 'boq', label: 'Bill of Quantity (BOQ)' },
    { key: 'marking', label: 'Marking Kabel' },
    ...FOTO_SECTIONS.map(s => ({ key: s.key, label: s.label })),
    { key: 'opm', label: 'Data OPM' },
    { key: 'otdr', label: 'File OTDR' },
  ]

  if (loading) return <div className="p-8 text-center text-gray-400 text-sm">Memuat data...</div>
  if (!lokasi) return <div className="p-8 text-center text-red-500 text-sm">Lokasi tidak ditemukan.</div>

  const fotoLampiran = lokasi.fotoLampiran ?? []

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{lokasi.name}</h2>
          <p className="text-sm text-gray-500 font-mono mt-1">{lokasi.code}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badgeColor[lokasi.status] ?? badgeColor.belum}`}>
            {lokasi.status}
          </span>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition disabled:opacity-50"
          >
            {generating
              ? <><FileText size={16} className="animate-spin" /> Generating...</>
              : <><Download size={16} /> Generate DOCX</>}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {staticSections.map(({ key, label }) => {
          const fotoSection = FOTO_SECTIONS.find(s => s.key === key)
          return (
            <div key={key} className="bg-white rounded-xl shadow overflow-hidden">
              <button
                onClick={() => toggleSection(key)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition"
              >
                <span className="font-semibold text-gray-700 text-sm">{label}</span>
                {openSection === key
                  ? <ChevronUp size={16} className="text-gray-400" />
                  : <ChevronDown size={16} className="text-gray-400" />}
              </button>
              {openSection === key && (
                <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                  {key === 'info' && <InfoProyekSection lokasi={lokasi} onSaved={fetchLokasi} />}
                  {key === 'ct' && <CommissioningTestSection lokasi={lokasi} onSaved={fetchLokasi} />}
                  {key === 'boq' && <BoqSection lokasi={lokasi} onSaved={fetchLokasi} />}
                  {key === 'marking' && <MarkingKabelSection lokasi={lokasi} onSaved={fetchLokasi} />}
                  {key === 'opm' && <OpmSection lokasi={lokasi} onSaved={fetchLokasi} />}
                  {key === 'otdr' && <OtdrSection lokasi={lokasi} onSaved={fetchLokasi} />}
                  {fotoSection && (
                    <FotoUploadBox
                      lokasiId={lokasi.id}
                      categories={fotoSection.categories}
                      fotos={fotoLampiran.filter((f: any) =>
                        fotoSection.categories.some(c => c.value === f.kategori)
                      )}
                      onSaved={fetchLokasi}
                    />
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
