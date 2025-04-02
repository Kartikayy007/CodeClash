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
    <div className="space-y-2">
      {sections.map((section) => (
        <button
          key={section}
          onClick={() => setActiveSection(section)}
          className={`block w-full text-left px-4 py-3 rounded ${
            activeSection === section
              ? "bg-[#282C34] text-white"
              : "text-gray-400"
          }`}
        >
          {section}
        </button>
      ))}
    </div>
  );
}
