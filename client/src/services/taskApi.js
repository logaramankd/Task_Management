import api from "./axiosIns";

export const fetchTasks = async () => {
    const res = await api.get("/tasks/");
    return Array.isArray(res.data) ? res.data : [];
};

export const createTask = async (task) => {
    const res = await api.post("/tasks/", task);
    return res.data;
};

export const updateTask = async (id, updates) => {
    const res = await api.put(`/tasks/${id}`, updates);
    return res.data;
};

export const deleteTask = async (id) => {
    const res = await api.delete(`/tasks/${id}`);
    return res.data;
};