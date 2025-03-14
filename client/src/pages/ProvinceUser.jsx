import React, { useState, useRef, useEffect } from "react";
import {
  getProvinceUserData,
  UpdateUserData,
  deleteSpecificUser,
  addNewUser,
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
  const { user } = useAuth();

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

  // Fetch data on component mount
  useEffect(() => {
    setCurrentUser(user);
    const fetchData = async () => {
      try {
        const response = await getProvinceUserData();
        if (response?.data?.data) {
          setUsers(response.data.data);
          // Filter users based on province
          filterUsersByProvince(response.data.data, user?.province);
        }
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
    setPlaces(places.filter((place) => place._id !== id));
    // Also update filtered places
    setFilteredPlaces(filteredPlaces.filter((place) => place._id !== id));
    toast.success("Place deleted successfully");
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
      // Call the API to delete the user
      await deleteSpecificUser(id); // Replace with your actual API call
      // Optimistic UI update
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
      // Also update filtered users
      setFilteredUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== id)
      );
      toast.success("User deleted successfully");
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
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          // Demo images for simulation
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

  // Demo image upload
  const handleImageUpload = () => {
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
      // Add new place
      const newPlace = { ...editingPlace, province: currentUser?.province };
      setPlaces([...places, newPlace]);
      setFilteredPlaces([...filteredPlaces, newPlace]);
      toast.success("Place added successfully");
    } else {
      // Update existing place
      const updatedPlaces = places.map((place) =>
        place._id === editingPlace._id ? editingPlace : place
      );
      setPlaces(updatedPlaces);

      // Update filtered places
      const updatedFilteredPlaces = filteredPlaces.map((place) =>
        place._id === editingPlace._id ? editingPlace : place
      );
      setFilteredPlaces(updatedFilteredPlaces);

      toast.success("Place updated successfully");
    }
    setEditingPlace(null);
    setIsAdding(false);
    setActiveTab("places");
  };

  // Handle user update or add
  const handleSaveUser = () => {
    // Ensure province is set
    console.log(editingUser);
    const userWithProvince = {
      ...editingUser,
      province: currentUser?.province,
    };

    if (isAddingUser) {
      // Add new user
      console.log(editingUser);
      const added = addNewUser(userWithProvince);

      toast.promise(added, {
        loading: "loading",
        success: "User Added successfully",
        error: "An error occured",
      });
    } else {
      // Update existing user

      const updated = UpdateUserData(userWithProvince._id, userWithProvince);
      toast.promise(updated, {
        loading: "loading",
        success: "User updated successfully",
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
  const handleSignOut = () => {
    // In a real app, this would handle logout logic
    alert("Signing out...");
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

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium">District Coverage</h3>
                <p className="text-3xl font-bold mt-2">
                  {getDistrictCoverage()}%
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  district with assigned users
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow col-span-1 md:col-span-3">
                <h3 className="text-lg font-medium mb-4">Places by District</h3>
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
                  <p className="text-gray-500">
                    Chart will be displayed here showing place distribution
                  </p>
                </div>
              </div>
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
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
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

        {/* Places Tab */}
        {activeTab === "places" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Place Management</h2>
              <button
                onClick={handleAddPlace}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Add New Place
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
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      District
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Images
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
                  {filteredPlaces.map((place) => (
                    <tr key={place._id || place.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {place.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {place.district}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {place.images?.length || 0} image(s)
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditPlace(place)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDeletePlace(place._id || place.id)
                          }
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredPlaces.length === 0 && (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No places found. Add a new place to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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

        {/* Edit Place Tab */}
        {activeTab === "editPlace" && editingPlace && (
          <div>
            <h2 className="text-2xl font-bold mb-6">
              {isAdding ? "Add New Place" : "Edit Place"}
            </h2>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={editingPlace.title}
                  onChange={(e) => handleFieldChange("title", e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Place title"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    District
                  </label>
                  <select
                    value={editingPlace.district}
                    onChange={(e) =>
                      handleFieldChange("district", e.target.value)
                    }
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select District</option>
                    {currentUser?.province &&
                      nepalData[currentUser.province].map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Province
                  </label>
                  <input
                    type="text"
                    value={currentUser?.province || ""}
                    disabled
                    className="w-full p-2 border rounded bg-gray-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Latitude
                  </label>
                  <input
                    type="text"
                    value={editingPlace.location.latitude}
                    onChange={(e) =>
                      handleFieldChange("location.latitude", e.target.value)
                    }
                    className="w-full p-2 border rounded"
                    placeholder="Latitude (e.g., 27.7172)"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Longitude
                  </label>
                  <input
                    type="text"
                    value={editingPlace.location.longitude}
                    onChange={(e) =>
                      handleFieldChange("location.longitude", e.target.value)
                    }
                    className="w-full p-2 border rounded"
                    placeholder="Longitude (e.g., 85.3240)"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <textarea
                  value={editingPlace.description}
                  onChange={(e) =>
                    handleFieldChange("description", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                  rows="4"
                  placeholder="Describe this place..."
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Images
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                  {editingPlace.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Place image ${index + 1}`}
                        className="w-full h-32 object-cover rounded"
                      />
                      <button
                        onClick={() => handleDeleteImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
                  >
                    Select Images
                  </button>
                  <button
                    onClick={handleImageUpload}
                    className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
                  >
                    Add Demo Image
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    setEditingPlace(null);
                    setActiveTab("places");
                  }}
                  className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePlace}
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
