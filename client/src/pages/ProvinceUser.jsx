import React, { useState, useRef, useEffect } from "react";
import { deleteSpecificUser, getProvinceUserData } from "../../utils/Api";
import { toast } from "sonner";

const ProvinceUser = () => {
  // Tab state management
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingPlace, setEditingPlace] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef(null);

  // State for data
  const [users, setUsers] = useState([]);
  const [places, setPlaces] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

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

  // Templates for new entities
  const newUserTemplate = {
    email: "",
    password: "",
    role: "District User",
    province: "",
    districts: [],
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, this would get the province user's data
        const response = await getProvinceUserData();

        // Get current user information
        setCurrentUser(response.data.user);

        // Filter users to only district users in this province
        const provinceUsers = response.data.users.filter(
          (user) =>
            user.province === response.data.user.province &&
            user.role === "District User"
        );
        setUsers(provinceUsers);

        // Filter places to only those in this province
        const provincePlaces = response.data.places.filter(
          (place) => place.province === response.data.user.province
        );
        setPlaces(provincePlaces);
      } catch (error) {
        console.error("Error fetching province user data:", error);
        toast.error("Failed to load data");
      }
    };

    fetchData();
  }, []);

  // Stats for dashboard
  const getDistrictStats = () => {
    const provinceName = currentUser?.province;
    return provinceName ? nepalData[provinceName].length : 0;
  };

  const getDistrictCoverage = () => {
    if (!currentUser?.province) return 0;

    // Get all districts in the province
    const allDistricts = nepalData[currentUser.province];

    // Get unique districts covered by district users
    const coveredDistricts = new Set();
    users.forEach((user) => {
      user.districts.forEach((district) => {
        coveredDistricts.add(district);
      });
    });

    return Math.round((coveredDistricts.size / allDistricts.length) * 100);
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
    setPlaces(places.filter((place) => place.id !== id));
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
      id: users.length + 1,
      province: currentUser?.province || "",
    });
    setIsAddingUser(true);
    setActiveTab("editUser");
  };

  // Handle user delete
  const handleDeleteUser = async (id) => {
    const deleted = deleteSpecificUser(id);
    toast.promise(deleted, {
      loading: "Deleting user...",
      success: "User deleted successfully",
      error: "Could not delete the user",
    });

    // Optimistic UI update
    setUsers(users.filter((user) => user._id !== id));
  };

  // Handle district selection
  const handleDistrictSelection = (district) => {
    if (editingUser.districts.includes(district)) {
      // Remove district if already selected
      setEditingUser({
        ...editingUser,
        districts: editingUser.districts.filter((d) => d !== district),
      });
    } else {
      // Add district if not already selected
      setEditingUser({
        ...editingUser,
        districts: [...editingUser.districts, district],
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
      setPlaces([...places, editingPlace]);
      toast.success("Place added successfully");
    } else {
      // Update existing place
      setPlaces(
        places.map((place) =>
          place.id === editingPlace.id ? editingPlace : place
        )
      );
      toast.success("Place updated successfully");
    }
    setEditingPlace(null);
    setIsAdding(false);
    setActiveTab("places");
  };

  // Handle user update or add
  const handleSaveUser = () => {
    if (isAddingUser) {
      // Add new user
      setUsers([...users, editingUser]);
      toast.success("User added successfully");
    } else {
      // Update existing user
      setUsers(
        users.map((user) => (user.id === editingUser.id ? editingUser : user))
      );
      toast.success("User updated successfully");
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
          {/* User profile */}
          <div className="flex items-center mt-4 mb-4">
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-xl font-bold text-white">P</span>
            </div>
            <div className="ml-3">
              <p className="font-medium">
                {currentUser?.email || "Province User"}
              </p>
              <p className="text-sm text-gray-500">
                {currentUser?.province || "Province"}
              </p>
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
            <h2 className="text-2xl font-bold mb-6">
              {currentUser?.province || "Province"} Dashboard
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium mb-2">Places</h3>
                <p className="text-3xl font-bold">{places?.length || 0}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Total locations in province
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium mb-2">District Users</h3>
                <p className="text-3xl font-bold">{users?.length || 0}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Total district users
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium mb-2">Districts</h3>
                <p className="text-3xl font-bold">{getDistrictStats()}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Total districts in province
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium mb-4">District Coverage</h3>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                        Coverage
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-blue-600">
                        {getDistrictCoverage()}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                    <div
                      style={{ width: `${getDistrictCoverage()}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500">
                    {getDistrictCoverage() < 100
                      ? "Some districts aren't assigned to any users"
                      : "All districts are assigned to users"}
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium mb-4">
                  District Content Distribution
                </h3>
                <div className="space-y-2">
                  {currentUser?.province &&
                    nepalData[currentUser.province].map((district) => {
                      const placeCount = places.filter(
                        (place) => place.district === district
                      ).length;
                      return (
                        <div
                          key={district}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm">{district}</span>
                          <span className="text-sm font-medium">
                            {placeCount} places
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Management */}
        {activeTab === "users" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">District User Management</h2>
              <button
                onClick={handleAddUser}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                Add New District User
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
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {user.district?.join(", ")}
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
                        onClick={() => handleDeletePlace(place.id)}
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
                  <input
                    type="text"
                    value={currentUser?.province || ""}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  />
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
                      multiple
                    />
                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 mr-2"
                    >
                      Select Files
                    </button>
                    <button
                      onClick={handleImageUpload}
                      className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                    >
                      Upload Demo Image
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
                {isAddingUser ? "Add New District User" : "Edit District User"}
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
                {isAddingUser && (
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
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <svg
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    value="District User"
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Province
                  </label>
                  <input
                    type="text"
                    value={currentUser?.province || ""}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assigned Districts
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
                    {currentUser?.province &&
                      nepalData[currentUser.province].map((district) => (
                        <div key={district} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`district-${district}`}
                            checked={editingUser.districts.includes(district)}
                            onChange={() => handleDistrictSelection(district)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`district-${district}`}
                            className="ml-2 block text-sm text-gray-900"
                          >
                            {district}
                          </label>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSaveUser}
                  className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600"
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
