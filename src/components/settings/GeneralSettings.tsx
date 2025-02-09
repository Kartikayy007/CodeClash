export default function GeneralSettings() {
  return (
    <div className="bg-[#1E2127] rounded-lg p-6">
      <h2 className="text-white text-xl mb-6">General Settings</h2>
      
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="text-white mb-1">Language Preference</h3>
              <p className="text-gray-400 text-sm">Select your preferred language for the interface</p>
            </div>
            <select className="bg-[#282C34] text-white px-4 py-2 rounded">
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="text-white mb-1">Notifications</h3>
              <p className="text-gray-400 text-sm">Manage email notifications for updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-[#282C34] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
} 