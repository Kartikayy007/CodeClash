export default function PrivacySettings() {
  return (
    <div className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl p-6 backdrop-blur-sm border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">Privacy Settings</h2>
        <p className="text-gray-400 text-sm">Control your privacy and data preferences</p>
      </div>

      <div className="space-y-6">
        <div className="bg-gradient-to-br from-[#23263a] to-[#2a2d3a] rounded-lg p-4 border border-cyan-500/10">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-white font-medium mb-1">Profile Visibility</h3>
              <p className="text-gray-400 text-sm">
                Control who can view your profile and activity details
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30 hover:from-cyan-500/30 hover:to-blue-500/30 transition-all duration-200">
                Private
              </button>
              <button className="px-4 py-2 rounded-lg text-gray-400 hover:text-cyan-400/80 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20 transition-all duration-200">
                Public
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#23263a] to-[#2a2d3a] rounded-lg p-4 border border-cyan-500/10">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-white font-medium mb-1">Search Preferences</h3>
              <p className="text-gray-400 text-sm">
                Manage whether others can find you by your email or username
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-blue-500 border border-cyan-500/30"></div>
            </label>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#23263a] to-[#2a2d3a] rounded-lg p-4 border border-cyan-500/10">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-white font-medium mb-1">Device Access</h3>
              <p className="text-gray-400 text-sm">
                Review and manage the devices currently accessing your account.
              </p>
            </div>
            <button className="text-white bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-4 py-2 rounded-lg hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/30 transition-all duration-200 hover:scale-105 shadow-lg shadow-cyan-500/25">
              Manage Devices
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
