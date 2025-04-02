import { api } from "@/utils/api";
import { ProfileResponse } from "../types/profile.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const profileApi = {
  getProfile: async (): Promise<ProfileResponse> => {
    const token = localStorage.getItem("accessToken");
    const response = await api.get<ProfileResponse>(
      `${BASE_URL}/api/v1/user/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  },
};
