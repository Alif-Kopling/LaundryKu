import { useState, useMemo } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Plus,
  Search,
  Eye,
  ChevronRight,
} from "lucide-react"

const PRICE_PER_KG = 8000

const statusLabels = {
  received: "Diterima",
  processing: "Diproses",
  finished: "Selesai",
  picked_up: "Diambil",
}

const statusColors = {
  received: "secondary",
  processing: "default",
  finished: "outline",
  picked_up: "ghost",
}

const nextStatus = {
  received: "processing",
  processing: "finished",
  finished: "picked_up",
}

function getTransactions() {
  return JSON.parse(localStorage.getItem("transactions") || "[]")
}

function saveTransactions(transactions) {
  localStorage.setItem("transactions", JSON.stringify(transactions))
}

function getCustomers() {
  return JSON.parse(localStorage.getItem("customers") || "[]")
}

const emptyForm = {
  customerId: "",
  weight: "",
  notes: "",
}

export default function Transactions() {
  const [transactions, setTransactions] = useState(getTransactions)
  const [search, setSearch] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [detailId, setDetailId] = useState(null)

  const customers = useMemo(() => getCustomers(), [createOpen])

  const filtered = useMemo(() => {
    if (!search.trim()) return transactions
    const q = search.toLowerCase()
    return transactions.filter(
      (t) =>
        t.customerName?.toLowerCase().includes(q) ||
        t.invoice?.toLowerCase().includes(q)
    )
  }, [transactions, search])

  const selectedCustomer = customers.find(
    (c) => String(c.id) === form.customerId
  )

  const total = PRICE_PER_KG * (Number(form.weight) || 0)

  function handleCreate() {
    if (!form.customerId || !form.weight) {
      toast.error("Pilih pelanggan dan masukkan berat")
      return
    }

    const customer = customers.find(
      (c) => String(c.id) === form.customerId
    )
    if (!customer) {
      toast.error("Pelanggan tidak ditemukan")
      return
    }

    const count = getTransactions().length + 1
    const invoice = `LND-${String(count).padStart(4, "0")}`

    const transaction = {
      id: Date.now(),
      invoice,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      weight: Number(form.weight),
      pricePerKg: PRICE_PER_KG,
      total,
      status: "received",
      notes: form.notes || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const updated = [...getTransactions(), transaction]
    saveTransactions(updated)
    setTransactions(updated)
    setCreateOpen(false)
    setForm(emptyForm)
    toast.success(`Transaksi ${invoice} berhasil dibuat`)
  }

  function handleUpdateStatus(id) {
    const updated = getTransactions().map((t) => {
      if (t.id !== id) return t
      const next = nextStatus[t.status]
      if (!next) return t
      return { ...t, status: next, updatedAt: new Date().toISOString() }
    })
    saveTransactions(updated)
    setTransactions(updated)
  }

  const detail = transactions.find((t) => t.id === detailId) || null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Transaksi</h1>
          <p className="text-muted-foreground mt-1">
            Kelola transaksi laundry
          </p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Transaksi Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Transaksi Baru</DialogTitle>
              <DialogDescription>
                Buat transaksi laundry baru
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Pelanggan</label>
                <Select
                  value={form.customerId}
                  onValueChange={(v) =>
                    setForm({ ...form, customerId: v })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih pelanggan" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.length === 0 ? (
                      <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                        Belum ada pelanggan. Tambah pelanggan dulu.
                      </div>
                    ) : (
                      customers.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.name} - {c.phone}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {selectedCustomer && (
                <div className="text-sm text-muted-foreground bg-muted rounded-lg px-3 py-2">
                  {selectedCustomer.name} — {selectedCustomer.phone}
                  {selectedCustomer.address && (
                    <>
                      <br />
                      {selectedCustomer.address}
                    </>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Berat (Kg)
                </label>
                <Input
                  type="number"
                  min="0"
                  step="0.5"
                  value={form.weight}
                  onChange={(e) =>
                    setForm({ ...form, weight: e.target.value })
                  }
                  placeholder="0"
                />
              </div>

              <div className="flex items-center justify-between text-sm bg-muted rounded-lg px-3 py-2">
                <span className="text-muted-foreground">
                  Rp {PRICE_PER_KG.toLocaleString()} / Kg
                </span>
                <Separator orientation="vertical" className="h-5" />
                <span className="font-semibold">
                  Total: Rp {total.toLocaleString()}
                </span>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Catatan</label>
                <Input
                  value={form.notes}
                  onChange={(e) =>
                    setForm({ ...form, notes: e.target.value })
                  }
                  placeholder="Catatan (opsional)"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Batal</Button>
              </DialogClose>
              <Button onClick={handleCreate}>Buat Transaksi</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Cari invoice atau nama..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Pelanggan</TableHead>
              <TableHead>Berat</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground py-8"
                >
                  {search
                    ? "Transaksi tidak ditemukan"
                    : "Belum ada transaksi"}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-mono text-xs font-medium">
                    {t.invoice}
                  </TableCell>
                  <TableCell className="font-medium">
                    {t.customerName}
                  </TableCell>
                  <TableCell>{t.weight} Kg</TableCell>
                  <TableCell>
                    Rp {t.total.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        statusColors[t.status] || "secondary"
                      }
                    >
                      {statusLabels[t.status] || t.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDetailId(t.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {nextStatus[t.status] && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus(t.id)}
                        >
                          {statusLabels[nextStatus[t.status]]}
                          <ChevronRight className="w-3 h-3 ml-1" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={!!detailId}
        onOpenChange={(open) => !open && setDetailId(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detail Transaksi</DialogTitle>
            <DialogDescription>
              Informasi lengkap transaksi
            </DialogDescription>
          </DialogHeader>
          {detail && (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Invoice</span>
                <span className="font-mono font-medium">
                  {detail.invoice}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pelanggan</span>
                <span className="font-medium">
                  {detail.customerName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Telepon</span>
                <span>{detail.customerPhone}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Berat</span>
                <span>{detail.weight} Kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Harga/Kg</span>
                <span>
                  Rp {detail.pricePerKg.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total</span>
                <span className="font-semibold">
                  Rp {detail.total.toLocaleString()}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge
                  variant={statusColors[detail.status] || "secondary"}
                >
                  {statusLabels[detail.status] || detail.status}
                </Badge>
              </div>
              {detail.notes && (
                <>
                  <Separator />
                  <div>
                    <span className="text-muted-foreground text-sm">
                      Catatan
                    </span>
                    <p className="mt-1 text-sm">{detail.notes}</p>
                  </div>
                </>
              )}
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Dibuat</span>
                <span>
                  {new Date(detail.createdAt).toLocaleDateString(
                    "id-ID",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Diperbarui
                </span>
                <span>
                  {new Date(detail.updatedAt).toLocaleDateString(
                    "id-ID",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </span>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Tutup</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
