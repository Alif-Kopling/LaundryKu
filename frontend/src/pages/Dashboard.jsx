import { useMemo } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Users, ClipboardList, CheckCircle, Clock } from "lucide-react"

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

  const cards = [
    {
      title: "Total Pelanggan",
      value: stats.totalCustomers,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Transaksi Aktif",
      value: stats.activeTransactions,
      icon: ClipboardList,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      title: "Selesai Hari Ini",
      value: stats.completedToday,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Menunggu Diambil",
      value: stats.pendingPickup,
      icon: Clock,
      color: "text-purple-600",
      bg: "bg-purple-100",
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
    </div>
  )
}
