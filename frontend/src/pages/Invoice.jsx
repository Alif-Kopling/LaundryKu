import { useState, useEffect, useMemo } from "react"
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
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Printer, Search, FileText, Shirt } from "lucide-react"
import * as transactionService from "@/services/transactionService"

const statusLabels = {
  received: "Diterima",
  processing: "Diproses",
  finished: "Selesai",
  picked_up: "Diambil",
}

function mapTransaction(t) {
  return {
    id: t.id,
    invoice: t.invoice_number,
    customerName: t.customer_name,
    customerPhone: t.customer_phone,
    weight: Number(t.weight),
    pricePerKg: Number(t.price_per_kg),
    total: Number(t.total_price),
    status: t.status,
    notes: t.notes,
    createdAt: t.created_at,
    updatedAt: t.updated_at,
  }
}

export default function Invoice() {
  const [transactions, setTransactions] = useState([])
  const [search, setSearch] = useState("")
  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => {
    transactionService.getTransactions()
      .then((data) => setTransactions(data.map(mapTransaction)))
      .catch(() => {})
  }, [])

  const filtered = useMemo(() => {
    if (!search.trim()) return transactions
    const q = search.toLowerCase()
    return transactions.filter(
      (t) =>
        t.invoice?.toLowerCase().includes(q) ||
        t.customerName?.toLowerCase().includes(q)
    )
  }, [transactions, search])

  const selected = transactions.find((t) => t.id === selectedId) || null

  function handlePrint() {
    window.print()
  }

  return (
    <>
      <div className="space-y-6 print:hidden">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Invoice</h1>
            <p className="text-muted-foreground mt-1">
              Cetak invoice transaksi
            </p>
          </div>
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
                  <TableRow
                    key={t.id}
                    className={
                      selectedId === t.id ? "bg-muted/50" : ""
                    }
                  >
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
                    <TableCell className="text-right">
                      <Button
                        variant={
                          selectedId === t.id ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          setSelectedId(
                            selectedId === t.id ? null : t.id
                          )
                        }
                      >
                        <FileText className="w-4 h-4 mr-1.5" />
                        {selectedId === t.id
                          ? "Tutup"
                          : "Invoice"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {selected && (
          <div className="rounded-lg border bg-card">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold">
                Invoice {selected.invoice}
              </h2>
              <Button onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Cetak
              </Button>
            </div>
            <div className="p-6">
              <InvoiceContent transaction={selected} />
            </div>
          </div>
        )}
      </div>

      {selected && (
        <div className="hidden print:block">
          <InvoiceContent transaction={selected} />
        </div>
      )}
    </>
  )
}

function InvoiceContent({ transaction: t }) {
  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center border-b pb-4">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Shirt className="w-5 h-5" />
          <span className="font-bold text-lg">LaundryKu</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Jasa Laundry & Cuci Kering
        </p>
        <p className="text-xs text-muted-foreground">
          Jl. Laundry No. 123, Telp: 0812-3456-7890
        </p>
      </div>

      <div className="text-center">
        <h2 className="font-bold text-lg">INVOICE</h2>
        <p className="font-mono text-sm">{t.invoice}</p>
      </div>

      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tanggal</span>
          <span>
            {new Date(t.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
        <Separator />
        <div className="flex justify-between">
          <span className="text-muted-foreground">Pelanggan</span>
          <span className="font-medium">{t.customerName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Telepon</span>
          <span>{t.customerPhone}</span>
        </div>
      </div>

      <Separator />

      <div>
        <div className="flex justify-between text-sm font-medium border-b pb-2 mb-2">
          <span>Layanan</span>
          <span>Subtotal</span>
        </div>
        <div className="flex justify-between text-sm py-1">
          <span>
            Laundry Cuci Kering ({t.weight} Kg x Rp{" "}
            {t.pricePerKg.toLocaleString()})
          </span>
          <span>Rp {t.total.toLocaleString()}</span>
        </div>
      </div>

      <Separator />

      <div className="flex justify-between text-lg font-bold">
        <span>Total</span>
        <span>Rp {t.total.toLocaleString()}</span>
      </div>

      <Separator />

      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Status</span>
          <Badge variant="outline">
            {statusLabels[t.status] || t.status}
          </Badge>
        </div>
        {t.notes && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Catatan</span>
            <span>{t.notes}</span>
          </div>
        )}
      </div>

      <div className="text-center text-xs text-muted-foreground border-t pt-4 mt-8">
        <p>Terima kasih telah menggunakan jasa LaundryKu</p>
        <p className="mt-1">Barang yang sudah diambil tidak dapat diklaim kembali</p>
      </div>
    </div>
  )
}
