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
// import { Badge } from "@/components/ui/badge"
import { SettingsPasswordFormSchema, SettingsUsernameFormSchema } from "@/lib/schemas/authSchema"
import type { SettingsPasswordFormData, SettingsUsernameFormData } from "@/features/auth/types/form.types"
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
    try {
      await settingsApi.changePassword({
        oldPassword: data.password,
        newPassword: data.Newpassword,
      })
      toast.success("Password changed successfully", "Password changed successfully")
      setIsPasswordModalOpen(false)
      passwordForm.reset()
    } catch (error) {
      const err = error as ApiError
      toast.error(err?.response?.data?.message || "Failed to change password", "Failed to change password")
    } finally {
      setLoading(false)
    }
  }

  const handleUsernameSubmit = async (data: SettingsUsernameFormData) => {
    setLoading(true)
    try {
      await settingsApi.changeUsername({
        username: data.username,
      })
      toast.success("Username changed successfully", "Username changed successfully")
      setIsProfileModalOpen(false)
      usernameForm.reset()
    } catch (error) {
      const err = error as ApiError
      toast.error(err?.response?.data?.message || "Failed to change username", "Failed to change username")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setLoading(true)
    try {
      await settingsApi.deleteAccount()
      toast.success("Account deleted successfully", "Account deleted successfully")
      localStorage.removeItem("accessToken")
      // router.push('/login');
    } catch (error: unknown) {
      const err = error as ApiError
      toast.error(err?.response?.data?.message || "Failed to delete account", "Failed to delete account")
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

  return (
    <div className="space-y-6 md:space-y-8 px-4 md:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 w-fit">
            <Settings className="h-6 w-6 text-cyan-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Account Settings</h1>
        </div>
        <p className="text-gray-400 text-sm sm:text-base">Manage your account security and preferences</p>
      </div>

      <div className="space-y-4 md:space-y-6">
        {/* Security Section */}
        <Card className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] border-cyan-500/20 shadow-lg shadow-cyan-500/10">
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-cyan-400 flex-shrink-0" />
              <CardTitle className="text-white text-lg md:text-xl">Security</CardTitle>
            </div>
            <CardDescription className="text-gray-400 text-sm md:text-base">Manage your account security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-4 md:p-6 pt-0 md:pt-0">
            {/* Change Password */}
            <div className="bg-gradient-to-br from-[#23263a] to-[#2a2d3a] rounded-lg p-3 md:p-4 border border-cyan-500/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex-shrink-0">
                    <Lock className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <h3 className="font-medium text-white text-sm md:text-base">Change Password</h3>
                    <p className="text-xs md:text-sm text-gray-400">
                      Enter your current password and set a new one to update your credentials
                    </p>
                  </div>
                </div>
                <Button
                  className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white border border-cyan-500/30 hover:from-cyan-500/30 hover:to-blue-500/30 hover:scale-105 transition-all duration-200 shadow-lg shadow-cyan-500/25 text-xs md:text-sm px-3 md:px-4 py-2 w-full sm:w-auto flex-shrink-0"
                  onClick={() => setIsPasswordModalOpen(true)}
                  disabled={loading}
                >
                  Change Password
                </Button>
              </div>
            </div>

            <Separator className="bg-cyan-500/20" />

            {/* Logout All Devices */}
            <div className="bg-gradient-to-br from-[#23263a] to-[#2a2d3a] rounded-lg p-3 md:p-4 border border-cyan-500/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex-shrink-0">
                    <LogOut className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium text-white text-sm md:text-base">Log Out</h3>
                    <p className="text-xs md:text-sm text-gray-400">Log out of your account to end your session securely</p>
                  </div>
                </div>
                <Button
                  className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white border border-cyan-500/30 hover:from-cyan-500/30 hover:to-blue-500/30 hover:scale-105 transition-all duration-200 shadow-lg shadow-cyan-500/25 text-xs md:text-sm px-3 md:px-4 py-2 w-full sm:w-auto flex-shrink-0"
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
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-cyan-400 flex-shrink-0" />
              <CardTitle className="text-white text-lg md:text-xl">Profile Information</CardTitle>
            </div>
            <CardDescription className="text-gray-400 text-sm md:text-base">Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-4 md:p-6 pt-0 md:pt-0">
            <div className="bg-gradient-to-br from-[#23263a] to-[#2a2d3a] rounded-lg p-3 md:p-4 border border-cyan-500/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex-shrink-0">
                    <User className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium text-white text-sm md:text-base">Profile Information</h3>
                    <p className="text-xs md:text-sm text-gray-400">
                      Update your name, email, and contact details to keep your account current
                    </p>
                  </div>
                </div>
                <Button
                  className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white border border-cyan-500/30 hover:from-cyan-500/30 hover:to-blue-500/30 hover:scale-105 transition-all duration-200 shadow-lg shadow-cyan-500/25 text-xs md:text-sm px-3 md:px-4 py-2 w-full sm:w-auto flex-shrink-0"
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
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0" />
              <CardTitle className="text-red-400 text-lg md:text-xl">Danger Zone</CardTitle>
            </div>
            <CardDescription className="text-gray-400 text-sm md:text-base">Irreversible and destructive actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-4 md:p-6 pt-0 md:pt-0">
            <div className="bg-gradient-to-br from-[#23263a] to-[#2a2d3a] rounded-lg p-3 md:p-4 border border-red-500/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 flex-shrink-0">
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium text-red-400 text-sm md:text-base">Delete Account</h3>
                    <p className="text-xs md:text-sm text-gray-400">
                      Deleting your account will permanently remove all data and cannot be undone
                    </p>
                  </div>
                </div>
                <Button
                  className="bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border border-red-500/30 hover:from-red-500/30 hover:to-pink-500/30 hover:scale-105 transition-all duration-200 shadow-lg shadow-red-500/25 text-xs md:text-sm px-3 md:px-4 py-2 w-full sm:w-auto flex-shrink-0"
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
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] border-cyan-500/20 text-white w-[95vw] max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-white text-lg md:text-xl">Change Password</DialogTitle>
            <DialogDescription className="text-gray-400 text-sm md:text-base">
              Enter your current password and choose a new one
            </DialogDescription>
          </DialogHeader>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white text-sm md:text-base">Current Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showCurrentPassword ? "text" : "password"}
                          placeholder="Enter current password"
                          className="bg-[#23263a] border-cyan-500/20 text-white placeholder:text-gray-500 focus:border-cyan-500/50 text-sm md:text-base pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-cyan-400"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs md:text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="Newpassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white text-sm md:text-base">New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          className="bg-[#23263a] border-cyan-500/20 text-white placeholder:text-gray-500 focus:border-cyan-500/50 text-sm md:text-base pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-cyan-400"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs md:text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white text-sm md:text-base">Confirm New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm new password"
                          className="bg-[#23263a] border-cyan-500/20 text-white placeholder:text-gray-500 focus:border-cyan-500/50 text-sm md:text-base pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-cyan-400"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs md:text-sm" />
                  </FormItem>
                )}
              />
              <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent text-sm md:text-base w-full sm:w-auto order-2 sm:order-1"
                  onClick={() => setIsPasswordModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white border border-cyan-500/30 hover:from-cyan-500/30 hover:to-blue-500/30 text-sm md:text-base w-full sm:w-auto order-1 sm:order-2"
                >
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Modal */}
      <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
        <DialogContent className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] border-cyan-500/20 text-white w-[95vw] max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-white text-lg md:text-xl">Edit Profile</DialogTitle>
            <DialogDescription className="text-gray-400 text-sm md:text-base">Update your profile information</DialogDescription>
          </DialogHeader>
          <Form {...usernameForm}>
            <form onSubmit={usernameForm.handleSubmit(handleUsernameSubmit)} className="space-y-4">
              <FormField
                control={usernameForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white text-sm md:text-base">Username</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter username"
                        className="bg-[#23263a] border-cyan-500/20 text-white placeholder:text-gray-500 focus:border-cyan-500/50 text-sm md:text-base"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs md:text-sm" />
                  </FormItem>
                )}
              />
              <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent text-sm md:text-base w-full sm:w-auto order-2 sm:order-1"
                  onClick={() => setIsProfileModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white border border-cyan-500/30 hover:from-cyan-500/30 hover:to-blue-500/30 text-sm md:text-base w-full sm:w-auto order-1 sm:order-2"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Account Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] border-red-500/20 text-white w-[95vw] max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-red-400 text-lg md:text-xl">Delete Account</DialogTitle>
            <DialogDescription className="text-gray-400 text-sm md:text-base">
              This action cannot be undone. This will permanently delete your account and remove all associated data.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-start gap-3 p-3 md:p-4 border border-red-500/50 rounded-lg bg-red-500/5">
            <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs md:text-sm text-gray-400">
              Are you sure you want to delete your account? This action cannot be undone and will permanently remove all
              your data.
            </p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent text-sm md:text-base w-full sm:w-auto order-2 sm:order-1"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border border-red-500/30 hover:from-red-500/30 hover:to-pink-500/30 text-sm md:text-base w-full sm:w-auto order-1 sm:order-2"
              onClick={handleDeleteAccount}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
