import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, ShoppingCart, Shirt, DollarSign } from "lucide-react"

const stats = [
  { title: "Total Pelanggan", value: "0", icon: Users, color: "text-blue-600" },
  { title: "Transaksi Hari Ini", value: "0", icon: ShoppingCart, color: "text-green-600" },
  { title: "Cucian Diproses", value: "0", icon: Shirt, color: "text-orange-600" },
  { title: "Pendapatan Hari Ini", value: "Rp 0", icon: DollarSign, color: "text-purple-600" },
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview laundry hari ini</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`size-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}