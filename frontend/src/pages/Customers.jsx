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
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, Search } from "lucide-react"

function getCustomers() {
  return JSON.parse(localStorage.getItem("customers") || "[]")
}

function saveCustomers(customers) {
  localStorage.setItem("customers", JSON.stringify(customers))
}

const emptyForm = { name: "", phone: "", address: "" }

export default function Customers() {
  const [customers, setCustomers] = useState(getCustomers)
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const filtered = useMemo(() => {
    if (!search.trim()) return customers
    const q = search.toLowerCase()
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q)
    )
  }, [customers, search])

  function openAdd() {
    setForm(emptyForm)
    setEditingId(null)
    setDialogOpen(true)
  }

  function openEdit(customer) {
    setForm({ name: customer.name, phone: customer.phone, address: customer.address })
    setEditingId(customer.id)
    setDialogOpen(true)
  }

  function handleSave() {
    if (!form.name || !form.phone) {
      toast.error("Nama dan nomor telepon harus diisi")
      return
    }

    let updated
    if (editingId) {
      updated = customers.map((c) =>
        c.id === editingId ? { ...c, ...form } : c
      )
      toast.success("Pelanggan berhasil diperbarui")
    } else {
      const newCustomer = {
        ...form,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      }
      updated = [...customers, newCustomer]
      toast.success("Pelanggan berhasil ditambahkan")
    }

    saveCustomers(updated)
    setCustomers(updated)
    setDialogOpen(false)
  }

  function handleDelete(id) {
    const updated = customers.filter((c) => c.id !== id)
    saveCustomers(updated)
    setCustomers(updated)
    setDeleteId(null)
    toast.success("Pelanggan berhasil dihapus")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pelanggan</h1>
          <p className="text-muted-foreground mt-1">
            Kelola data pelanggan laundry
          </p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Pelanggan
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Cari nama atau telepon..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Telepon</TableHead>
              <TableHead>Alamat</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  {search ? "Pelanggan tidak ditemukan" : "Belum ada pelanggan"}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {customer.address || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEdit(customer)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDeleteId(customer.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Pelanggan" : "Tambah Pelanggan"}</DialogTitle>
            <DialogDescription>
              {editingId
                ? "Ubah data pelanggan yang sudah ada"
                : "Masukkan data pelanggan baru"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nama pelanggan"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Telepon</label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="08xxxxxxxxxx"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Alamat</label>
              <Input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Alamat (opsional)"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Batal</Button>
            </DialogClose>
            <Button onClick={handleSave}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Pelanggan</DialogTitle>
            <DialogDescription>
              Apakah anda yakin ingin menghapus pelanggan ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Batal</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => handleDelete(deleteId)}
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
