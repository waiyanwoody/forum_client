import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "@/lib/api/profile";
import { useAuth } from "@/contexts/auth-context";
import { User } from "@/lib/auth";

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    const { setUser } = useAuth();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedUser) => {
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        console.log("Profile updated:", updatedUser);
      setUser(updatedUser);
    },
  });
};
