import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
})

// ITEMS
api.getItems = () => api.get('/items').then(r => r.data)
api.addItem = (data) => api.post('/items', data).then(r => r.data)
console.log(api.addItem);

api.updateItem = (id, data) => api.put(`/items/${id}`, data).then(r => r.data)

// CATEGORIES
api.getCategories = () => api.get('/categories').then(r => r.data)
api.addCategory = (name) => api.post('/categories', { name }).then(r => r.data)
api.deleteCategory = (id) => api.delete(`/categories/${id}`)

// SALES
api.getSales = () => api.get('/sales').then(r => r.data)
api.getSalesRange = (start, end) => api.get('/sales/range', { params: { from: start, to: end } }).then(r => r.data)
api.addSale = (data) => api.post('/sales', data).then(r => r.data)

export default api
export { api }