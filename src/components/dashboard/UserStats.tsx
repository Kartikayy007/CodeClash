import React, { useEffect, useState } from 'react';
import Image from 'next/image';

export default function UserStats() {
  const [userProfile, setUserProfile] = useState<any>(null); // State for user profile data

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('accessToken'); // Adjust the key as necessary

      if (!token) {
        console.error('No access token found in local storage');
        return;
      }

      try {
        const response = await fetch('https://goyalshivansh.me/api/v1/user/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched user profile data:', data.data); // Log the full response

        if (data.success) {
          console.log('Setting user profile:'); // Log the user data before setting
          setUserProfile(data);
          
        } else {
          console.error('Failed to fetch user profile:', data);
          setUserProfile(null); // Reset state on failure
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setUserProfile(null); // Reset state on error
      }
      console.log('name:',userProfile.username)
    };

    fetchUserProfile();
  }, []);

  // Log the userProfile whenever it changes
  useEffect(() => {
    console.log('User profile updated:', userProfile);
  }, [userProfile]);

  return (
    <div className="relative bg-gradient-to-r from-[#1a1d26] to-[#1e222c] rounded-lg p-6">
      

      {userProfile && (
        <div className="">
          <h2 className="text-lg font-semibold mb-4">User Profile</h2>
          <div className="text-white">
            <p><strong>Username :</strong> {userProfile.data.username}</p>
            <p><strong>Email :</strong> {userProfile.data.email}</p>
            <p><strong>Highest Streak :</strong> {userProfile.data.maxWinStreak}</p>
            <p><strong>Losses :</strong> {userProfile.data.losses}</p>
            <p><strong>Total Matches :</strong> {userProfile.data.totalMatches}</p>
          </div>
        </div>
      )}
    </div>
  );
}