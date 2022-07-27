import baseAxiosInstance from "./baseAxiosInstance";

export async function updateSavedUserData() {
  return await baseAxiosInstance().get("/profiles");
}
