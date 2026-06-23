import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function Invoice() {
  const { id } = useParams()
  const navigate = useNavigate()

  if (!id) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">Nota Laundry</h1>
        <p className="text-muted-foreground">
          Pilih transaksi untuk melihat nota
        </p>
      </div>
    )
  }

  return (
    <div className="text-center py-20">
      <h1 className="text-2xl font-bold">Nota Transaksi #{id}</h1>
      <p className="text-muted-foreground">Coming soon...</p>
      <Button variant="outline" className="mt-4" onClick={() => navigate("/transactions")}>
        <ArrowLeft className="size-4 mr-2" />
        Kembali
      </Button>
    </div>
  )
}