import api from "./api";

// Get all notes
export const getAllNotes = async () => {
  const res = await api.get("/getallnotes");
  return res.data;
};

// Create note
export const createNote = async (data) => {
  const res = await api.post("/createnote", data);
  return res.data;
};

// Update note
export const updateNote = async (id, data) => {
  const res = await api.post(`/updatenote/${id}`, data);
  return res.data;
};

// Delete note
export const deleteNote = async (id) => {
  const res = await api.delete(`/deletenote/${id}`);
  return res.data;
};
