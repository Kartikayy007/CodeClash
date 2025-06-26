interface SettingsSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function SettingsSidebar({
  activeSection,
  setActiveSection,
}: SettingsSidebarProps) {
  const sections = ["General Settings", "Account", "Privacy"];

  return (
    <div className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl p-6 backdrop-blur-sm border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">Settings</h2>
        <p className="text-gray-400 text-sm">Manage your account preferences</p>
      </div>
      
      <div className="space-y-2">
        {sections.map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
              activeSection === section
                ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/25"
                : "text-gray-400 hover:text-cyan-400/80 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20"
            }`}
          >
            {section}
          </button>
        ))}
      </div>
    </div>
  );
}
