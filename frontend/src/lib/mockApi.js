const BASE = import.meta.env.VITE_API_URL || "http://localhost:5002/api";

async function request(method, path, { body, params } = {}) {
  const base = BASE.endsWith("/") ? BASE.slice(0, -1) : BASE;
  const url = new URL(`${base}${path}`);

  if (params) {
    Object.keys(params).forEach((k) => {
      if (params[k] !== undefined && params[k] !== null)
        url.searchParams.append(k, params[k]);
    });
  }

  const init = { method, headers: {} };
  if (body !== undefined) {
    init.headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(body);
  }

  const res = await fetch(url.toString(), init);
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    console.error(e);
    data = text;
  }

  if (!res.ok) {
    const err = new Error((data && data.error) || res.statusText);
    err.status = res.status;
    err.response = data;
    throw err;
  }

  return data;
}

const api = {
  // low-level helpers
  get: (p, opts) => request("GET", p, opts),
  post: (p, body) => request("POST", p, { body }),
  put: (p, body) => request("PUT", p, { body }),
  delete: (p) => request("DELETE", p),

  // ITEMS
  getItems: () => request("GET", "/items"),
  addItem: (data) => request("POST", "/items", { body: data }),
  updateItem: (id, data) => request("PUT", `/items/${id}`, { body: data }),

  // CATEGORIES
  getCategories: () => request("GET", "/categories"),
  addCategory: (name) => request("POST", "/categories", { body: { name } }),
  deleteCategory: (id) => request("DELETE", `/categories/${id}`),

  // SALES
  getSales: () => request("GET", "/sales"),
  getSalesRange: (start, end) =>
    request("GET", "/sales/range", { params: { from: start, to: end } }),
  // legacy name used in some components
  getSalesBetween: (start, end) =>
    request("GET", "/sales/range", { params: { from: start, to: end } }),
  addSale: (data) => request("POST", "/sales", { body: data }),

  // AUTH
  login: (username, password) => request('POST', '/auth/login', { body: { username, password } }),
};

export default api;
export { api };
