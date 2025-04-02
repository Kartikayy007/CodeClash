export default function PrivacySettings() {
  return (
    <div className="bg-[#1E2127] rounded-lg p-6">
      <h2 className="text-white text-xl mb-6">Privacy Settings</h2>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-white mb-1">Profile Visibility</h3>
              <p className="text-gray-400 text-sm">
                Control who can view your profile and activity details
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded bg-[#282C34] text-white">
                Private
              </button>
              <button className="px-4 py-2 rounded text-gray-400">
                Public
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-white mb-1">Search Preferences</h3>
              <p className="text-gray-400 text-sm">
                Manage whether others can find you by your email or username
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-[#282C34] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
            </label>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-white mb-1">Device Access</h3>
              <p className="text-gray-400 text-sm">
                Review and manage the devices currently accessing your account.
              </p>
            </div>
            <button className="text-white bg-[#282C34] px-4 py-2 rounded hover:bg-[#343841]">
              Manage Devices
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
