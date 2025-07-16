import axios from "axios";

// funzioni da passare come 2 parametro ai vari asyncThunk delle slice
// prende endpoint dell'api desiderata ed il body dove serve
// gestisco tutti i diversi casi delle chiamate HTTP

// GET ALL O GET BY ID
export async function fetchData(endpoint) {
  const response = await axios.get(endpoint);
  return response.data;
}

// POST
export async function postData(endpoint, body) {
  const response = await axios.post(endpoint, body);
  return response.data;
}

// UPDATE
export async function updateData(endpoint, body) {
  const response = await axios.put(endpoint, body);
  return response.data;
}

// DELETE
export async function deleteData(endpoint) {
  const response = await axios.delete(endpoint);
  return response.data;
}
