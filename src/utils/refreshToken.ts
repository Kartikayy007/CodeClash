import { store } from "@/store/store";
import { refreshToken } from "@/features/auth/thunks/refreshTokenThunk";

export const handleTokenRefresh = async () => {
  try {
    const result = await store.dispatch(refreshToken()).unwrap();
    return result.success;
  } catch (error) {
    console.log(error);
    return false;
  }
};

/**
 * Redirects the user to the login page.
 */
export const navigateToLogin = (): void => {
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};
