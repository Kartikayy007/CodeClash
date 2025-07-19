"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import type { z } from "zod"
import { Settings, Lock, User, LogOut, Trash2, Shield, AlertTriangle, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { SettingsPasswordFormSchema, SettingsUsernameFormSchema } from "@/lib/schemas/authSchema"
import type { SettingsPasswordFormData } from "@/features/auth/types/form.types"
import { settingsApi } from "@/features/home/settings/apis/settingsApi"
import { toast } from "@/providers/toast-config"

interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
}

export default function AccountSettings() {
  const router = useRouter()
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [apiResponse, setApiResponse] = useState<{ success: boolean; error?: string; message?: string } | null>(null)

  const passwordForm = useForm<z.infer<typeof SettingsPasswordFormSchema>>({
    resolver: zodResolver(SettingsPasswordFormSchema),
    defaultValues: {
      password: "",
      Newpassword: "",
      confirmPassword: "",
    },
  })

  const usernameForm = useForm<z.infer<typeof SettingsUsernameFormSchema>>({
    resolver: zodResolver(SettingsUsernameFormSchema),
    defaultValues: {
      username: "",
    },
  })

  const handlePasswordSubmit = async (data: SettingsPasswordFormData) => {
    setLoading(true)
    setApiResponse(null)
    try {
      if (data.password === data.Newpassword) {
        setLoading(false);
        setApiResponse({ success: false, error: "New password must be different from current password" });
        toast.error("New password must be different from current password", "Password change error");
        return;
      }
      setApiResponse({ success: true, message: "Password changed successfully" })
      toast.success("Password changed successfully", "Password changed successfully")
      setTimeout(() => {
        setIsPasswordModalOpen(false)
        passwordForm.reset()
        setApiResponse(null)
      }, 2000)
    } catch (error) {
      const err = error as ApiError
      const errorMessage = err?.response?.data?.message || "Failed to change password"
      setApiResponse({ success: false, error: errorMessage })
      toast.error(errorMessage, "Failed to change password")
    } finally {
      setLoading(false)
    }
  }

  const handleUsernameSubmit = async () => {
    setLoading(true)
    setApiResponse(null)
    try {
      setApiResponse({ success: true, message: "Username changed successfully" })
      toast.success("Username changed successfully", "Username changed successfully")
      setTimeout(() => {
        setIsProfileModalOpen(false)
        usernameForm.reset()
        setApiResponse(null)
      }, 2000)
    } catch (error) {
      const err = error as ApiError
      const errorMessage = err?.response?.data?.message || "Failed to change username"
      setApiResponse({ success: false, error: errorMessage })
      toast.error(errorMessage, "Failed to change username")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setLoading(true)
    setApiResponse(null)
    try {
      setApiResponse({ success: true, message: "Account deleted successfully" })
      toast.success("Account deleted successfully", "Account deleted successfully")
      localStorage.removeItem("accessToken")
      setTimeout(() => {
        setIsDeleteModalOpen(false)
        setApiResponse(null)
      }, 2000)
    } catch (error: unknown) {
      const err = error as ApiError
      const errorMessage = err?.response?.data?.message || "Failed to delete account"
      setApiResponse({ success: false, error: errorMessage })
      toast.error(errorMessage, "Failed to delete account")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    setLoading(true)
    try {
      await settingsApi.logoutAllDevices()
      localStorage.removeItem("accessToken")
      router.push("/login")
    } catch (error) {
      const err = error as ApiError
      toast.error(err?.response?.data?.message || "Failed to logout", "Failed to logout")
    } finally {
      setLoading(false)
    }
  }

  const handleModalClose = (modalSetter: (value: boolean) => void) => {
    modalSetter(false)
    setApiResponse(null)
  }

  return (
    <div className="min-h-screen space-y-4 sm:space-y-6 md:space-y-8 px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="space-y-2 sm:space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 w-fit">
              <Settings className="h-6 w-6 sm:h-7 sm:w-7 text-cyan-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Account Settings</h1>
          </div>
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg">Manage your account security and preferences</p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Security Section */}
          <Card className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] border-cyan-500/20 shadow-lg shadow-cyan-500/10">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-400 flex-shrink-0" />
                <div>
                  <CardTitle className="text-white text-lg sm:text-xl lg:text-2xl">Security</CardTitle>
                  <CardDescription className="text-gray-400 text-sm sm:text-base">
                    Manage your account security settings
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
              {/* Change Password */}
              <div className="bg-gradient-to-br from-[#23263a] to-[#2a2d3a] rounded-lg p-3 sm:p-4 lg:p-5 border border-cyan-500/10">
                <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex-shrink-0">
                      <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400" />
                    </div>
                    <div className="space-y-1 sm:space-y-2 flex-1 min-w-0">
                      <h3 className="font-medium text-white text-sm sm:text-base lg:text-lg">Change Password</h3>
                      <p className="text-xs sm:text-sm lg:text-base text-gray-400 leading-relaxed">
                        Enter your current password and set a new one to update your credentials
                      </p>
                    </div>
                  </div>
                  <Button
                    className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white border border-cyan-500/30 hover:from-cyan-500/30 hover:to-blue-500/30 hover:scale-105 transition-all duration-200 shadow-lg shadow-cyan-500/25 text-xs sm:text-sm lg:text-base px-3 sm:px-4 py-2 h-9 sm:h-10 w-full lg:w-auto lg:flex-shrink-0 lg:min-w-[140px]"
                    onClick={() => setIsPasswordModalOpen(true)}
                    disabled={loading}
                  >
                    Change Password
                  </Button>
                </div>
              </div>

              <Separator className="bg-cyan-500/20" />

              {/* Logout All Devices */}
              <div className="bg-gradient-to-br from-[#23263a] to-[#2a2d3a] rounded-lg p-3 sm:p-4 lg:p-5 border border-cyan-500/10">
                <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex-shrink-0">
                      <LogOut className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400" />
                    </div>
                    <div className="space-y-1 sm:space-y-2 flex-1 min-w-0">
                      <h3 className="font-medium text-white text-sm sm:text-base lg:text-lg">Log Out</h3>
                      <p className="text-xs sm:text-sm lg:text-base text-gray-400 leading-relaxed">
                        Log out of your account to end your session securely
                      </p>
                    </div>
                  </div>
                  <Button
                    className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white border border-cyan-500/30 hover:from-cyan-500/30 hover:to-blue-500/30 hover:scale-105 transition-all duration-200 shadow-lg shadow-cyan-500/25 text-xs sm:text-sm lg:text-base px-3 sm:px-4 py-2 h-9 sm:h-10 w-full lg:w-auto lg:flex-shrink-0 lg:min-w-[140px]"
                    onClick={handleLogout}
                    disabled={loading}
                  >
                    Log Out
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Section */}
          <Card className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] border-cyan-500/20 shadow-lg shadow-cyan-500/10">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-400 flex-shrink-0" />
                <div>
                  <CardTitle className="text-white text-lg sm:text-xl lg:text-2xl">Profile Information</CardTitle>
                  <CardDescription className="text-gray-400 text-sm sm:text-base">
                    Update your personal information
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
              <div className="bg-gradient-to-br from-[#23263a] to-[#2a2d3a] rounded-lg p-3 sm:p-4 lg:p-5 border border-cyan-500/10">
                <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex-shrink-0">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400" />
                    </div>
                    <div className="space-y-1 sm:space-y-2 flex-1 min-w-0">
                      <h3 className="font-medium text-white text-sm sm:text-base lg:text-lg">Profile Information</h3>
                      <p className="text-xs sm:text-sm lg:text-base text-gray-400 leading-relaxed">
                        Update your name, email, and contact details to keep your account current
                      </p>
                    </div>
                  </div>
                  <Button
                    className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white border border-cyan-500/30 hover:from-cyan-500/30 hover:to-blue-500/30 hover:scale-105 transition-all duration-200 shadow-lg shadow-cyan-500/25 text-xs sm:text-sm lg:text-base px-3 sm:px-4 py-2 h-9 sm:h-10 w-full lg:w-auto lg:flex-shrink-0 lg:min-w-[140px]"
                    onClick={() => setIsProfileModalOpen(true)}
                    disabled={loading}
                  >
                    Edit Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] border-red-500/20 shadow-lg shadow-red-500/10">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-red-400 flex-shrink-0" />
                <div>
                  <CardTitle className="text-red-400 text-lg sm:text-xl lg:text-2xl">Danger Zone</CardTitle>
                  <CardDescription className="text-gray-400 text-sm sm:text-base">
                    Irreversible and destructive actions
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
              <div className="bg-gradient-to-br from-[#23263a] to-[#2a2d3a] rounded-lg p-3 sm:p-4 lg:p-5 border border-red-500/20">
                <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 flex-shrink-0">
                      <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
                    </div>
                    <div className="space-y-1 sm:space-y-2 flex-1 min-w-0">
                      <h3 className="font-medium text-red-400 text-sm sm:text-base lg:text-lg">Delete Account</h3>
                      <p className="text-xs sm:text-sm lg:text-base text-gray-400 leading-relaxed">
                        Deleting your account will permanently remove all data and cannot be undone
                      </p>
                    </div>
                  </div>
                  <Button
                    className="bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border border-red-500/30 hover:from-red-500/30 hover:to-pink-500/30 hover:scale-105 transition-all duration-200 shadow-lg shadow-red-500/25 text-xs sm:text-sm lg:text-base px-3 sm:px-4 py-2 h-9 sm:h-10 w-full lg:w-auto lg:flex-shrink-0 lg:min-w-[140px]"
                    onClick={() => setIsDeleteModalOpen(true)}
                    disabled={loading}
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Change Password Modal */}
        <Dialog open={isPasswordModalOpen} onOpenChange={(open) => !open && handleModalClose(setIsPasswordModalOpen)}>
          <DialogContent className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] border-cyan-500/20 text-white w-[calc(100vw-1.5rem)] sm:w-[calc(100vw-3rem)] max-w-md mx-auto max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white text-lg sm:text-xl">Change Password</DialogTitle>
              <DialogDescription className="text-gray-400 text-sm sm:text-base">
                Enter your current password and choose a new one
              </DialogDescription>
              {apiResponse && (
                <div
                  className={`p-3 sm:p-4 rounded-lg border ${
                    apiResponse.success
                      ? "bg-green-500/10 border-green-500/30 text-green-400"
                      : "bg-red-500/10 border-red-500/30 text-red-400"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {apiResponse.success ? (
                      <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      </div>
                    ) : (
                      <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="text-sm sm:text-base">
                      {apiResponse.success ? apiResponse.message : apiResponse.error}
                    </div>
                  </div>
                </div>
              )}
            </DialogHeader>
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
                <FormField
                  control={passwordForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-sm sm:text-base">Current Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showCurrentPassword ? "text" : "password"}
                            placeholder="Enter current password"
                            className="bg-[#23263a] border-cyan-500/20 text-white placeholder:text-gray-500 focus:border-cyan-500/50 text-sm sm:text-base pr-10 h-10 sm:h-11"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-10 sm:h-11 px-3 py-2 hover:bg-transparent text-gray-400 hover:text-cyan-400"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="Newpassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-sm sm:text-base">New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            className="bg-[#23263a] border-cyan-500/20 text-white placeholder:text-gray-500 focus:border-cyan-500/50 text-sm sm:text-base pr-10 h-10 sm:h-11"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-10 sm:h-11 px-3 py-2 hover:bg-transparent text-gray-400 hover:text-cyan-400"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-sm sm:text-base">Confirm New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm new password"
                            className="bg-[#23263a] border-cyan-500/20 text-white placeholder:text-gray-500 focus:border-cyan-500/50 text-sm sm:text-base pr-10 h-10 sm:h-11"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-10 sm:h-11 px-3 py-2 hover:bg-transparent text-gray-400 hover:text-cyan-400"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />
                <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent text-sm sm:text-base h-10 w-full sm:w-auto"
                    onClick={() => setIsPasswordModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white border border-cyan-500/30 hover:from-cyan-500/30 hover:to-blue-500/30 text-sm sm:text-base h-10 w-full sm:w-auto"
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Edit Profile Modal */}
        <Dialog open={isProfileModalOpen} onOpenChange={(open) => !open && handleModalClose(setIsProfileModalOpen)}>
          <DialogContent className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] border-cyan-500/20 text-white w-[calc(100vw-1.5rem)] sm:w-[calc(100vw-3rem)] max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle className="text-white text-lg sm:text-xl">Edit Profile</DialogTitle>
              <DialogDescription className="text-gray-400 text-sm sm:text-base">
                Update your profile information
              </DialogDescription>
              {apiResponse && (
                <div
                  className={`p-3 sm:p-4 rounded-lg border ${
                    apiResponse.success
                      ? "bg-green-500/10 border-green-500/30 text-green-400"
                      : "bg-red-500/10 border-red-500/30 text-red-400"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {apiResponse.success ? (
                      <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      </div>
                    ) : (
                      <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="text-sm sm:text-base">
                      {apiResponse.success ? apiResponse.message : apiResponse.error}
                    </div>
                  </div>
                </div>
              )}
            </DialogHeader>
            <Form {...usernameForm}>
              <form onSubmit={usernameForm.handleSubmit(handleUsernameSubmit)} className="space-y-4">
                <FormField
                  control={usernameForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-sm sm:text-base">Username</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter username"
                          className="bg-[#23263a] border-cyan-500/20 text-white placeholder:text-gray-500 focus:border-cyan-500/50 text-sm sm:text-base h-10 sm:h-11"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />
                <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent text-sm sm:text-base h-10 w-full sm:w-auto"
                    onClick={() => setIsProfileModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white border border-cyan-500/30 hover:from-cyan-500/30 hover:to-blue-500/30 text-sm sm:text-base h-10 w-full sm:w-auto"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Delete Account Modal */}
        <Dialog open={isDeleteModalOpen} onOpenChange={(open) => !open && handleModalClose(setIsDeleteModalOpen)}>
          <DialogContent className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] border-red-500/20 text-white w-[calc(100vw-1.5rem)] sm:w-[calc(100vw-3rem)] max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle className="text-red-400 text-lg sm:text-xl">Delete Account</DialogTitle>
              <DialogDescription className="text-gray-400 text-sm sm:text-base">
                This action cannot be undone. This will permanently delete your account and remove all associated data.
              </DialogDescription>
              <div className="flex items-start gap-3 p-3 sm:p-4 border border-red-500/50 rounded-lg bg-red-500/5">
                <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  Are you sure you want to delete your account? This action cannot be undone and will permanently remove
                  all your data.
                </p>
              </div>
              {apiResponse && (
                <div
                  className={`p-3 sm:p-4 rounded-lg border ${
                    apiResponse.success
                      ? "bg-green-500/10 border-green-500/30 text-green-400"
                      : "bg-red-500/10 border-red-500/30 text-red-400"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {apiResponse.success ? (
                      <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      </div>
                    ) : (
                      <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="text-sm sm:text-base">
                      {apiResponse.success ? apiResponse.message : apiResponse.error}
                    </div>
                  </div>
                </div>
              )}
            </DialogHeader>
            <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent text-sm sm:text-base h-10 w-full sm:w-auto"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border border-red-500/30 hover:from-red-500/30 hover:to-pink-500/30 text-sm sm:text-base h-10 w-full sm:w-auto"
                onClick={handleDeleteAccount}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete Account"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
