import { ApiHttpError } from "@/lib/http";
import { api } from "./client";

export interface ToggleFollowResponse {
    followingId: number;
    followed: boolean;
    isFriend: boolean;
}

export const toggleFollow = async (
  followingId: number
): Promise<ToggleFollowResponse> => {
  try {
    const response = await api.post(`/api/follows/${followingId}/toggle`);
    return response.data;
  } catch (error: any) {
    const data = error.response?.data;
    if (error.response) {
      if (data && typeof data.status === "number") {
        throw new ApiHttpError(data);
      }
      throw new Error(`Request failed (${error.response.status})`);
    }
    throw new Error("Network error or server unreachable");
  }
};
