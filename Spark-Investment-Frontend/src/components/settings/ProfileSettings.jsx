// src/components/settings/ProfileSettings.jsx

import { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit2, Save, X } from 'lucide-react';

const ProfileSettings = ({ profile, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localProfile, setLocalProfile] = useState(profile);

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setLocalProfile({
        ...localProfile,
        [parent]: { ...localProfile[parent], [child]: value },
      });
    } else {
      setLocalProfile({ ...localProfile, [field]: value });
    }
  };

  const handleSave = () => {
    onSave(localProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalProfile(profile);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
            <User className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Profile Information</h3>
            <p className="text-sm text-gray-600">Manage your personal information</p>
          </div>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition-all"
          >
            <Edit2 size={16} />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-semibold transition-all"
            >
              <X size={16} />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-all"
            >
              <Save size={16} />
              <span>Save</span>
            </button>
          </div>
        )}
      </div>

      {/* Profile Picture */}
      <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-100">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {localProfile.firstName[0]}
            {localProfile.lastName[0]}
          </div>
          <div className="flex-1">
            <h4 className="text-2xl font-bold text-gray-900">
              {localProfile.firstName} {localProfile.lastName}
            </h4>
            <p className="text-gray-600">{localProfile.email}</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center space-x-1">
                <Shield size={12} />
                <span>KYC {localProfile.kycStatus}</span>
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                Member since {new Date(localProfile.memberSince).getFullYear()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-100">
        <h4 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              value={localProfile.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              disabled={!isEditing}
              className={`w-full px-4 py-2 border-2 rounded-lg ${
                isEditing
                  ? 'border-gray-200 focus:border-indigo-500 focus:outline-none'
                  : 'border-gray-100 bg-gray-50'
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              value={localProfile.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              disabled={!isEditing}
              className={`w-full px-4 py-2 border-2 rounded-lg ${
                isEditing
                  ? 'border-gray-200 focus:border-indigo-500 focus:outline-none'
                  : 'border-gray-100 bg-gray-50'
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
              <Mail size={14} />
              <span>Email</span>
            </label>
            <input
              type="email"
              value={localProfile.email}
              onChange={(e) => handleChange('email', e.target.value)}
              disabled={!isEditing}
              className={`w-full px-4 py-2 border-2 rounded-lg ${
                isEditing
                  ? 'border-gray-200 focus:border-indigo-500 focus:outline-none'
                  : 'border-gray-100 bg-gray-50'
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
              <Phone size={14} />
              <span>Phone</span>
            </label>
            <input
              type="tel"
              value={localProfile.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              disabled={!isEditing}
              className={`w-full px-4 py-2 border-2 rounded-lg ${
                isEditing
                  ? 'border-gray-200 focus:border-indigo-500 focus:outline-none'
                  : 'border-gray-100 bg-gray-50'
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
              <Calendar size={14} />
              <span>Date of Birth</span>
            </label>
            <input
              type="date"
              value={localProfile.dateOfBirth}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              disabled={!isEditing}
              className={`w-full px-4 py-2 border-2 rounded-lg ${
                isEditing
                  ? 'border-gray-200 focus:border-indigo-500 focus:outline-none'
                  : 'border-gray-100 bg-gray-50'
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <select
              value={localProfile.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              disabled={!isEditing}
              className={`w-full px-4 py-2 border-2 rounded-lg ${
                isEditing
                  ? 'border-gray-200 focus:border-indigo-500 focus:outline-none'
                  : 'border-gray-100 bg-gray-50'
              }`}
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
              <option>Prefer not to say</option>
            </select>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-100">
        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <MapPin className="text-indigo-600" size={20} />
          <span>Address</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
            <input
              type="text"
              value={localProfile.address.street}
              onChange={(e) => handleChange('address.street', e.target.value)}
              disabled={!isEditing}
              className={`w-full px-4 py-2 border-2 rounded-lg ${
                isEditing
                  ? 'border-gray-200 focus:border-indigo-500 focus:outline-none'
                  : 'border-gray-100 bg-gray-50'
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input
              type="text"
              value={localProfile.address.city}
              onChange={(e) => handleChange('address.city', e.target.value)}
              disabled={!isEditing}
              className={`w-full px-4 py-2 border-2 rounded-lg ${
                isEditing
                  ? 'border-gray-200 focus:border-indigo-500 focus:outline-none'
                  : 'border-gray-100 bg-gray-50'
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            <input
              type="text"
              value={localProfile.address.state}
              onChange={(e) => handleChange('address.state', e.target.value)}
              disabled={!isEditing}
              className={`w-full px-4 py-2 border-2 rounded-lg ${
                isEditing
                  ? 'border-gray-200 focus:border-indigo-500 focus:outline-none'
                  : 'border-gray-100 bg-gray-50'
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
            <input
              type="text"
              value={localProfile.address.pincode}
              onChange={(e) => handleChange('address.pincode', e.target.value)}
              disabled={!isEditing}
              className={`w-full px-4 py-2 border-2 rounded-lg ${
                isEditing
                  ? 'border-gray-200 focus:border-indigo-500 focus:outline-none'
                  : 'border-gray-100 bg-gray-50'
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
            <input
              type="text"
              value={localProfile.address.country}
              onChange={(e) => handleChange('address.country', e.target.value)}
              disabled={!isEditing}
              className={`w-full px-4 py-2 border-2 rounded-lg ${
                isEditing
                  ? 'border-gray-200 focus:border-indigo-500 focus:outline-none'
                  : 'border-gray-100 bg-gray-50'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-100">
        <h4 className="text-lg font-bold text-gray-900 mb-4">Additional Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number</label>
            <input
              type="text"
              value={localProfile.pan}
              disabled
              className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg bg-gray-50"
            />
            <p className="text-xs text-gray-500 mt-1">PAN cannot be changed</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Annual Income</label>
            <select
              value={localProfile.annualIncome}
              onChange={(e) => handleChange('annualIncome', e.target.value)}
              disabled={!isEditing}
              className={`w-full px-4 py-2 border-2 rounded-lg ${
                isEditing
                  ? 'border-gray-200 focus:border-indigo-500 focus:outline-none'
                  : 'border-gray-100 bg-gray-50'
              }`}
            >
              <option>Below ¹5,00,000</option>
              <option>¹5,00,000 - ¹8,00,000</option>
              <option>¹8,00,000 - ¹12,00,000</option>
              <option>¹12,00,000 - ¹18,00,000</option>
              <option>¹18,00,000 - ¹25,00,000</option>
              <option>Above ¹25,00,000</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Risk Profile</label>
            <select
              value={localProfile.riskProfile}
              onChange={(e) => handleChange('riskProfile', e.target.value)}
              disabled={!isEditing}
              className={`w-full px-4 py-2 border-2 rounded-lg ${
                isEditing
                  ? 'border-gray-200 focus:border-indigo-500 focus:outline-none'
                  : 'border-gray-100 bg-gray-50'
              }`}
            >
              <option>Conservative</option>
              <option>Moderate</option>
              <option>Aggressive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
            <input
              type="text"
              value={localProfile.nationality}
              onChange={(e) => handleChange('nationality', e.target.value)}
              disabled={!isEditing}
              className={`w-full px-4 py-2 border-2 rounded-lg ${
                isEditing
                  ? 'border-gray-200 focus:border-indigo-500 focus:outline-none'
                  : 'border-gray-100 bg-gray-50'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
