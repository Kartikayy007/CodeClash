'use client';

import { useState } from 'react';
import NavbarPlain from '@/components/ui/NavbarPlain';
import SettingsSidebar from '@/components/settings/SettingsSidebar';
import GeneralSettings from '@/components/settings/GeneralSettings';
import AccountSettings from '@/components/settings/AccountSettings';
import PrivacySettings from '@/components/settings/PrivacySettings';

type SettingsSection = 'General Settings' | 'Account' | 'Privacy';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('General Settings');

  return (
    <div className="min-h-screen bg-[#15171B]">
      <NavbarPlain />
      <div className="p-8">
        <div className="mb-8">
          <button className="text-white text-lg flex items-center gap-2">
            <span>←</span> Settings
          </button>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-3">
            <SettingsSidebar
              activeSection={activeSection}
              setActiveSection={(section) => setActiveSection(section as SettingsSection)}
            />
          </div>
          <div className="col-span-9 space-y-8">
            {activeSection === 'General Settings' && <GeneralSettings />}
            {activeSection === 'Account' && <AccountSettings />}
            {activeSection === 'Privacy' && <PrivacySettings />}
          </div>
        </div>
      </div>
    </div>
  );
}
