import { useState, useEffect } from "react"
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
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import api from "@/services/api"
import { toast } from "sonner"

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: "", phone: "", address: "" })

  const fetchCustomers = async () => {
    try {
      const { data } = await api.get("/customers")
      setCustomers(data)
    } catch {
      toast.error("Gagal memuat data pelanggan")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ name: "", phone: "", address: "" })
    setOpen(true)
  }

  const openEdit = (customer) => {
    setEditing(customer)
    setForm({ name: customer.name, phone: customer.phone, address: customer.address })
    setOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        await api.put(`/customers/${editing.id}`, form)
        toast.success("Pelanggan berhasil diupdate")
      } else {
        await api.post("/customers", form)
        toast.success("Pelanggan berhasil ditambahkan")
      }
      setOpen(false)
      fetchCustomers()
    } catch {
      toast.error("Gagal menyimpan data")
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus pelanggan ini?")) return
    try {
      await api.delete(`/customers/${id}`)
      toast.success("Pelanggan berhasil dihapus")
      fetchCustomers()
    } catch {
      toast.error("Gagal menghapus pelanggan")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Data Pelanggan</h1>
          <p className="text-muted-foreground">Kelola data pelanggan laundry</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4 mr-2" />
          Tambah Pelanggan
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Telepon</TableHead>
              <TableHead>Alamat</TableHead>
              <TableHead className="w-24">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  Belum ada pelanggan
                </TableCell>
              </TableRow>
            ) : (
              customers.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.phone}</TableCell>
                  <TableCell className="max-w-xs truncate">{c.address}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(c)}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)}>
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Pelanggan" : "Tambah Pelanggan"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Nama</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Telepon</label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Alamat</label>
              <Input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full">
              {editing ? "Simpan" : "Tambah"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}