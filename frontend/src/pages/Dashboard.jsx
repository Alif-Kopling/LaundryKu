import { useMemo, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Users, ClipboardList, CheckCircle, Clock, Eye } from "lucide-react"

const statusLabels = {
  received: "Diterima",
  processing: "Diproses",
  finished: "Selesai",
  picked_up: "Diambil",
}

const statusVariants = {
  received: "secondary",
  processing: "default",
  finished: "outline",
  picked_up: "ghost",
}

function getStats() {
  const customers = JSON.parse(localStorage.getItem("customers") || "[]")
  const transactions = JSON.parse(
    localStorage.getItem("transactions") || "[]"
  )

  const activeTransactions = transactions.filter(
    (t) => t.status !== "picked_up"
  )
  const completedToday = transactions.filter((t) => {
    if (t.status !== "picked_up") return false
    const today = new Date().toDateString()
    const updated = new Date(t.updatedAt).toDateString()
    return today === updated
  })
  const pendingPickup = transactions.filter(
    (t) => t.status === "finished"
  )

  return {
    totalCustomers: customers.length,
    activeTransactions: activeTransactions.length,
    completedToday: completedToday.length,
    pendingPickup: pendingPickup.length,
  }
}

export default function Dashboard() {
  const stats = useMemo(() => getStats(), [])
  const [detail, setDetail] = useState(null)

  const transactions = useMemo(() => {
    const data = JSON.parse(localStorage.getItem("transactions") || "[]")
    return data
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
.slice(0, 7)
  }, [])

  const cards = [
    {
      title: "Total Pelanggan",
      value: stats.totalCustomers,
      icon: Users,
      color: "text-chart-1",
      bg: "bg-chart-1/10",
    },
    {
      title: "Transaksi Aktif",
      value: stats.activeTransactions,
      icon: ClipboardList,
      color: "text-chart-2",
      bg: "bg-chart-2/10",
    },
    {
      title: "Selesai Hari Ini",
      value: stats.completedToday,
      icon: CheckCircle,
      color: "text-chart-3",
      bg: "bg-chart-3/10",
    },
    {
      title: "Menunggu Diambil",
      value: stats.pendingPickup,
      icon: Clock,
      color: "text-chart-4",
      bg: "bg-chart-4/10",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Ringkasan aktivitas LaundryKu
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <div className={`${card.bg} p-2 rounded-lg`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{card.value}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Transaksi Terbaru</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
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
                  <TableHead className="text-right">Detail</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      Belum ada transaksi
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-mono text-xs font-medium">{t.invoice}</TableCell>
                      <TableCell className="font-medium">{t.customerName}</TableCell>
                      <TableCell>{t.weight} Kg</TableCell>
                      <TableCell>Rp {t.total.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariants[t.status] || "secondary"}>
                          {statusLabels[t.status] || t.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(t.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon-sm" onClick={() => setDetail(t)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detail Transaksi</DialogTitle>
            <DialogDescription>
              Informasi lengkap transaksi {detail?.invoice}
            </DialogDescription>
          </DialogHeader>
          {detail && (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Invoice</span>
                <span className="font-mono font-medium">{detail.invoice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pelanggan</span>
                <span className="font-medium">{detail.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Telepon</span>
                <span>{detail.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Berat</span>
                <span>{detail.weight} Kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Harga/Kg</span>
                <span>Rp {detail.pricePerKg.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total</span>
                <span className="font-semibold">Rp {detail.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={statusVariants[detail.status] || "secondary"}>
                  {statusLabels[detail.status] || detail.status}
                </Badge>
              </div>
              {detail.notes && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Catatan</span>
                  <span>{detail.notes}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dibuat</span>
                <span>{new Date(detail.createdAt).toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Diperbarui</span>
                <span>{new Date(detail.updatedAt).toLocaleString("id-ID")}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
