import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, Loader2 } from "lucide-react"
import api from "@/services/api"

const statusMap = {
  received: { label: "Diterima", variant: "secondary" },
  processing: { label: "Diproses", variant: "warning" },
  finished: { label: "Selesai", variant: "default" },
  picked_up: { label: "Diambil", variant: "outline" },
}

export default function History() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [dateFilter, setDateFilter] = useState("")

  const fetchHistory = async () => {
    try {
      const params = {}
      if (search) params.search = search
      if (dateFilter) params.date = dateFilter
      const { data } = await api.get("/history", { params })
      setHistory(data)
    } catch {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [search, dateFilter])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Riwayat Transaksi</h1>
        <p className="text-muted-foreground">Riwayat transaksi laundry</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Cari pelanggan..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Input
          type="date"
          className="w-full sm:w-48"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Pelanggan</TableHead>
              <TableHead>Berat</TableHead>
              <TableHead>Layanan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Belum ada riwayat transaksi
                </TableCell>
              </TableRow>
            ) : (
              history.map((h) => {
                const st = statusMap[h.status] || { label: h.status, variant: "secondary" }
                return (
                  <TableRow key={h.id}>
                    <TableCell>
                      {h.created_at
                        ? new Date(h.created_at).toLocaleDateString("id-ID")
                        : "-"}
                    </TableCell>
                    <TableCell className="font-medium">{h.customer_name || "-"}</TableCell>
                    <TableCell>{h.weight} kg</TableCell>
                    <TableCell className="capitalize">{h.service_type}</TableCell>
                    <TableCell>
                      <Badge variant={st.variant}>{st.label}</Badge>
                    </TableCell>
                    <TableCell>
                      Rp {Number(h.total_price || 0).toLocaleString()}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}