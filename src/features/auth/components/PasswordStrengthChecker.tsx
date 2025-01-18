import React, { useEffect, useState } from 'react';

const ProgressBar = ({ checks }: { checks: { [key: string]: boolean } }) => {
  const completedChecks = Object.values(checks).filter(Boolean).length;

  const getBarColor = () => {
    if (completedChecks === 4) return 'bg-[#6BBD6F]';
    if (completedChecks > 1) return 'bg-[#FFB74D]';
    return 'bg-[#FF4D4D]';
  };

  const getIncompleteColor = () => {
    if (completedChecks === 0) return 'bg-[#E7E7E7]';
    return 'bg-[#E7E7E7]';
  };

  return (
    <div className="flex gap-1 mb-4">
      <div className={`h-1 flex-1 rounded-full transition-all duration-300 ${completedChecks >= 1 ? getBarColor() : getIncompleteColor()}`} />
      <div className={`h-1 flex-1 rounded-full transition-all duration-300 ${completedChecks >= 2 ? getBarColor() : getIncompleteColor()}`} />
      <div className={`h-1 flex-1 rounded-full transition-all duration-300 ${completedChecks >= 3 ? getBarColor() : getIncompleteColor()}`} />
      <div className={`h-1 flex-1 rounded-full transition-all duration-300 ${completedChecks >= 4 ? getBarColor() : getIncompleteColor()}`} />
    </div>
  );
};

interface PasswordCheckerProps {
  password: string;
}

const PasswordStrengthChecker = ({ password }: PasswordCheckerProps) => {
  const [checks, setChecks] = useState({
    minLength: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecial: false
  });

  useEffect(() => {
    setChecks({
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  }, [password]);

  const completedChecks = Object.values(checks).filter(Boolean).length;
  const shouldShow = password.length > 0 && completedChecks < 4;

  return (
    <div className={`absolute z-10 p-4 sm:p-6 bg-[#282D37] rounded-lg shadow-lg w-full sm:w-[400px] md:w-[450px] lg:w-[500px]
      ${shouldShow 
        ? 'opacity-100 translate-y-0 duration-200 transition-all ease-in'
        : 'opacity-0 -translate-y-4 pointer-events-none duration-1000 transition-all ease-out'
      }`}
    >
      <ProgressBar checks={checks} />
      <h3 className="text-base sm:text-xl text-white mb-2 sm:mb-4 font-[600]">
        {completedChecks < 4 ? 'Weak Password. Must Contain:' : 'Strong Password. Must Contain:'}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-y-4">
        <div className="flex items-center gap-2">
          <span className={`text-sm sm:text-lg ${checks.minLength ? 'text-[#6BBD6F]' : 'text-purple-400'}`}>
            • 8 characters minimum
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm sm:text-lg ${checks.hasSpecial ? 'text-[#6BBD6F]' : 'text-white'}`}>
            • 1 special character
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm sm:text-lg ${checks.hasUppercase ? 'text-[#6BBD6F]' : 'text-white'}`}>
            • 1 uppercase character
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm sm:text-lg ${checks.hasNumber ? 'text-[#6BBD6F]' : 'text-white'}`}>
            • 1 number
          </span>
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthChecker;