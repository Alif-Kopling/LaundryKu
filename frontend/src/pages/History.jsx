import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Search, Eye, X, Calendar } from "lucide-react"

const statusLabels = {
  received: "Diterima",
  processing: "Diproses",
  finished: "Selesai",
  picked_up: "Diambil",
}

function getTransactions() {
  return JSON.parse(localStorage.getItem("transactions") || "[]")
}

export default function History() {
  const [transactions] = useState(getTransactions)
  const [search, setSearch] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [detailId, setDetailId] = useState(null)

  const filtered = useMemo(() => {
    let result = [...transactions]

    result.sort(
      (a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    )

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (t) =>
          t.invoice?.toLowerCase().includes(q) ||
          t.customerName?.toLowerCase().includes(q)
      )
    }

    if (startDate) {
      const start = new Date(startDate)
      start.setHours(0, 0, 0, 0)
      result = result.filter(
        (t) => new Date(t.createdAt) >= start
      )
    }

    if (endDate) {
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999)
      result = result.filter(
        (t) => new Date(t.createdAt) <= end
      )
    }

    return result
  }, [transactions, search, startDate, endDate])

  const detail = transactions.find((t) => t.id === detailId) || null

  const hasFilters = search || startDate || endDate

  function clearFilters() {
    setSearch("")
    setStartDate("")
    setEndDate("")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Riwayat Transaksi</h1>
        <p className="text-muted-foreground mt-1">
          Lihat riwayat semua transaksi laundry
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cari invoice atau nama..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="date"
              className="pl-9 w-40"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <span className="text-muted-foreground text-sm">s/d</span>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="date"
              className="pl-9 w-40"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
            >
              <X className="w-4 h-4 mr-1" />
              Reset
            </Button>
          )}
        </div>
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
              <TableHead>Tanggal</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground py-8"
                >
                  {hasFilters
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
                    <Badge variant="outline">
                      {statusLabels[t.status] || t.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(t.createdAt).toLocaleDateString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setDetailId(t.id)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
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
                <span className="text-muted-foreground">
                  Harga/Kg
                </span>
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
                <Badge variant="outline">
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
