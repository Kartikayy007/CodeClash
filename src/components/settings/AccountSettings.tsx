import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import LabelButton from '@/components/ui/LabelButton';
import CustomInput from '../CustomInput';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SettingsPasswordFormSchema, SettingsUsernameFormSchema } from '@/lib/schemas/authSchema';
import { Form } from '@/components/ui/form';
import { SettingsPasswordFormData, SettingsUsernameFormData } from '@/features/auth/types/form.types';
import { settingsApi } from '@/features/home/settings/apis/settingsApi';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function AccountSettings() {
  const router = useRouter();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const passwordForm = useForm<SettingsPasswordFormData>({
    resolver: zodResolver(SettingsPasswordFormSchema),
    defaultValues: {
      password: '',
      Newpassword: '',
      confirmPassword: ''
    }
  });

  const usernameForm = useForm<SettingsUsernameFormData>({
    resolver: zodResolver(SettingsUsernameFormSchema),
    defaultValues: {
      username: ''
    }
  });

  const handlePasswordSubmit = async (data: SettingsPasswordFormData) => {
    try {
      await settingsApi.changePassword({
        oldPassword: data.password,
        newPassword: data.Newpassword
      });
      toast.success('Password changed successfully');
      setIsPasswordModalOpen(false);
      passwordForm.reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    }
  };

  const handleUsernameSubmit = async (data: SettingsUsernameFormData) => {
    try {
      await settingsApi.changeUsername({
        username: data.username
      });
      toast.success('Username changed successfully');
      setIsProfileModalOpen(false);
      usernameForm.reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change username');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await settingsApi.deleteAccount();
      toast.success('Account deleted successfully');
      localStorage.removeItem('accessToken');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete account');
    }
  };

  return (
    <div className="bg-[#1E2127] rounded-lg p-6">
      <h2 className="text-white text-xl mb-6">Account Settings</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-white mb-1">Change Password</h3>
          <p className="text-gray-400 text-sm mb-4">Enter your current password and set a new one to update your credentials.</p>
          <button className="text-white bg-[#282C34] px-4 py-2 rounded hover:bg-[#343841]"
          onClick={() => setIsPasswordModalOpen(true)}>
            Change Password
          </button>
        </div>

        <div>
          <h3 className="text-white mb-1">Profile Information</h3>
          <p className="text-gray-400 text-sm mb-4">Update your name, email, and contact details to keep your account current.</p>
          <button className="text-white bg-[#282C34] px-4 py-2 rounded hover:bg-[#343841]"
          onClick={() => setIsProfileModalOpen(true)}>
            Edit Profile
          </button>
        </div>

        <div>
          <h3 className="text-white mb-1">Log Out</h3>
          <p className="text-gray-400 text-sm mb-4">Log out of your account to end your session securely.</p>
          <button 
            className="text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            onClick={() => {
              localStorage.removeItem('accessToken');
              router.push('/login');
            }}
          >
            Log Out
          </button>
        </div>

        <div>
          <h3 className="text-white mb-1">Delete Account</h3>
          <p className="text-gray-400 text-sm mb-4">Deleting your account will permanently remove all data and cannot be undone.</p>
          <button 
            className="text-red-500 border border-red-500 px-4 py-2 rounded hover:bg-red-500/10"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Delete Account
          </button>
        </div>
      </div>

      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Change Password"
      >
        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-6">
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
              <LabelButton type="submit">
                Update Password
              </LabelButton>
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
          <form onSubmit={usernameForm.handleSubmit(handleUsernameSubmit)} className="space-y-6">
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
              <LabelButton type="submit">
                Save Changes
              </LabelButton>
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
            Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data.
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