export default function GeneralSettings() {
  return (
    <div className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl p-6 backdrop-blur-sm border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">General Settings</h2>
        <p className="text-gray-400 text-sm">Customize your application preferences</p>
      </div>

      <div className="space-y-6">
        <div className="bg-gradient-to-br from-[#23263a] to-[#2a2d3a] rounded-lg p-4 border border-cyan-500/10">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h3 className="text-white font-medium mb-1">Language Preference</h3>
              <p className="text-gray-400 text-sm">
                Select your preferred language for the interface
              </p>
            </div>
            <select className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 px-4 py-2 rounded-lg border border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-200">
              <option value="en" className="bg-[#1a1d26]">English</option>
              <option value="es" className="bg-[#1a1d26]">Spanish</option>
              <option value="fr" className="bg-[#1a1d26]">French</option>
            </select>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#23263a] to-[#2a2d3a] rounded-lg p-4 border border-cyan-500/10">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h3 className="text-white font-medium mb-1">Notifications</h3>
              <p className="text-gray-400 text-sm">
                Manage email notifications for updates
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-blue-500 border border-cyan-500/30"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
