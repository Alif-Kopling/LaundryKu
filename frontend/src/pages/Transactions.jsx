import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Eye, Loader2 } from "lucide-react"
import api from "@/services/api"
import { toast } from "sonner"

const statusMap = {
  received: { label: "Diterima", variant: "secondary" },
  processing: { label: "Diproses", variant: "warning" },
  finished: { label: "Selesai", variant: "default" },
  picked_up: { label: "Diambil", variant: "outline" },
}

export default function Transactions() {
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState([])
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({
    customer_id: "",
    weight: "",
    service_type: "regular",
    notes: "",
  })

  const fetchTransactions = async () => {
    try {
      const { data } = await api.get("/transactions")
      setTransactions(data)
    } catch {
      toast.error("Gagal memuat transaksi")
    } finally {
      setLoading(false)
    }
  }

  const fetchCustomers = async () => {
    try {
      const { data } = await api.get("/customers")
      setCustomers(data)
    } catch {}
  }

  useEffect(() => {
    fetchTransactions()
    fetchCustomers()
  }, [])

  const openCreate = () => {
    setForm({ customer_id: "", weight: "", service_type: "regular", notes: "" })
    setOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post("/transactions", form)
      toast.success("Transaksi berhasil dibuat")
      setOpen(false)
      fetchTransactions()
    } catch {
      toast.error("Gagal membuat transaksi")
    }
  }

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.patch(`/transactions/${id}/status`, { status })
      toast.success("Status berhasil diupdate")
      fetchTransactions()
    } catch {
      toast.error("Gagal update status")
    }
  }

  const viewDetail = async (id) => {
    try {
      const { data } = await api.get(`/transactions/${id}/invoice`)
      setSelected(data)
      setDetailOpen(true)
    } catch {
      toast.error("Gagal memuat detail")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const nextStatus = (current) => {
    const flow = ["received", "processing", "finished", "picked_up"]
    const idx = flow.indexOf(current)
    return idx < flow.length - 1 ? flow[idx + 1] : null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Transaksi</h1>
          <p className="text-muted-foreground">Kelola transaksi laundry</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4 mr-2" />
          Transaksi Baru
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pelanggan</TableHead>
              <TableHead>Berat (kg)</TableHead>
              <TableHead>Layanan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="w-32">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Belum ada transaksi
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((t) => {
                const st = statusMap[t.status] || { label: t.status, variant: "secondary" }
                const next = nextStatus(t.status)
                return (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.customer_name || "-"}</TableCell>
                    <TableCell>{t.weight} kg</TableCell>
                    <TableCell className="capitalize">{t.service_type}</TableCell>
                    <TableCell>
                      <Badge variant={st.variant}>{st.label}</Badge>
                    </TableCell>
                    <TableCell>
                      {t.total_price
                        ? `Rp ${Number(t.total_price).toLocaleString()}`
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => viewDetail(t.id)}>
                          <Eye className="size-4" />
                        </Button>
                        {next && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusUpdate(t.id, next)}
                          >
                            {statusMap[next]?.label || next}
                          </Button>
                        )}
                        {t.status === "finished" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/transactions/${t.id}/invoice`)}
                          >
                            Nota
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transaksi Baru</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Pelanggan</label>
              <Select
                value={form.customer_id}
                onValueChange={(v) => setForm({ ...form, customer_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih pelanggan" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Berat (kg)</label>
              <Input
                type="number"
                step="0.1"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Layanan</label>
              <Select
                value={form.service_type}
                onValueChange={(v) => setForm({ ...form, service_type: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="express">Express</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Catatan</label>
              <Input
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full">
              Buat Transaksi
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detail Transaksi</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Pelanggan</p>
                <p className="font-medium">{selected.customer?.name || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Berat</p>
                <p className="font-medium">{selected.weight} kg</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Layanan</p>
                <p className="font-medium capitalize">{selected.service_type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={statusMap[selected.status]?.variant}>
                  {statusMap[selected.status]?.label || selected.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="font-bold text-lg">
                  Rp {Number(selected.total_price || 0).toLocaleString()}
                </p>
              </div>
              {selected.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Catatan</p>
                  <p>{selected.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}