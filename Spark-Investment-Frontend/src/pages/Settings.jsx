// src/pages/Settings.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Bell,
  Link as LinkIcon,
  Shield,
  Lock,
  Settings as SettingsIcon,
  Palette,
} from "lucide-react";

// Import Settings Components
import ProfileSettings from "../components/settings/ProfileSettings";
import NotificationSettings from "../components/settings/NotificationSettings";
import PlatformConnections from "../components/settings/PlatformConnections";
import SecuritySettings from "../components/settings/SecuritySettings";
import PreferenceSettings from "../components/settings/PreferenceSettings";
import AppearanceSettings from "../components/settings/AppearanceSettings";
import SafetyControls from "../components/settings/SafetyControls";

// Import Loading and Error components
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { ErrorDisplay } from "../components/ui/ErrorBoundary";

// Import Settings Data
import { availableOptions } from "../data/settingsData";

// Import Settings Hooks
import {
  useProfile,
  useUpdateProfile,
  useNotificationSettings,
  useUpdateNotificationSettings,
  useConnectedAccounts,
  usePreferences,
  useUpdatePreferences,
  useSafetySettings,
  useUpdateSafetySettings,
} from "../hooks/useSettings";

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("safety");

  // Fetch settings data using hooks
  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
  } = useProfile();
  const { data: notifications, isLoading: notificationsLoading } =
    useNotificationSettings();
  const { data: platforms, isLoading: platformsLoading } =
    useConnectedAccounts();
  const { data: preferences, isLoading: preferencesLoading } = usePreferences();
  const { data: safetySettings, isLoading: safetyLoading } =
    useSafetySettings();

  // Mutation hooks
  const updateProfile = useUpdateProfile();
  const updateNotifications = useUpdateNotificationSettings();
  const updatePreferences = useUpdatePreferences();
  const updateSafetySettings = useUpdateSafetySettings();

  // Combine loading states
  const isLoading =
    profileLoading ||
    notificationsLoading ||
    platformsLoading ||
    preferencesLoading ||
    safetyLoading;

  // Tab configuration
  const tabs = [
    { id: "profile", name: "Profile", icon: User, color: "indigo" },
    { id: "notifications", name: "Notifications", icon: Bell, color: "blue" },
    { id: "platforms", name: "Platforms", icon: LinkIcon, color: "green" },
    { id: "safety", name: "Safety Controls", icon: Shield, color: "red" },
    { id: "security", name: "Security", icon: Lock, color: "orange" },
    { id: "preferences", name: "Preferences", icon: SettingsIcon, color: "teal" },
    { id: "appearance", name: "Appearance", icon: Palette, color: "purple" },
  ];

  // Handler functions
  const handleProfileSave = (updatedProfile) => {
    updateProfile.mutate(updatedProfile);
  };

  const handleNotificationsSave = (updatedNotifications) => {
    updateNotifications.mutate(updatedNotifications);
  };

  const handlePlatformConnect = (platformId) => {
    console.log("Connecting platform:", platformId);
    // TODO: Implement platform connection API
  };

  const handlePlatformDisconnect = (platformId) => {
    console.log("Disconnecting platform:", platformId);
    // TODO: Implement platform disconnection API
  };

  const handlePlatformSync = async (platformId) => {
    console.log("Syncing platform:", platformId);
    // TODO: Implement platform sync API
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handlePreferencesSave = (updatedPreferences) => {
    updatePreferences.mutate(updatedPreferences);
  };

  const handleSafetySave = (updatedSafety) => {
    updateSafetySettings.mutate(updatedSafety);
  };

  const handleSecuritySave = (updatedSecurity) => {
    console.log("Security settings updated:", updatedSecurity);
    // TODO: Add security settings API if needed
  };

  const handleAppearanceSave = (updatedAppearance) => {
    console.log("Appearance updated:", updatedAppearance);
    // TODO: Add appearance settings API if needed
  };

  // Render active tab content
  const renderTabContent = () => {
    // Show loading state
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner message="Loading settings..." />
        </div>
      );
    }

    // Show error state
    if (profileError) {
      return (
        <ErrorDisplay
          title="Failed to load settings"
          message="There was an error loading your settings. Please try again."
        />
      );
    }

    switch (activeTab) {
      case "profile":
        return profile ? (
          <ProfileSettings profile={profile} onSave={handleProfileSave} />
        ) : (
          <LoadingSpinner message="Loading profile..." />
        );
      case "notifications":
        return notifications ? (
          <NotificationSettings
            settings={notifications}
            onSave={handleNotificationsSave}
          />
        ) : (
          <LoadingSpinner message="Loading notifications..." />
        );
      case "platforms":
        return platforms ? (
          <PlatformConnections
            platforms={platforms}
            onConnect={handlePlatformConnect}
            onDisconnect={handlePlatformDisconnect}
            onSync={handlePlatformSync}
          />
        ) : (
          <LoadingSpinner message="Loading platforms..." />
        );
      case "security":
        return (
          <SecuritySettings
            settings={{ twoFactorEnabled: false, loginAlerts: true }}
            onSave={handleSecuritySave}
          />
        );
      case "preferences":
        return preferences ? (
          <PreferenceSettings
            settings={preferences}
            availableOptions={availableOptions}
            onSave={handlePreferencesSave}
          />
        ) : (
          <LoadingSpinner message="Loading preferences..." />
        );
      case "appearance":
        return (
          <AppearanceSettings
            settings={{ theme: "light", fontSize: "medium" }}
            onSave={handleAppearanceSave}
          />
        );
      case "safety":
        return safetySettings ? (
          <SafetyControls settings={safetySettings} onSave={handleSafetySave} />
        ) : (
          <LoadingSpinner message="Loading safety settings..." />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-3 min-h-[44px] rounded-lg font-semibold transition-all shadow-md"
          >
            <ArrowLeft size={18} />
            <span>Back to Dashboard</span>
          </button>

          <div className="text-right">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-600">
              Manage your account and preferences
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Mobile Horizontal Tabs - Only visible on mobile */}
          <div className="lg:hidden overflow-x-auto scrollbar-hide relative">
            {/* Scroll Indicator - Right Edge Fade */}
            <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-indigo-50 to-transparent pointer-events-none z-10"></div>
            <div className="flex space-x-2 min-w-max pb-2 px-1">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;

                // Color mapping for active tabs
                const activeColorClasses = {
                  indigo: "bg-indigo-600 text-white",
                  blue: "bg-blue-600 text-white",
                  green: "bg-green-600 text-white",
                  red: "bg-red-600 text-white",
                  teal: "bg-teal-600 text-white",
                  purple: "bg-purple-600 text-white",
                };

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg font-semibold whitespace-nowrap min-h-[44px] transition-all ${
                      isActive
                        ? activeColorClasses[tab.color]
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <IconComponent size={18} />
                    <span className="text-sm">{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desktop Sidebar + Content Layout - Only visible on large screens */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation - Hidden on mobile */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-4 sticky top-6">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    const isActive = activeTab === tab.id;

                    // Color mapping for active tabs
                    const activeColorClasses = {
                      indigo: "bg-indigo-100 text-indigo-700 border-indigo-300",
                      blue: "bg-blue-100 text-blue-700 border-blue-300",
                      green: "bg-green-100 text-green-700 border-green-300",
                      red: "bg-red-100 text-red-700 border-red-300",
                      teal: "bg-teal-100 text-teal-700 border-teal-300",
                      purple: "bg-purple-100 text-purple-700 border-purple-300",
                    };

                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-semibold transition-all ${
                          isActive
                            ? `${activeColorClasses[tab.color]} border-2`
                            : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-transparent"
                        }`}
                      >
                        <IconComponent size={20} />
                        <span>{tab.name}</span>
                      </button>
                    );
                  })}
                </nav>

                {/* User Info Card */}
                {profile ? (
                  <div className="mt-6 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-lg font-bold backdrop-blur-sm">
                        {profile.firstName?.[0] || "U"}
                        {profile.lastName?.[0] || "S"}
                      </div>
                      <div>
                        <p className="font-bold text-sm">
                          {profile.firstName} {profile.lastName}
                        </p>
                        <p className="text-xs text-indigo-100">{profile.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="px-2 py-1 bg-white bg-opacity-20 rounded-full backdrop-blur-sm">
                        ✓ KYC {profile.kycStatus}
                      </span>
                      <span className="px-2 py-1 bg-white bg-opacity-20 rounded-full backdrop-blur-sm">
                        Member since {new Date(profile.memberSince).getFullYear()}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 p-4 bg-gradient-to-r from-gray-400 to-gray-500 rounded-xl text-white">
                    <div className="animate-pulse space-y-2">
                      <div className="h-4 bg-white bg-opacity-20 rounded"></div>
                      <div className="h-3 bg-white bg-opacity-20 rounded w-3/4"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
