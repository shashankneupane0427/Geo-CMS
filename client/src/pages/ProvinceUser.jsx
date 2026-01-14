import React, { useState, useRef, useEffect } from "react";
import {
  getProvinceUserData,
  UpdateUserData,
  deleteSpecificUser,
  addNewUser,
} from "../../utils/Api";
import {
  addPlace,
  updatePlace,
  uploadImage,
  getAllPlaces,
  deletePlace,
} from "../../utils/Api";

import { toast } from "sonner";
import { useAuth } from "../context/AuthorizationContext.jsx";

const ProvinceUser = () => {
  // Tab state management
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingPlace, setEditingPlace] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef(null);
  const { user, logout } = useAuth();

  // State for data
  const [users, setUsers] = useState([]);
  const [places, setPlaces] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);

  // Nepal provinces and district data
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

  // Templates for new entities
  const newUserTemplate = {
    email: "",
    password: "",
    role: "District User",
    province: "",
    district: [],
  };

  const newPlaceTemplate = {
    title: "",
    location: {
      latitude: "",
      longitude: "",
    },
    district: user.district,
    province: "",
    description: "",
    images: [],
  };

  // Fetch data on component mount
  useEffect(() => {
    setCurrentUser(user);
    const fetchData = async () => {
      try {
        const response = await getProvinceUserData();
        const responsePlace = await getAllPlaces();
        if (response?.data?.data) {
          setUsers(response.data.data);
          // Filter users based on province
          filterUsersByProvince(response.data.data, user?.province);
        }
        // console.log(responsePlace);
        const tempFilteredPlaces = responsePlace.data.data.filter(
          (place) => place.province === user?.province
        );
        setFilteredPlaces(tempFilteredPlaces);
        setPlaces(tempFilteredPlaces);
      } catch (error) {
        console.error("Error fetching province user data:", error);
        toast.error("Failed to load data");
      }
    };

    fetchData();
  }, [user]); // Add `user` as a dependency

  // Filter users based on province
  const filterUsersByProvince = (allUsers, province) => {
    if (!province || !allUsers) return;

    const filtered = allUsers.filter((user) => user.province === province);
    setFilteredUsers(filtered);
  };

  // Filter places based on province
  useEffect(() => {
    if (!currentUser?.province || !places) return;

    const filtered = places.filter(
      (place) => place.province === currentUser.province
    );
    setFilteredPlaces(filtered);
  }, [places, currentUser]);

  // Stats for dashboard
  const getdistricttats = () => {
    const provinceName = currentUser?.province;
    return provinceName ? nepalData[provinceName].length : 0;
  };

  const getDistrictCoverage = () => {
    if (!currentUser?.province) return 0;

    // Get all district in the province
    const alldistrict = nepalData[currentUser.province];

    // Get unique district covered by district users
    const covereddistrict = new Set();
    filteredUsers.forEach((user) => {
      if (user.district) {
        user.district.forEach((district) => {
          covereddistrict.add(district);
        });
      }
    });

    return Math.round((covereddistrict.size / alldistrict.length) * 100);
  };

  // Handle place edit
  const handleEditPlace = (place) => {
    setEditingPlace({ ...place });
    setIsAdding(false);
    setActiveTab("editPlace");
  };

  // Handle add new place
  const handleAddPlace = () => {
    setEditingPlace({
      ...newPlaceTemplate,
      id: places.length + 1,
      province: currentUser?.province || "",
    });
    setIsAdding(true);
    setActiveTab("editPlace");
  };

  // Handle place delete
  const handleDeletePlace = (id) => {
    try {
      const response = deletePlace(id);
      toast.promise(response, {
        loading: "Deleting place...",
        success: async () => {
          setPlaces((prevPlaces) =>
            prevPlaces.filter((place) => place._id !== id)
          );
          setFilteredPlaces((prevPlaces) =>
            prevPlaces.filter((place) => place._id !== id)
          );
          return "Place deleted successfully";
        },
        error: "Failed to delete place",
      });
    } catch (error) {
      return new Error("Error deleting place:", error);
    }
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
    setEditingUser({
      ...newUserTemplate,
      province: currentUser?.province || "",
    });
    setIsAddingUser(true);
    setActiveTab("editUser");
  };

  // Handle user delete
  const handleDeleteUser = async (id) => {
    try {
      const response = deleteSpecificUser(id);
      toast.promise(response, {
        loading: "Deleting user...",
        success: async () => {
          const response = await getProvinceUserData();
          if (response?.data?.data) {
            setUsers(response.data.data);
            // Filter users based on province
            filterUsersByProvince(response.data.data, user?.province);
          }
          return "User deleted successfully";
        },
        error: "Failed to delete user",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Could not delete the user");
    }
  };

  // Handle district selection
  const handledistrictelection = (district) => {
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

  // Handle file selection from device
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

  // Handle place update or add
  const handleSavePlace = () => {
    if (isAdding) {
      try {
        const saving = addPlace(editingPlace);
        toast.promise(saving, {
          loading: "loading",
          success: async () => {
            const response = await getAllPlaces();
            const tempFilteredPlaces = response.data.data.filter(
              (place) => place.province === user?.province
            );
            setFilteredPlaces(tempFilteredPlaces);
            setPlaces(tempFilteredPlaces);
            return "Added the place Successfully";
          },
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
          success: async () => {
            const response = await getAllPlaces();
            const tempFilteredPlaces = response.data.data.filter(
              (place) => place.province === user?.province
            );
            setFilteredPlaces(tempFilteredPlaces);
            setPlaces(tempFilteredPlaces);
            return "Updated the place Successfully";
          },
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
  const handleSaveUser = () => {
    // Ensure province is set
    // console.log(editingUser);
    const userWithProvince = {
      ...editingUser,
      province: currentUser?.province,
    };

    if (isAddingUser) {
      // Add new user
      // console.log(editingUser);
      const added = addNewUser(userWithProvince);

      toast.promise(added, {
        loading: "loading",
        success: async () => {
          const response = await getProvinceUserData();
          if (response?.data?.data) {
            setUsers(response.data.data);
            // Filter users based on province
            filterUsersByProvince(response.data.data, user?.province);
          }
          return "User added successfully";
        },
        error: "An error occured",
      });
    } else {
      // Update existing user

      const updated = UpdateUserData(userWithProvince._id, userWithProvince);
      toast.promise(updated, {
        loading: "loading",
        success: async () => {
          const response = await getProvinceUserData();
          if (response?.data?.data) {
            setUsers(response.data.data);
            // Filter users based on province
            filterUsersByProvince(response.data.data, user?.province);
          }
          return "User updated successfully";
        },
        error: "An error occured",
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
    setEditingUser({
      ...editingUser,
      [field]: value,
    });
  };

  // Handle sign out
  const handleSignOut = async () => {
    // In a real app, this would handle logout logic
    logout();
    // Typically you would clear session/tokens and redirect to login page
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-gray-200 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Geo CMS</h1>
          <p className="text-sm text-gray-600 mt-1">
            {currentUser?.province || "Province"} Portal
          </p>
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
            District User Management
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
          <button
            onClick={handleSignOut}
            className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium">district</h3>
                <p className="text-3xl font-bold mt-2">{getdistricttats()}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Total district in province
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium">District Users</h3>
                <p className="text-3xl font-bold mt-2">
                  {filteredUsers.length}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Active district users
                </p>
              </div>

              {/* <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium">District Coverage</h3>
                <p className="text-3xl font-bold mt-2">
                  {getDistrictCoverage()}%
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  district with assigned users
                </p>
              </div> */}

              {/* <div className="bg-white p-6 rounded-lg shadow col-span-1 md:col-span-3">
                <h3 className="text-lg font-medium mb-4">Places by District</h3>
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
                  <p className="text-gray-500">
                    Chart will be displayed here showing place distribution
                  </p>
                </div>
              </div> */}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">District User Management</h2>
              <button
                onClick={handleAddUser}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Add New User
              </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      district
                    </th>

                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user._id || user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {user.district ? user.district.join(", ") : "None"}
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
                          onClick={() => handleDeleteUser(user._id || user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No users found. Add a new district user to get started.
                      </td>
                    </tr>
                  )}
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
                    value={user?.province}
                    onChange={(e) =>
                      handleFieldChange("province", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Province</option>
                    <option key={user?.province} value={user?.province}>
                      {user?.province}
                    </option>
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
                    type="number"
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
                    type="number"
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
        {/* Edit User Tab */}
        {activeTab === "editUser" && editingUser && (
          <div>
            <h2 className="text-2xl font-bold mb-6">
              {isAddingUser ? "Add New User" : "Edit User"}
            </h2>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) =>
                    handleUserFieldChange("email", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                  placeholder="user@example.com"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={editingUser.password}
                    onChange={(e) =>
                      handleUserFieldChange("password", e.target.value)
                    }
                    className="w-full p-2 border rounded"
                    placeholder={
                      isAddingUser
                        ? "Enter password"
                        : "Leave blank to keep current"
                    }
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Assigned district
                </label>
                <div className="bg-gray-50 p-4 rounded border grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {currentUser?.province &&
                    nepalData[currentUser.province].map((district) => (
                      <div key={district} className="flex items-center">
                        <input
                          type="checkbox"
                          id={district}
                          checked={
                            editingUser.district?.includes(district) || false
                          }
                          onChange={() => handledistrictelection(district)}
                          className="mr-2"
                        />
                        <label htmlFor={district} className="text-sm">
                          {district}
                        </label>
                      </div>
                    ))}
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    setEditingUser(null);
                    setActiveTab("users");
                  }}
                  className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveUser}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
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

export default ProvinceUser;
