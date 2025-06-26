import { useState } from "react";
import Modal from "@/components/ui/Modal";
import LabelButton from "@/components/ui/LabelButton";
import CustomInput from "../CustomInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SettingsPasswordFormSchema,
  SettingsUsernameFormSchema,
} from "@/lib/schemas/authSchema";
import { Form } from "@/components/ui/form";
import {
  SettingsPasswordFormData,
  SettingsUsernameFormData,
} from "@/features/auth/types/form.types";
import { settingsApi } from "@/features/home/settings/apis/settingsApi";
import { toast } from "@/providers/toast-config";
import { useRouter } from "next/navigation";
import { ToastProvider } from "@/providers/ToastProvider";
import { z } from "zod";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}
export default function AccountSettings() {
  const router = useRouter();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordForm = useForm<z.infer<typeof SettingsPasswordFormSchema>>({
    resolver: zodResolver(SettingsPasswordFormSchema),
    defaultValues: {
      password: "",
      Newpassword: "",
      confirmPassword: "",
    },
  });

  const usernameForm = useForm<z.infer<typeof SettingsUsernameFormSchema>>({
    resolver: zodResolver(SettingsUsernameFormSchema),
    defaultValues: {
      username: "",
    },
  });

  const handlePasswordSubmit = async (data: SettingsPasswordFormData) => {
    setLoading(true);
    try {
      await settingsApi.changePassword({
        oldPassword: data.password,
        newPassword: data.Newpassword,
      });
      toast.success(
        "Password changed successfully",
        "Password changed successfully",
      );
      setIsPasswordModalOpen(false);
      passwordForm.reset();
    } catch (error) {
      const err = error as ApiError;
      toast.error(
        err?.response?.data?.message || "Failed to change password",
        "Failed to change password",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameSubmit = async (data: SettingsUsernameFormData) => {
    setLoading(true);
    try {
      await settingsApi.changeUsername({
        username: data.username,
      });
      toast.success(
        "Username changed successfully",
        "Username changed successfully",
      );
      setIsProfileModalOpen(false);
      usernameForm.reset();
    } catch (error) {
      const err = error as ApiError;
      toast.error(
        err?.response?.data?.message || "Failed to change username",
        "Failed to change username",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await settingsApi.deleteAccount();
      toast.success(
        "Account deleted successfully",
        "Account deleted successfully",
      );
      localStorage.removeItem("accessToken");
      // router.push('/login');
    } catch (error: unknown) {
      const err = error as ApiError;
      toast.error(
        err?.response?.data?.message || "Failed to delete account",
        "Failed to delete account",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await settingsApi.logoutAllDevices();
      localStorage.removeItem("accessToken");
      router.push("/login");
    } catch (error) {
      const err = error as ApiError;
      toast.error(
        err?.response?.data?.message || "Failed to logout",
        "Failed to logout",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl p-6 backdrop-blur-sm border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">Account Settings</h2>
        <p className="text-gray-400 text-sm">Manage your account security and preferences</p>
      </div>

      <div className="absolute top-20">
        <ToastProvider />
      </div>

      <div className="space-y-6">
        <div className="bg-gradient-to-br from-[#23263a] to-[#2a2d3a] rounded-lg p-4 border border-cyan-500/10">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-white font-medium mb-1">Change Password</h3>
              <p className="text-gray-400 text-sm mb-4">
                Enter your current password and set a new one to update your
                credentials.
              </p>
            </div>
            <button
              className="text-white bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-4 py-2 rounded-lg hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/30 transition-all duration-200 hover:scale-105 shadow-lg shadow-cyan-500/25"
              onClick={() => setIsPasswordModalOpen(true)}
              disabled={loading}
            >
              Change Password
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#23263a] to-[#2a2d3a] rounded-lg p-4 border border-cyan-500/10">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-white font-medium mb-1">Profile Information</h3>
              <p className="text-gray-400 text-sm mb-4">
                Update your name, email, and contact details to keep your account
                current.
              </p>
            </div>
            <button
              className="text-white bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-4 py-2 rounded-lg hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/30 transition-all duration-200 hover:scale-105 shadow-lg shadow-cyan-500/25"
              onClick={() => setIsProfileModalOpen(true)}
              disabled={loading}
            >
              Edit Profile
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#23263a] to-[#2a2d3a] rounded-lg p-4 border border-cyan-500/10">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-white font-medium mb-1">Log Out</h3>
              <p className="text-gray-400 text-sm mb-4">
                Log out of your account to end your session securely.
              </p>
            </div>
            <button
              className="text-white bg-gradient-to-r from-red-500/20 to-pink-500/20 px-4 py-2 rounded-lg hover:from-red-500/30 hover:to-pink-500/30 border border-red-500/30 transition-all duration-200 hover:scale-105 shadow-lg shadow-red-500/25"
              onClick={handleLogout}
              disabled={loading}
            >
              Log Out
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#23263a] to-[#2a2d3a] rounded-lg p-4 border border-red-500/20">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-white font-medium mb-1">Delete Account</h3>
              <p className="text-gray-400 text-sm mb-4">
                Deleting your account will permanently remove all data and cannot be
                undone.
              </p>
            </div>
            <button
              className="text-red-400 border border-red-500/30 px-4 py-2 rounded-lg hover:bg-red-500/10 hover:border-red-500/50 transition-all duration-200 hover:scale-105"
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={loading}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Change Password"
      >
        <Form {...passwordForm}>
          <form
            onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
            className="space-y-6"
          >
            <CustomInput
              control={passwordForm.control}
              name="password"
              label="Current Password"
              placeholder="Enter current password"
              type="password"
            />
            <CustomInput
              control={passwordForm.control}
              name="Newpassword"
              label="New Password"
              placeholder="Enter new password"
              type="password"
            />
            <CustomInput
              control={passwordForm.control}
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm new password"
              type="password"
            />
            <div className="flex justify-end gap-4">
              <LabelButton
                variant="outlined"
                onClick={() => setIsPasswordModalOpen(false)}
                type="button"
              >
                Cancel
              </LabelButton>
              <LabelButton type="submit">Update Password</LabelButton>
            </div>
          </form>
        </Form>
      </Modal>

      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title="Edit Profile"
      >
        <Form {...usernameForm}>
          <form
            onSubmit={usernameForm.handleSubmit(handleUsernameSubmit)}
            className="space-y-6"
          >
            <CustomInput
              control={usernameForm.control}
              name="username"
              label="Username"
              placeholder="Enter username"
              type="text"
            />
            <div className="flex justify-end gap-4">
              <LabelButton
                variant="outlined"
                onClick={() => setIsProfileModalOpen(false)}
                type="button"
              >
                Cancel
              </LabelButton>
              <LabelButton type="submit">Save Changes</LabelButton>
            </div>
          </form>
        </Form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Account"
      >
        <div className="space-y-6">
          <p className="text-gray-400">
            Are you sure you want to delete your account? This action cannot be
            undone and will permanently remove all your data.
          </p>
          <div className="flex justify-end gap-4">
            <LabelButton
              variant="outlined"
              onClick={() => setIsDeleteModalOpen(false)}
              type="button"
            >
              Cancel
            </LabelButton>
            <LabelButton
              variant="filled"
              onClick={handleDeleteAccount}
              type="button"
            >
              Delete Account
            </LabelButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
