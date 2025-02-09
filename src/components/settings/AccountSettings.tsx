export default function AccountSettings() {
  return (
    <div className="bg-[#1E2127] rounded-lg p-6">
      <h2 className="text-white text-xl mb-6">Account Settings</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-white mb-1">Change Password</h3>
          <p className="text-gray-400 text-sm mb-4">Enter your current password and set a new one to update your credentials.</p>
          <button className="text-white bg-[#282C34] px-4 py-2 rounded hover:bg-[#343841]">
            Change Password
          </button>
        </div>

        <div>
          <h3 className="text-white mb-1">Profile Information</h3>
          <p className="text-gray-400 text-sm mb-4">Update your name, email, and contact details to keep your account current.</p>
          <button className="text-white bg-[#282C34] px-4 py-2 rounded hover:bg-[#343841]">
            Edit Profile
          </button>
        </div>

        <div>
          <h3 className="text-white mb-1">Log Out</h3>
          <p className="text-gray-400 text-sm mb-4">Log out of your account to end your session securely.</p>
          <button className="text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600">
            Log Out
          </button>
        </div>

        <div>
          <h3 className="text-white mb-1">Delete Account</h3>
          <p className="text-gray-400 text-sm mb-4">Deleting your account will permanently remove all data and cannot be undone.</p>
          <button className="text-red-500 border border-red-500 px-4 py-2 rounded hover:bg-red-500/10">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
} 