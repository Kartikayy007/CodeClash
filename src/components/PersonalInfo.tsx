// components/PersonalInfo.tsx
interface PersonalInfoProps {
    email: string;
    phone: string;
  }
  
  const PersonalInfo: React.FC<PersonalInfoProps> = ({ email, phone }) => {
    return (
      <div>
        <h3 className="text-white text-xl mb-6">Personal Information</h3>
        <div className="space-y-4">
          <p className="text-gray-400 text-lg flex items-center gap-3">
            <span className="text-xl">✉</span> {email}
          </p>
          <p className="text-gray-400 text-lg flex items-center gap-3">
            <span className="text-xl">📱</span> {phone}
          </p>
        </div>
      </div>
    );
  };
  
  export default PersonalInfo;
  