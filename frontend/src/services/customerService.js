import api from "./api"

export async function getCustomers() {
  const res = await api.get("/customers")
  return res.data
}

export async function getCustomer(id) {
  const res = await api.get(`/customers/${id}`)
  return res.data
}

export async function createCustomer(data) {
  const res = await api.post("/customers", data)
  return res.data
}

export async function updateCustomer(id, data) {
  const res = await api.put(`/customers/${id}`, data)
  return res.data
}

export async function deleteCustomer(id) {
  const res = await api.delete(`/customers/${id}`)
  return res.data
}
