import api from "./api"

export async function getTransactions() {
  const res = await api.get("/transactions")
  return res.data
}

export async function getTransaction(id) {
  const res = await api.get(`/transactions/${id}`)
  return res.data
}

export async function createTransaction(data) {
  const res = await api.post("/transactions", data)
  return res.data
}

export async function updateTransactionStatus(id, status) {
  const res = await api.patch(`/transactions/${id}/status`, { status })
  return res.data
}

export async function getTransactionInvoice(id) {
  const res = await api.get(`/transactions/${id}/invoice`)
  return res.data
}

export async function getHistory(params) {
  const res = await api.get("/transactions/history", { params })
  return res.data
}

export async function getDashboardStats() {
  const res = await api.get("/transactions/dashboard/stats")
  return res.data
}
