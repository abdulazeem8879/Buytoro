import api from "./api";

// all product fetching related services

export const getProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};
