"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { useToast } from "@/hooks/use-toast"
import { Loader2, User, Lock, LogOut, Trash2 } from "lucide-react"

// Schemas
const SettingsPasswordFormSchema = z
  .object({
    password: z.string().min(1, "Current password is required"),
    Newpassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.Newpassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

const SettingsUsernameFormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
})

interface UserProfile {
  data: {
    username: string
    email: string
    maxWinStreak: number
    losses: number
    totalMatches: number
  }
}

interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
}

const ShimmerEffect = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-6 w-48 bg-gray-700 rounded"></div>
    <div className="space-y-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-32 bg-gray-700 rounded"></div>
          <div className="h-3 w-full bg-gray-600 rounded"></div>
          <div className="h-8 w-32 bg-gray-700 rounded"></div>
        </div>
      ))}
    </div>
  </div>
)

// Mock API functions - replace with your actual API
const settingsApi = {
  changePassword: async (data: { oldPassword: string; newPassword: string }) => {
    const token = localStorage.getItem("accessToken")
    const response = await fetch("https://Codeclash.goyalshivansh.tech/api/v1/user/change-password", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to change password")
    return response.json()
  },

  changeUsername: async (data: { username: string }) => {
    const token = localStorage.getItem("accessToken")
    const response = await fetch("https://Codeclash.goyalshivansh.tech/api/v1/user/change-username", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to change username")
    return response.json()
  },

  deleteAccount: async () => {
    const token = localStorage.getItem("accessToken")
    const response = await fetch("https://Codeclash.goyalshivansh.tech/api/v1/user/delete", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    if (!response.ok) throw new Error("Failed to delete account")
    return response.json()
  },

  logoutAllDevices: async () => {
    const token = localStorage.getItem("accessToken")
    const response = await fetch("https://Codeclash.goyalshivansh.tech/api/v1/user/logout-all", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    if (!response.ok) throw new Error("Failed to logout")
    return response.json()
  },
}

export default function AccountSettings() {
  const router = useRouter()
  const { toast } = useToast()

  // State for user profile
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Modal states
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  // Loading states for actions
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)
  const [isUsernameLoading, setIsUsernameLoading] = useState(false)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)
  const [isLogoutLoading, setIsLogoutLoading] = useState(false)

  // Forms
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

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("accessToken")

      if (!token) {
        console.error("No access token found in local storage")
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch("https://Codeclash.goyalshivansh.tech/api/v1/user/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()

        if (data.success) {
          setUserProfile(data)
          // Set current username as default in the form
          usernameForm.setValue("username", data.data.username)
        } else {
          console.error("Failed to fetch user profile:", data)
          setUserProfile(null)
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
        setUserProfile(null)
        toast({
          title: "Error",
          description: "Failed to load user profile",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [usernameForm, toast])

  const handlePasswordSubmit = async (data: z.infer<typeof SettingsPasswordFormSchema>) => {
    setIsPasswordLoading(true)
    try {
      await settingsApi.changePassword({
        oldPassword: data.password,
        newPassword: data.Newpassword,
      })
      toast({
        title: "Success",
        description: "Password changed successfully",
      })
      setIsPasswordModalOpen(false)
      passwordForm.reset()
    } catch (error) {
      const err = error as ApiError
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to change password",
        variant: "destructive",
      })
    } finally {
      setIsPasswordLoading(false)
    }
  }

  const handleUsernameSubmit = async (data: z.infer<typeof SettingsUsernameFormSchema>) => {
    setIsUsernameLoading(true)
    try {
      await settingsApi.changeUsername({
        username: data.username,
      })

      // Update local state
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          data: {
            ...userProfile.data,
            username: data.username,
          },
        })
      }

      toast({
        title: "Success",
        description: "Username changed successfully",
      })
      setIsProfileModalOpen(false)
    } catch (error) {
      const err = error as ApiError
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to change username",
        variant: "destructive",
      })
    } finally {
      setIsUsernameLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleteLoading(true)
    try {
      await settingsApi.deleteAccount()
      toast({
        title: "Success",
        description: "Account deleted successfully",
      })
      localStorage.removeItem("accessToken")
      router.push("/login")
    } catch (error) {
      const err = error as ApiError
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to delete account",
        variant: "destructive",
      })
    } finally {
      setIsDeleteLoading(false)
    }
  }

  const handleLogout = async () => {
    setIsLogoutLoading(true)
    try {
      await settingsApi.logoutAllDevices()
      localStorage.removeItem("accessToken")
      router.push("/login")
    } catch (error) {
      const err = error as ApiError
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to logout",
        variant: "destructive",
      })
    } finally {
      setIsLogoutLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="bg-[#1E2127] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Account Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <ShimmerEffect />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-[#1E2127] border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Account Settings</CardTitle>
        {userProfile && (
          <CardDescription className="text-gray-400">
            Manage your account settings for {userProfile.data.username}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Profile Info */}
        {userProfile && (
          <div className="bg-[#282C34] rounded-lg p-4 mb-6">
            <h3 className="text-white font-medium mb-3">Current Profile</h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-300">
                <span className="text-gray-400">Username:</span> {userProfile.data.username}
              </p>
              <p className="text-gray-300">
                <span className="text-gray-400">Email:</span> {userProfile.data.email}
              </p>
              <p className="text-gray-300">
                <span className="text-gray-400">Total Matches:</span> {userProfile.data.totalMatches}
              </p>
            </div>
          </div>
        )}

        {/* Change Password */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-gray-400" />
            <h3 className="text-white font-medium">Change Password</h3>
          </div>
          <p className="text-gray-400 text-sm">
            Enter your current password and set a new one to update your credentials.
          </p>
          <Button
            variant="outline"
            className="bg-[#282C34] border-gray-600 text-white hover:bg-[#343841]"
            onClick={() => setIsPasswordModalOpen(true)}
          >
            Change Password
          </Button>
        </div>

        {/* Profile Information */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-gray-400" />
            <h3 className="text-white font-medium">Profile Information</h3>
          </div>
          <p className="text-gray-400 text-sm">Update your username and other profile details.</p>
          <Button
            variant="outline"
            className="bg-[#282C34] border-gray-600 text-white hover:bg-[#343841]"
            onClick={() => setIsProfileModalOpen(true)}
          >
            Edit Profile
          </Button>
        </div>

        {/* Log Out */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <LogOut className="h-5 w-5 text-gray-400" />
            <h3 className="text-white font-medium">Log Out</h3>
          </div>
          <p className="text-gray-400 text-sm">Log out of your account to end your session securely.</p>
          <Button variant="destructive" onClick={handleLogout} disabled={isLogoutLoading}>
            {isLogoutLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Log Out
          </Button>
        </div>

        {/* Delete Account */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-400" />
            <h3 className="text-white font-medium">Delete Account</h3>
          </div>
          <p className="text-gray-400 text-sm">
            Deleting your account will permanently remove all data and cannot be undone.
          </p>
          <Button
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-500/10"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Delete Account
          </Button>
        </div>
      </CardContent>

      {/* Change Password Modal */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="bg-[#1E2127] border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Change Password</DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter your current password and choose a new one.
            </DialogDescription>
          </DialogHeader>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Current Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter current password"
                        className="bg-[#282C34] border-gray-600 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="Newpassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter new password"
                        className="bg-[#282C34] border-gray-600 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm new password"
                        className="bg-[#282C34] border-gray-600 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="border-gray-600 text-gray-300"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPasswordLoading}>
                  {isPasswordLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Password
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Modal */}
      <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
        <DialogContent className="bg-[#1E2127] border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Profile</DialogTitle>
            <DialogDescription className="text-gray-400">Update your profile information.</DialogDescription>
          </DialogHeader>
          <Form {...usernameForm}>
            <form onSubmit={usernameForm.handleSubmit(handleUsernameSubmit)} className="space-y-4">
              <FormField
                control={usernameForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter username"
                        className="bg-[#282C34] border-gray-600 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="border-gray-600 text-gray-300"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUsernameLoading}>
                  {isUsernameLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Account Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="bg-[#1E2127] border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Account</DialogTitle>
            <DialogDescription className="text-gray-400">
              This action cannot be undone. This will permanently delete your account and remove all your data.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-400 text-sm">
              Are you sure you want to delete your account? All your match history, statistics, and profile data will be
              permanently removed.
            </p>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
                className="border-gray-600 text-gray-300"
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteAccount} disabled={isDeleteLoading}>
                {isDeleteLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Delete Account
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
