import React, { useState, useRef, useEffect } from "react";
// import { getDistrictUserData } from "../../utils/Api";
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
        // In a real app, this would get the district user's data
        // const response = await getDistrictUserData();

        // Mock data for development
        const mockResponse = {
          data: {
            user: {
              _id: "d123",
              email: "district.user@example.com",
              role: "District User",
              province: "Bagmati Province",
              districts: ["Kathmandu", "Lalitpur"],
            },
            places: [
              {
                _id: "p1",
                id: 1,
                title: "Swayambhunath",
                location: {
                  latitude: "27.7149",
                  longitude: "85.2904",
                },
                district: "Kathmandu",
                province: "Bagmati Province",
                description:
                  "Ancient religious architecture atop a hill in the Kathmandu Valley.",
                images: [
                  "https://res.cloudinary.com/demo/image/upload/v1613720013/samples/landscapes/nature-mountains.jpg",
                ],
              },
              {
                _id: "p2",
                id: 2,
                title: "Patan Durbar Square",
                location: {
                  latitude: "27.6717",
                  longitude: "85.3250",
                },
                district: "Lalitpur",
                province: "Bagmati Province",
                description:
                  "UNESCO World Heritage site with ancient royal palace and Hindu temples.",
                images: [
                  "https://res.cloudinary.com/demo/image/upload/v1582115272/samples/landscapes/architecture-signs.jpg",
                ],
              },
            ],
          },
        };

        const response = mockResponse;

        // Get current user information
        setCurrentUser(response.data.user);

        // Filter places to only those in this district user's assigned districts
        const districtPlaces = response.data.places.filter((place) =>
          response.data.user.districts.includes(place.district)
        );
        setPlaces(districtPlaces);
      } catch (error) {
        console.error("Error fetching district user data:", error);
        toast.error("Failed to load data");
      }
    };

    fetchData();
  }, []);

  // Stats for dashboard
  const getAssignedDistricts = () => {
    return currentUser?.districts || [];
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
    alert("Signing out...");
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

              {getAssignedDistricts()[0] && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-medium mb-2">
                    {getAssignedDistricts()[0]}
                  </h3>
                  <p className="text-3xl font-bold">
                    {getPlaceCountByDistrict(getAssignedDistricts()[0])}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Places in this district
                  </p>
                </div>
              )}
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
                className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 flex items-center"
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

            {places.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {places.map((place) => (
                  <div
                    key={place.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div
                      className="h-48 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${
                          place.images[0] ||
                          "https://res.cloudinary.com/demo/image/upload/v1613720013/samples/landscapes/nature-mountains.jpg"
                        })`,
                      }}
                    ></div>
                    <div className="p-4">
                      <h3 className="text-xl font-medium mb-2">
                        {place.title}
                      </h3>
                      <p className="text-gray-500 text-sm mb-2">
                        {place.district}, {place.province}
                      </p>
                      <p className="text-sm mb-4 line-clamp-3">
                        {place.description}
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditPlace(place)}
                          className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 flex items-center text-sm"
                        >
                          <svg
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePlace(place.id)}
                          className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 flex items-center text-sm"
                        >
                          <svg
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-10 rounded-lg shadow-md text-center">
                <svg
                  className="h-16 w-16 mx-auto text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium">No Places Found</h3>
                <p className="text-gray-500 mt-2">
                  You haven't added any places to your districts yet.
                </p>
                <button
                  onClick={handleAddPlace}
                  className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                  Add Your First Place
                </button>
              </div>
            )}
          </div>
        )}

        {/* Place Edit Form */}
        {activeTab === "editPlace" && editingPlace && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {isAdding ? "Add New Place" : "Edit Place"}
              </h2>
              <button
                onClick={() => {
                  setEditingPlace(null);
                  setActiveTab("places");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="h-5 w-5"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={editingPlace.title}
                    onChange={(e) => handleFieldChange("title", e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Enter place name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Province</label>
                    <select
                      value={editingPlace.province}
                      onChange={(e) =>
                        handleFieldChange("province", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      disabled={currentUser?.province}
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
                    <label className="block text-gray-700 mb-2">District</label>
                    <select
                      value={editingPlace.district}
                      onChange={(e) =>
                        handleFieldChange("district", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      disabled={currentUser?.districts?.length === 1}
                    >
                      <option value="">Select District</option>
                      {currentUser?.districts?.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Latitude</label>
                    <input
                      type="text"
                      value={editingPlace.location.latitude}
                      onChange={(e) =>
                        handleFieldChange("location.latitude", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="e.g. 27.7172"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">
                      Longitude
                    </label>
                    <input
                      type="text"
                      value={editingPlace.location.longitude}
                      onChange={(e) =>
                        handleFieldChange("location.longitude", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="e.g. 85.3240"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editingPlace.description}
                    onChange={(e) =>
                      handleFieldChange("description", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 h-32"
                    placeholder="Describe this place..."
                  ></textarea>
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Images</label>
                  <div className="border border-dashed border-gray-300 rounded-md p-4 text-center">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      className="hidden"
                      multiple
                    />
                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="bg-blue-50 text-blue-500 px-4 py-2 rounded-md hover:bg-blue-100 mb-2"
                    >
                      <svg
                        className="h-5 w-5 inline-block mr-2"
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
                      Select Images
                    </button>
                    <button
                      onClick={handleImageUpload}
                      className="bg-gray-50 text-gray-500 px-4 py-2 rounded-md hover:bg-gray-100 ml-2"
                    >
                      <svg
                        className="h-5 w-5 inline-block mr-2"
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
                      Add Demo Image
                    </button>
                    <p className="text-sm text-gray-500 mt-2">
                      Drag and drop images or click to select
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Preview</label>
                  <div className="grid grid-cols-2 gap-2">
                    {editingPlace.images.length > 0 ? (
                      editingPlace.images.map((img, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={img}
                            alt={`Preview ${index + 1}`}
                            className="h-32 w-full object-cover rounded-md"
                          />
                          <button
                            onClick={() => handleDeleteImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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
                      ))
                    ) : (
                      <div className="col-span-2 p-4 border border-gray-300 rounded-md text-center text-gray-500">
                        No images yet
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => {
                  setEditingPlace(null);
                  setActiveTab("places");
                }}
                className="border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePlace}
                className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
              >
                {isAdding ? "Add Place" : "Save Changes"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DistrictUser;
