import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addPlace, updatePlace, uploadImage } from "../../utils/Api"; // You'll need to create this function
import {
  addNewUser,
  deletePlace,
  deleteSpecificUser,
  getAllSuperAdminData,
  UpdateUserData,
} from "../../utils/Api";
import { toast } from "sonner";
import { useAuth } from "../context/AuthorizationContext.jsx";

const SuperAdmin = () => {
  const navigate = useNavigate();
  // Tab state management
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingPlace, setEditingPlace] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef(null);
  const { logout } = useAuth();

  // Nepal provinces and districts data
  const nepalData = {
    "Province 1": [
      "Bhojpur",
      "Dhankuta",
      "Ilam",
      "Jhapa",
      "Khotang",
      "Morang",
      "Okhaldhunga",
      "Panchthar",
      "Sankhuwasabha",
      "Solukhumbu",
      "Sunsari",
      "Taplejung",
      "Terhathum",
      "Udayapur",
    ],
    "Madhesh Province": [
      "Bara",
      "Dhanusha",
      "Mahottari",
      "Parsa",
      "Rautahat",
      "Saptari",
      "Sarlahi",
      "Siraha",
    ],
    "Bagmati Province": [
      "Bhaktapur",
      "Chitwan",
      "Dhading",
      "Dolakha",
      "Kathmandu",
      "Kavrepalanchok",
      "Lalitpur",
      "Makwanpur",
      "Nuwakot",
      "Ramechhap",
      "Rasuwa",
      "Sindhuli",
      "Sindhupalchok",
    ],
    "Gandaki Province": [
      "Baglung",
      "Gorkha",
      "Kaski",
      "Lamjung",
      "Manang",
      "Mustang",
      "Myagdi",
      "Nawalparasi East",
      "Parbat",
      "Syangja",
      "Tanahu",
    ],
    "Lumbini Province": [
      "Arghakhanchi",
      "Banke",
      "Bardiya",
      "Dang",
      "Gulmi",
      "Kapilvastu",
      "Nawalparasi West",
      "Palpa",
      "Pyuthan",
      "Rolpa",
      "Rupandehi",
      "Rukum East",
    ],
    "Karnali Province": [
      "Dailekh",
      "Dolpa",
      "Humla",
      "Jajarkot",
      "Jumla",
      "Kalikot",
      "Mugu",
      "Rukum West",
      "Salyan",
      "Surkhet",
    ],
    "Sudurpashchim Province": [
      "Achham",
      "Baitadi",
      "Bajhang",
      "Bajura",
      "Dadeldhura",
      "Darchula",
      "Doti",
      "Kailali",
      "Kanchanpur",
    ],
  };

  // New user template
  const newUserTemplate = {
    email: "",
    password: "",
    role: "District User",
    province: "",
    districts: [],
  };

  const [users, setUsers] = useState(null);

  const [places, setPlaces] = useState(null);

  useEffect(() => {
    const sendRequest = async () => {
      const response = await getAllSuperAdminData();
      console.log("sending request to backend");
      console.log(response.data.data.users);
      setUsers(response.data.data.users);
      setPlaces(response.data.data.places);
    };
    console.log("calling the function");
    sendRequest();
  }, []);

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
  // User role counts for stats
  const roleStats = users?.reduce((stats, user) => {
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
  const handleDeletePlace = async (id) => {
    console.log(id);
    const deleteIt = deletePlace(id);
    toast.promise(deleteIt, {
      loading: "loading",
      success: "Deleted successfully",
      error: "An error occured",
    });
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

  // Handle user edit
  const handleEditUser = (user) => {
    setEditingUser({ ...user });
    setIsAddingUser(false);
    setActiveTab("editUser");
  };

  // Handle add new user
  const handleAddUser = () => {
    setEditingUser({ ...newUserTemplate, id: users.length + 1 });
    setIsAddingUser(true);
    setActiveTab("editUser");
  };

  // Handle user delete
  const handleDeleteUser = async (id) => {
    const deleted = deleteSpecificUser(id);
    toast.promise(deleted, {
      loading: "loading",
      success: "User deleted Successfully",
      error: "Couldnot delete the user",
    });
  };

  // Check if province already has a province user
  const isProvinceAssigned = (province, userId = null) => {
    return users.some(
      (user) =>
        user.role === "Province User" &&
        user.province === province &&
        (userId === null || user._id !== userId)
    );
  };

  // Handle district selection
  const handleDistrictSelection = (district) => {
    if (editingUser.district.includes(district)) {
      // Remove district if already selected
      setEditingUser({
        ...editingUser,
        district: editingUser.district.filter((d) => d !== district),
      });
    } else {
      // Add district if not already selected
      setEditingUser({
        ...editingUser,
        district: [...editingUser.district, district],
      });
    }
  };

  // Update the handleFileSelect function
  const handleFileSelect = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]; // Just get the first file

      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append("file", file);

      try {
        // Show loading state
        toast.loading("Uploading image...");

        // Call your API endpoint
        const response = await uploadImage(formData);

        // Dismiss loading toast
        toast.dismiss();

        if (response.data && response.data.data) {
          // Add the returned image URL to your place's images array
          setEditingPlace({
            ...editingPlace,
            images: [...editingPlace.images, response.data.data],
          });
          toast.success("Image uploaded successfully");
        }
      } catch (error) {
        toast.dismiss();
        toast.error("Failed to upload image");
        console.error("Image upload error:", error);
      }

      // Reset the file input so the same file can be selected again
      e.target.value = "";
    }
  };

  // Handle image upload
  const handleImageUpload = () => {
    // Simulate Cloudinary upload by adding a demo image
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

  // Handle place update or add
  const handleSavePlace = () => {
    if (isAdding) {
      try {
        const saving = addPlace(editingPlace);
        toast.promise(saving, {
          loading: "loading",
          success: "Added the place Successfully",
          error: "Coulnot add the place",
        });
      } catch (error) {
        console.error("Error updating place:", error);
        toast.error("Failed to update place");
      }
    } else {
      // Update existing place
      try {
        const saving = updatePlace(editingPlace, editingPlace._id);
        toast.promise(saving, {
          loading: "loading",
          success: "Updated the place Successfully",
          error: "Coulnot update the place",
        });
      } catch (error) {
        console.error("Error updating place:", error);
        toast.error("Failed to update place");
      }
    }
    setEditingPlace(null);
    setIsAdding(false);
    setActiveTab("places");
  };

  // Handle user update or add
  const handleSaveUser = async () => {
    if (isAddingUser) {
      console.log(editingUser);
      const sendRequest = addNewUser(editingUser);
      toast.promise(sendRequest, {
        loading: "loading",
        success: "Added the user Successfully",
        error: "Coulnot add the user",
      });
    } else {
      console.log("inside hanldesaveuser");
      const sendRequest = UpdateUserData(editingUser._id, editingUser);
      toast.promise(sendRequest, {
        loading: "loading",
        success: "Updated the user Successfully",
        error: "Coulnot delete the user",
      });
    }
    setEditingUser(null);
    setIsAddingUser(false);
    setActiveTab("users");
  };

  // Handle form field changes for places
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

  // Handle form field changes for users
  const handleUserFieldChange = (field, value) => {
    // Special handling for role changes
    if (field === "role") {
      let updatedUser = { ...editingUser, [field]: value.trim() };

      // Reset districts if changing to Province User or Admin
      if (value === "Province User" || value === "Admin") {
        updatedUser.districts = [];
      }

      // Reset province if changing to Admin
      if (value === "Admin") {
        updatedUser.province = "N/A";
      }

      setEditingUser(updatedUser);
    } else {
      setEditingUser({
        ...editingUser,
        [field]: value,
      });
    }
  };

  // Handle sign out
  const handleSignOut = () => {
    logout();
    // In a real app, this would handle logout logic
    // Typically you would clear session/tokens and redirect to login page
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-gray-200 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Geo CMS</h1>
        </div>
        <div className="mt-4">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full text-left py-2 px-6 ${
              activeTab === "dashboard" ? "bg-gray-300 font-medium" : ""
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`w-full text-left py-2 px-6 ${
              activeTab === "users" ? "bg-gray-300 font-medium" : ""
            }`}
          >
            User Management
          </button>
          <button
            onClick={() => setActiveTab("places")}
            className={`w-full text-left py-2 px-6 ${
              activeTab === "places" ? "bg-gray-300 font-medium" : ""
            }`}
          >
            Place Management
          </button>
        </div>
        <div className="mt-auto p-6">
          {/* Moved user profile to top */}
          <div className="flex items-center mt-4 mb-4">
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
            className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-red-600 flex items-center justify-center mt-2"
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
      <div className="flex-1 overflow-y-auto p-6">
        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium mb-2">Places</h3>
                <p className="text-3xl font-bold">{places?.length}</p>
                <p className="text-sm text-gray-500 mt-2">Total locations</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium mb-2">Users</h3>
                <p className="text-3xl font-bold">{users?.length}</p>
                <p className="text-sm text-gray-500 mt-2">Total users</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium mb-2">Districts</h3>
                <p className="text-3xl font-bold">
                  {Object.values(nepalData).flat().length}
                </p>
                <p className="text-sm text-gray-500 mt-2">Total districts</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">User Distribution</h3>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {roleStats &&
                    Object.entries(roleStats).map(([role, count]) => (
                      <div key={role} className="flex items-center">
                        <div className="h-4 w-4 rounded-full bg-blue-500 mr-2"></div>
                        <span className="text-sm">{role}: </span>
                        <span className="text-sm font-bold ml-1">{count}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Management */}
        {activeTab === "users" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">User Management</h2>
              <button
                onClick={handleAddUser}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                Add New User
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Province
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Districts
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.role}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {user.province}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {user.district.join(" ,")}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Place Management */}
        {activeTab === "places" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Place Management</h2>
              <button
                onClick={handleAddPlace}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                Add New Place
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {places.map((place) => (
                <div
                  key={place._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="relative h-48">
                    <img
                      src={
                        place.images[0] || "https://via.placeholder.com/400x200"
                      }
                      alt={place.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium">{place.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {place.district}, {place.province}
                    </p>
                    <p className="text-sm mt-2 line-clamp-2">
                      {place.description}
                    </p>
                    <div className="flex justify-between mt-4">
                      <button
                        onClick={() => handleEditPlace(place)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePlace(place._id)}
                        className="text-red-600 hover:text-red-900"
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

        {/* Edit Place */}
        {activeTab === "editPlace" && editingPlace && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {isAdding ? "Add New Place" : "Edit Place"}
              </h2>
              <button
                onClick={() => {
                  setEditingPlace(null);
                  setActiveTab("places");
                }}
                className="text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editingPlace.title}
                    onChange={(e) => handleFieldChange("title", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Province
                  </label>
                  <select
                    value={editingPlace.province}
                    onChange={(e) =>
                      handleFieldChange("province", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Province</option>
                    {Object.keys(nepalData).map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    District
                  </label>
                  <select
                    value={editingPlace.district}
                    onChange={(e) =>
                      handleFieldChange("district", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!editingPlace.province}
                  >
                    <option value="">Select District</option>
                    {editingPlace.province &&
                      nepalData[editingPlace.province].map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude
                  </label>
                  <input
                    type="text"
                    value={editingPlace.location.latitude}
                    onChange={(e) =>
                      handleFieldChange("location.latitude", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Longitude
                  </label>
                  <input
                    type="text"
                    value={editingPlace.location.longitude}
                    onChange={(e) =>
                      handleFieldChange("location.longitude", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editingPlace.description}
                    onChange={(e) =>
                      handleFieldChange("description", e.target.value)
                    }
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images
                  </label>
                  <div className="flex flex-wrap gap-4 mb-4">
                    {editingPlace.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Image ${index + 1}`}
                          className="h-24 w-24 object-cover rounded-md"
                        />
                        <button
                          onClick={() => handleDeleteImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      className="hidden"
                      accept="image/*" // Restrict to image files only
                    />
                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                    >
                      Upload Image
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSavePlace}
                  className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit User */}
        {activeTab === "editUser" && editingUser && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {isAddingUser ? "Add New User" : "Edit User"}
              </h2>
              <button
                onClick={() => {
                  setEditingUser(null);
                  setActiveTab("users");
                }}
                className="text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) =>
                      handleUserFieldChange("email", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={editingUser.password}
                      onChange={(e) =>
                        handleUserFieldChange("password", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={editingUser.role}
                    onChange={(e) =>
                      handleUserFieldChange("role", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Province User">Province User</option>
                    <option value="District User">District User</option>
                  </select>
                </div>
                {editingUser.role !== "Admin" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Province
                    </label>
                    <select
                      value={editingUser.province}
                      onChange={(e) =>
                        handleUserFieldChange("province", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Province</option>
                      {Object.keys(nepalData).map((province) => (
                        <option
                          key={province}
                          value={province}
                          disabled={
                            editingUser.role === "Province User" &&
                            isProvinceAssigned(province, editingUser._id)
                          }
                        >
                          {province}{" "}
                          {editingUser.role === "Province User" &&
                          isProvinceAssigned(province, editingUser._id)
                            ? "(Already assigned)"
                            : ""}
                        </option>
                      ))}
                    </select>
                    {editingUser.role === "Province User" && (
                      <p className="mt-1 text-sm text-gray-500">
                        Note: Each province can have only one Province User
                      </p>
                    )}
                  </div>
                )}
                {editingUser.role === "District User" &&
                  editingUser.province && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Districts
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {nepalData[editingUser.province].map((onedistrict) => (
                          <div key={onedistrict} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`district-${onedistrict}`}
                              checked={editingUser?.district?.includes(
                                onedistrict
                              )}
                              onChange={() =>
                                handleDistrictSelection(onedistrict)
                              }
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label
                              htmlFor={`district-${onedistrict}`}
                              className="ml-2 text-sm text-gray-700"
                            >
                              {onedistrict}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => handleSaveUser()}
                  className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600"
                  disabled={
                    editingUser.role === "Province User" &&
                    editingUser.province &&
                    isProvinceAssigned(editingUser.province, editingUser._id)
                  }
                >
                  Save
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
