import { AxiosResponse } from "axios";
import { UserWithStats } from "../interfaces/Common.interface";
import baseAxiosInstance from "./baseAxiosInstance";

export async function updateSavedUserData(): Promise<
  AxiosResponse<{ message: string; data: UserWithStats }>
> {
  return await baseAxiosInstance().get("/profiles");
}
