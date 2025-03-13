import React, { useState, useRef } from "react";

const SuperAdmin = () => {
  // Tab state management
  const [activeTab, setActiveTab] = useState("users");
  const [editingPlace, setEditingPlace] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const fileInputRef = useRef(null);

  // Dummy user data with district and province fields
  const users = [
    {
      id: 1,
      email: "admin@geo.com",
      role: "Admin",
      district: "N/A",
      province: "N/A",
    },
    {
      id: 2,
      email: "editor@geo.com",
      role: "Province User",
      district: "N/A",
      province: "Bagmati Province",
    },
    {
      id: 3,
      email: "user1@geo.com",
      role: "District User",
      district: "Kathmandu",
      province: "Bagmati Province",
    },
    {
      id: 4,
      email: "user2@geo.com",
      role: "District User",
      district: "Pokhara",
      province: "Gandaki Province",
    },
    {
      id: 5,
      email: "manager@geo.com",
      role: "Province User",
      district: "N/A",
      province: "Province 1",
    },
  ];

  // Initial place template for adding new location
  const newPlaceTemplate = {
    id: null,
    title: "",
    location: {
      latitude: "",
      longitude: "",
    },
    district: "",
    province: "",
    description: "",
    images: [],
  };

  // Dummy place data
  const [places, setPlaces] = useState([
    {
      id: 1,
      title: "Taplejung",
      location: {
        latitude: "27.3538",
        longitude: "87.6698",
      },
      district: "Taplejung",
      province: "Province 1",
      description: "Eastern mountain district of Nepal",
      images: [
        "https://res.cloudinary.com/demo/image/upload/v1613720013/samples/landscapes/nature-mountains.jpg",
      ],
    },
    {
      id: 2,
      title: "Kathmandu",
      location: {
        latitude: "27.7172",
        longitude: "85.3240",
      },
      district: "Kathmandu",
      province: "Bagmati Province",
      description: "Capital city of Nepal",
      images: [
        "https://res.cloudinary.com/demo/image/upload/v1582115272/samples/landscapes/architecture-signs.jpg",
      ],
    },
    {
      id: 3,
      title: "Pokhara",
      location: {
        latitude: "28.2096",
        longitude: "83.9856",
      },
      district: "Kaski",
      province: "Gandaki Province",
      description: "Tourist destination known for lakes and mountains",
      images: [
        "https://res.cloudinary.com/demo/image/upload/v1613720013/samples/landscapes/beach-boat.jpg",
      ],
    },
  ]);

  // User role counts for stats
  const roleStats = users.reduce((stats, user) => {
    stats[user.role] = (stats[user.role] || 0) + 1;
    return stats;
  }, {});

  // Handle place edit
  const handleEditPlace = (place) => {
    setEditingPlace({ ...place });
    setIsAdding(false);
    setActiveTab("editPlace");
  };

  // Handle add new place
  const handleAddPlace = () => {
    setEditingPlace({ ...newPlaceTemplate, id: places.length + 1 });
    setIsAdding(true);
    setActiveTab("editPlace");
  };

  // Handle place delete
  const handleDeletePlace = (id) => {
    setPlaces(places.filter((place) => place.id !== id));
  };

  // Handle image delete
  const handleDeleteImage = (index) => {
    const updatedImages = [...editingPlace.images];
    updatedImages.splice(index, 1);
    setEditingPlace({
      ...editingPlace,
      images: updatedImages,
    });
  };

  // Handle file selection from device
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      // In a real app, this would upload the file to Cloudinary
      // For demo, we'll create an object URL and pretend it's a Cloudinary URL
      const files = Array.from(e.target.files);

      // Normally, you would upload these files to Cloudinary here
      // This is a simplified simulation for the demo
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          // In a real implementation, you would:
          // 1. Send the file to your backend
          // 2. Backend uploads to Cloudinary
          // 3. Get back the Cloudinary URL
          // 4. Update state with that URL

          // For this demo, we'll simulate by using a fake Cloudinary URL
          const demoImages = [
            "https://res.cloudinary.com/demo/image/upload/v1613720013/samples/landscapes/nature-mountains.jpg",
            "https://res.cloudinary.com/demo/image/upload/v1582115272/samples/landscapes/architecture-signs.jpg",
            "https://res.cloudinary.com/demo/image/upload/v1613720013/samples/landscapes/beach-boat.jpg",
            "https://res.cloudinary.com/demo/image/upload/v1573055869/samples/landscapes/girl-urban-view.jpg",
            "https://res.cloudinary.com/demo/image/upload/v1572271059/samples/landscapes/nature-mountain.jpg",
          ];

          const randomImage =
            demoImages[Math.floor(Math.random() * demoImages.length)];

          setEditingPlace({
            ...editingPlace,
            images: [...editingPlace.images, randomImage],
          });
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Handle place update or add
  const handleSavePlace = () => {
    if (isAdding) {
      // Add new place
      setPlaces([...places, editingPlace]);
    } else {
      // Update existing place
      setPlaces(
        places.map((place) =>
          place.id === editingPlace.id ? editingPlace : place
        )
      );
    }
    setEditingPlace(null);
    setIsAdding(false);
    setActiveTab("places");
  };

  // Handle form field changes
  const handleFieldChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setEditingPlace({
        ...editingPlace,
        [parent]: {
          ...editingPlace[parent],
          [child]: value,
        },
      });
    } else {
      setEditingPlace({
        ...editingPlace,
        [field]: value,
      });
    }
  };

  // Handle sign out
  const handleSignOut = () => {
    // In a real app, this would handle logout logic
    alert("Signing out...");
    // Typically you would clear session/tokens and redirect to login page
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-200 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <nav className="mt-6 flex-grow">
          <div
            className={`px-6 py-3 cursor-pointer ${
              activeTab === "users" ? "bg-gray-300" : "hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("users")}
          >
            <span className="flex items-center">
              <svg
                className="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              User Management
            </span>
          </div>
          <div
            className={`px-6 py-3 cursor-pointer ${
              activeTab === "places" || activeTab === "editPlace"
                ? "bg-gray-300"
                : "hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("places")}
          >
            <span className="flex items-center">
              <svg
                className="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Location Management
            </span>
          </div>
        </nav>
        <div className="p-6 border-t border-gray-300">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 rounded-full bg-red-400 flex items-center justify-center">
              <span className="text-xl font-bold text-white">A</span>
            </div>
            <div className="ml-3">
              <p className="font-medium">Admin User</p>
              <p className="text-sm text-gray-500">Super Admin</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-red-600 flex items-center justify-center"
          >
            <svg
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "users" && (
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">User Management</h2>

            {/* User Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-indigo-100 text-indigo-500">
                    <svg
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-500">Total Users</p>
                    <p className="text-2xl font-bold">{users.length}</p>
                  </div>
                </div>
              </div>

              {Object.entries(roleStats).map(([role, count], index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div
                      className={`p-3 rounded-full ${
                        role === "Admin"
                          ? "bg-red-100 text-red-500"
                          : role === "Province User"
                          ? "bg-green-100 text-green-500"
                          : role === "District User"
                          ? "bg-yellow-100 text-yellow-500"
                          : "bg-blue-100 text-blue-500"
                      }`}
                    >
                      <svg
                        className="h-8 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-gray-500">{role}s</p>
                      <p className="text-2xl font-bold">{count}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* User Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      District
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Province
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">
                        {user.id}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === "Admin"
                              ? "bg-red-100 text-red-800"
                              : user.role === "Province User"
                              ? "bg-green-100 text-green-800"
                              : user.role === "District User"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500">
                        {user.district}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500">
                        {user.province}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "places" && (
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Location Management</h2>
              <button
                onClick={handleAddPlace}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Location
              </button>
            </div>

            {/* Places Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {places.map((place) => (
                <div
                  key={place.id}
                  className="bg-white rounded-lg shadow overflow-hidden"
                >
                  {place.images && place.images.length > 0 && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={place.images[0]}
                        alt={place.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {place.title}
                    </h3>
                    <div className="mb-4">
                      <span className="px-2 py-1 text-xs font-semibold rounded bg-indigo-100 text-indigo-800 mr-2">
                        {place.district}
                      </span>
                      <span className="px-2 py-1 text-xs font-semibold rounded bg-purple-100 text-purple-800">
                        {place.province}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      {place.description}
                    </p>
                    <div className="text-sm text-gray-500 mb-4">
                      <p>Latitude: {place.location.latitude}</p>
                      <p>Longitude: {place.location.longitude}</p>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleEditPlace(place)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePlace(place.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "editPlace" && editingPlace && (
          <div className="p-8">
            <div className="flex items-center mb-6">
              <button
                onClick={() => {
                  setActiveTab("places");
                  setEditingPlace(null);
                  setIsAdding(false);
                }}
                className="mr-4"
              >
                <svg
                  className="h-6 w-6 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
              <h2 className="text-2xl font-bold">
                {isAdding ? "Add New Location" : "Edit Location"}
              </h2>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editingPlace.title}
                    onChange={(e) => handleFieldChange("title", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter location title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    District
                  </label>
                  <input
                    type="text"
                    value={editingPlace.district}
                    onChange={(e) =>
                      handleFieldChange("district", e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter district name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Province
                  </label>
                  <input
                    type="text"
                    value={editingPlace.province}
                    onChange={(e) =>
                      handleFieldChange("province", e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter province name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude
                  </label>
                  <input
                    type="text"
                    value={editingPlace.location.latitude}
                    onChange={(e) =>
                      handleFieldChange("location.latitude", e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. 27.3538"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude
                </label>
                <input
                  type="text"
                  value={editingPlace.location.longitude}
                  onChange={(e) =>
                    handleFieldChange("location.longitude", e.target.value)
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. 87.6698"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={editingPlace.description}
                  onChange={(e) =>
                    handleFieldChange("description", e.target.value)
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows="4"
                  placeholder="Enter location description"
                ></textarea>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Images
                </label>
                <div className="flex items-center mb-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                  />
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 flex items-center mr-3"
                  >
                    <svg
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Select Images from Device
                  </button>
                  <button
                    onClick={() => handleImageUpload()}
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center"
                  >
                    <svg
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    Demo Upload to Cloudinary
                  </button>
                  <p className="ml-3 text-sm text-gray-500">
                    {editingPlace.images && editingPlace.images.length > 0
                      ? `${editingPlace.images.length} image(s) uploaded`
                      : "No images uploaded yet"}
                  </p>
                </div>

                {/* Image Gallery */}
                {editingPlace.images && editingPlace.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {editingPlace.images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <button
                          onClick={() => handleDeleteImage(index)}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setActiveTab("places");
                    setEditingPlace(null);
                    setIsAdding(false);
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePlace}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  {isAdding ? "Add Location" : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdmin;
