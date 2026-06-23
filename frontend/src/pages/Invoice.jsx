import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Printer, ArrowLeft, Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import api from "@/services/api"
import { toast } from "sonner"

const statusMap = {
  received: { label: "Diterima", variant: "secondary" },
  processing: { label: "Diproses", variant: "warning" },
  finished: { label: "Selesai", variant: "default" },
  picked_up: { label: "Diambil", variant: "outline" },
}

export default function Invoice() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [invoice, setInvoice] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchInvoice = async () => {
    if (!id) {
      setLoading(false)
      return
    }
    try {
      const { data } = await api.get(`/transactions/${id}/invoice`)
      setInvoice(data)
    } catch {
      toast.error("Gagal memuat nota")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInvoice()
  }, [id])

  const handlePrint = () => window.print()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!id) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold mb-2">Nota Laundry</h1>
        <p className="text-muted-foreground">
          Pilih transaksi untuk melihat nota
        </p>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Nota tidak ditemukan</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/transactions")}>
          Kembali
        </Button>
      </div>
    )
  }

  const st = statusMap[invoice.status] || { label: invoice.status, variant: "secondary" }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between print:hidden">
        <Button variant="ghost" onClick={() => navigate("/transactions")}>
          <ArrowLeft className="size-4 mr-2" />
          Kembali
        </Button>
        <Button onClick={handlePrint}>
          <Printer className="size-4 mr-2" />
          Cetak Nota
        </Button>
      </div>

      <Card>
        <CardHeader className="text-center border-b">
          <CardTitle className="text-2xl">NOTA LAUNDRY</CardTitle>
          <p className="text-sm text-muted-foreground">
            Laundry App - Solusi Cucian Anda
          </p>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Pelanggan</p>
              <p className="font-medium">{invoice.customer?.name || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Telepon</p>
              <p className="font-medium">{invoice.customer?.phone || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tanggal</p>
              <p className="font-medium">
                {invoice.created_at
                  ? new Date(invoice.created_at).toLocaleDateString("id-ID")
                  : "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={st.variant}>{st.label}</Badge>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Berat</p>
              <p className="font-medium">{invoice.weight} kg</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Layanan</p>
              <p className="font-medium capitalize">{invoice.service_type}</p>
            </div>
          </div>

          {invoice.notes && (
            <div>
              <p className="text-sm text-muted-foreground">Catatan</p>
              <p>{invoice.notes}</p>
            </div>
          )}

          <Separator />

          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">Total Pembayaran</p>
            <p className="text-2xl font-bold text-primary">
              Rp {Number(invoice.total_price || 0).toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}