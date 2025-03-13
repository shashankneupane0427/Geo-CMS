import React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { z } from "zod";

const Register = () => {
  const [selectedRole, setSelectedRole] = useState("");

  // Nepal provinces and districts data
  const provinces = [
    "Province 1",
    "Madhesh Province",
    "Bagmati Province",
    "Gandaki Province",
    "Lumbini Province",
    "Karnali Province",
    "Sudurpashchim Province",
  ];

  const districts = [
    "Achham",
    "Arghakhanchi",
    "Baglung",
    "Baitadi",
    "Bajhang",
    "Bajura",
    "Banke",
    "Bara",
    "Bardiya",
    "Bhaktapur",
    "Bhojpur",
    "Chitwan",
    "Dadeldhura",
    "Dailekh",
    "Dang",
    "Darchula",
    "Dhading",
    "Dhankuta",
    "Dhanusa",
    "Dolakha",
    "Dolpa",
    "Doti",
    "Eastern Rukum",
    "Gorkha",
    "Gulmi",
    "Humla",
    "Ilam",
    "Jajarkot",
    "Jhapa",
    "Jumla",
    "Kailali",
    "Kalikot",
    "Kanchanpur",
    "Kapilvastu",
    "Kaski",
    "Kathmandu",
    "Kavrepalanchok",
    "Khotang",
    "Lalitpur",
    "Lamjung",
    "Mahottari",
    "Makwanpur",
    "Manang",
    "Morang",
    "Mugu",
    "Mustang",
    "Myagdi",
    "Nawalparasi East",
    "Nawalparasi West",
    "Nuwakot",
    "Okhaldhunga",
    "Palpa",
    "Panchthar",
    "Parbat",
    "Parsa",
    "Pyuthan",
    "Ramechhap",
    "Rasuwa",
    "Rautahat",
    "Rolpa",
    "Rupandehi",
    "Salyan",
    "Sankhuwasabha",
    "Saptari",
    "Sarlahi",
    "Sindhuli",
    "Sindhupalchok",
    "Siraha",
    "Solukhumbu",
    "Sunsari",
    "Surkhet",
    "Syangja",
    "Tanahun",
    "Taplejung",
    "Terhathum",
    "Udayapur",
    "Western Rukum",
  ];

  // Form validation schema using Zod
  const formSchema = z
    .object({
      email: z
        .string()
        .email("Invalid email address")
        .min(1, "Email is required"),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .refine(
          (password) => /[A-Z]/.test(password),
          "Password must contain at least one uppercase letter"
        )
        .refine(
          (password) => /[a-z]/.test(password),
          "Password must contain at least one lowercase letter"
        )
        .refine(
          (password) => /\d/.test(password),
          "Password must contain at least one number"
        )
        .refine(
          (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
          "Password must contain at least one special character"
        ),
      confirmPassword: z.string().min(1, "Confirm password is required"),
      role: z.enum(["admin", "province", "district"], {
        errorMap: () => ({ message: "Please select a valid role" }),
      }),
      province: z.string().optional(),
      district: z.string().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords must match",
      path: ["confirmPassword"],
    })
    .refine(
      (data) => {
        if (data.role === "province") {
          return !!data.province;
        }
        return true;
      },
      { message: "Province selection is required", path: ["province"] }
    )
    .refine(
      (data) => {
        if (data.role === "district") {
          return !!data.district;
        }
        return true;
      },
      { message: "District selection is required", path: ["district"] }
    );

  // React Hook Form with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
      province: "",
      district: "",
    },
  });

  // Watch for role changes
  const watchRole = watch("role");

  // Update selectedRole when role changes
  useEffect(() => {
    setSelectedRole(watchRole);
  }, [watchRole]);

  // Form submission handler
  const onSubmit = (data) => {
    // Remove unnecessary fields based on role
    const formData = { ...data };
    delete formData.confirmPassword;

    if (formData.role === "admin") {
      delete formData.province;
      delete formData.district;
    } else if (formData.role === "province") {
      delete formData.district;
    } else if (formData.role === "district") {
      delete formData.province;
    }

    console.log("Form submitted:", formData);
    // Here you would typically send the data to your backend
  };

  return (
    <div className="flex h-[80vh] bg-gray-50 pb-12">
      {/* Left side - Logo and text */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 ">
        <div className="mb-8">
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/sign-up-illustration-download-in-svg-png-gif-file-formats--new-user-registering-log-register-form-maggy-pack-design-development-illustrations-4097209.png?f=webp"
            alt=""
          />
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md mt-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Sign Up</h2>
            <p className="text-gray-600 mt-2">
              Enter your details to get started
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className={`block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                className={`block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                className={`block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Role */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Role
              </label>
              <select
                id="role"
                {...register("role")}
                className={`block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.role ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select a role</option>
                <option value="admin">Admin</option>
                <option value="province">Province</option>
                <option value="district">District</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Province selection (conditional) */}
            {selectedRole === "province" && (
              <div>
                <label
                  htmlFor="province"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Select Province
                </label>
                <select
                  id="province"
                  {...register("province")}
                  className={`block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    errors.province ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select a province</option>
                  {provinces.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
                {errors.province && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.province.message}
                  </p>
                )}
              </div>
            )}

            {/* District selection (conditional) */}
            {selectedRole === "district" && (
              <div>
                <label
                  htmlFor="district"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Select District
                </label>
                <select
                  id="district"
                  {...register("district")}
                  className={`block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    errors.district ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select a district</option>
                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
                {errors.district && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.district.message}
                  </p>
                )}
              </div>
            )}

            {/* Submit button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Signing Up..." : "Sign Up"}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
