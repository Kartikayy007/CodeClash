import React, { useEffect, useState } from "react";

interface UserProfile {
  data: {
    username: string;
    email: string;
    maxWinStreak: number;
    losses: number;
    totalMatches: number;
  };
}

const ShimmerEffect = () => (
  <div className="animate-pulse">
    <div className="h-6 w-32 bg-gray-700 rounded mb-4"></div>
    <div className="space-y-3">
      <div className="h-4 w-full bg-gray-700 rounded"></div>
      <div className="h-4 w-full bg-gray-700 rounded"></div>
      <div className="h-4 w-full bg-gray-700 rounded"></div>
      <div className="h-4 w-full bg-gray-700 rounded"></div>
      <div className="h-4 w-full bg-gray-700 rounded"></div>
    </div>
  </div>
);

export default function UserStats() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        console.error("No access token found in local storage");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "https://goyalshivansh.me/api/v1/user/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched user profile data:", data.data);

        if (data.success) {
          console.log("Setting user profile:");
          setUserProfile(data);
        } else {
          console.error("Failed to fetch user profile:", data);
          setUserProfile(null);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUserProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Log the userProfile whenever it changes
  useEffect(() => {
    console.log("User profile updated:", userProfile);
  }, [userProfile]);

  return (
    <div className="relative bg-gradient-to-r from-[#1a1d26] to-[#1e222c] rounded-lg p-6">
      {isLoading ? (
        <ShimmerEffect />
      ) : (
        userProfile && (
          <div className="">
            <h2 className="text-lg font-semibold mb-4">User Profile</h2>
            <div className="text-white">
              <p>
                <strong>Username :</strong> {userProfile.data.username}
              </p>
              <p>
                <strong>Email :</strong> {userProfile.data.email}
              </p>
              <p>
                <strong>Highest Streak :</strong>{" "}
                {userProfile.data.maxWinStreak}
              </p>
              <p>
                <strong>Losses :</strong> {userProfile.data.losses}
              </p>
              <p>
                <strong>Total Matches :</strong> {userProfile.data.totalMatches}
              </p>
            </div>
          </div>
        )
      )}
    </div>
  );
}
