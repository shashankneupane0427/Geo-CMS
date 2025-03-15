import React, { useState, useRef, useEffect } from "react";
import {
  getAllPlaces,
  addPlace,
  updatePlace,
  uploadImage,
} from "../../utils/Api";
import { useAuth } from "../context/AuthorizationContext.jsx";
import { toast } from "sonner";

const DistrictUser = () => {
  // Tab state management
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingPlace, setEditingPlace] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const fileInputRef = useRef(null);

  // State for data
  const [places, setPlaces] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const { user, logout } = useAuth();
  console.log(user.district);
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
  const newPlaceTemplate = {
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
        // Fetch all places
        const response = await getAllPlaces();
        console.log(response.data.data);

        // Get current user information
        setCurrentUser(user);

        // Filter places to only those in this district user's assigned districts
        const districtPlaces = response?.data?.data.filter((place) =>
          user?.district.includes(place?.district)
        );
        console.log(districtPlaces);

        setPlaces(districtPlaces);
      } catch (error) {
        console.error("Error fetching district user data:", error);
        toast.error("Failed to load data");
      }
    };

    fetchData();
  }, [user]); // Add user as a dependency if it's coming from props or context

  // Stats for dashboard
  const getAssignedDistricts = () => {
    return currentUser?.district || [];
  };

  const getPlaceCountByDistrict = (district) => {
    return places.filter((place) => place.district === district).length;
  };

  const getTotalPlacesCount = () => {
    return places.length || 0;
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
      district: currentUser?.districts?.[0] || "", // Pre-select first district if available
    });
    setIsAdding(true);
    setActiveTab("editPlace");
  };

  // Handle place delete
  const handleDeletePlace = (id) => {
    setPlaces(places.filter((place) => place._id !== id));
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

  // Handle sign out
  const handleSignOut = () => {
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
          <p className="text-sm text-gray-600 mt-1">District User Portal</p>
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
            <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
              <span className="text-xl font-bold text-white">D</span>
            </div>
            <div className="ml-3">
              <p className="font-medium">
                {currentUser?.email || "District User"}
              </p>
              <p className="text-sm text-gray-500">
                {currentUser?.districts?.join(", ") || "No Districts Assigned"}
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
            <h2 className="text-2xl font-bold mb-6">District User Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium mb-2">Assigned Districts</h3>
                <p className="text-3xl font-bold">
                  {getAssignedDistricts().length}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Districts under your management
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium mb-2">Total Places</h3>
                <p className="text-3xl font-bold">{getTotalPlacesCount()}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Places across all your districts
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-medium mb-4">District Breakdown</h3>
              {getAssignedDistricts().length > 0 ? (
                <div className="space-y-4">
                  {getAssignedDistricts().map((district) => (
                    <div
                      key={district}
                      className="flex justify-between items-center"
                    >
                      <p className="font-medium">{district}</p>
                      <div className="flex items-center">
                        <div className="h-2 bg-gray-200 rounded-full w-48 mr-4">
                          <div
                            className="h-2 bg-blue-500 rounded-full"
                            style={{
                              width: `${
                                (getPlaceCountByDistrict(district) /
                                  Math.max(1, getTotalPlacesCount())) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <p>{getPlaceCountByDistrict(district)} places</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No districts assigned</p>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setActiveTab("places")}
                  className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 flex items-center justify-center"
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
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Manage Places
                </button>
                <button
                  onClick={handleAddPlace}
                  className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 flex items-center justify-center"
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add New Place
                </button>
              </div>
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
                    value={currentUser?.province}
                    onChange={(e) =>
                      handleFieldChange("province", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Province</option>
                    <option
                      key={currentUser?.province}
                      value={currentUser?.province}
                    >
                      {currentUser?.province}
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
                    {user?.district.map((district) => (
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
      </div>
    </div>
  );
};

export default DistrictUser;
