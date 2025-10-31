import { User } from "../auth";
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
    
    console.log("FormData entries:",formData);
  const response = await api.put("/api/profile/with-avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data; // returns your profile response DTO
};
