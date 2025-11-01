import { User } from "../auth";
import { ApiErrorResponse, ApiHttpError, parseOrFallback } from "../http";
import { api } from "./client";

export interface ProfileRequest {
  fullname?: string;
  username?: string;
  bio?: string;
  avatar?: File | null;
}

export const updateProfile = async (data: ProfileRequest): Promise<User> => {
  const formData = new FormData();


    formData.append("fullname", data.fullname || "");
    formData.append("username", data.username || "");
    formData.append("bio", data.bio || "");

    // image upload
    if (data.avatar) formData.append("avatar", data.avatar);
  
    console.log("the size of image:" ,data?.avatar?.size)
  
    try {
      const response = await api.put("/api/profile/with-avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data; //  success
    } catch (error: any) {
      const data = error.response.data;
      //  Handle backend errors gracefully
      if (error.response) {
        if (data && typeof data.status === "number") {
          throw new ApiHttpError(data);
        }
        // fallback if backend response isn’t in expected format
        throw new Error(`Request failed (${error.response.status})`);
      }

      // network or unexpected error
      throw new Error("Network error or server unreachable");
    }
};
