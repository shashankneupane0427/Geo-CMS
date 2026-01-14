import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { register as registerUser } from "../../utils/Api"; // your Axios API

const Register = () => {
  const navigate = useNavigate();

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

  // Zod validation
  const schema = z
    .object({
      email: z.string().email("Invalid email").min(1, "Email required"),
      password: z
        .string()
        .min(8, "At least 8 characters")
        .refine((p) => /[A-Z]/.test(p), "Must include an uppercase letter")
        .refine((p) => /[a-z]/.test(p), "Must include a lowercase letter")
        .refine((p) => /\d/.test(p), "Must include a number")
        .refine((p) => /[!@#$%^&*(),.?":{}|<>]/.test(p), "Must include a special char"),
      confirmPassword: z.string().min(1, "Confirm password required"),
      role: z.enum(["admin", "Province User", "District User"], {
        errorMap: () => ({ message: "Select a role" }),
      }),
      province: z.string().optional(),
      district: z.string().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "Passwords must match",
    })
    .refine((data) => (data.role === "province" ? !!data.province : true), {
      path: ["province"],
      message: "Province required",
    })
    .refine((data) => (data.role === "district" ? !!data.district : true), {
      path: ["district"],
      message: "District required",
    });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
      province: "",
      district: "",
    },
  });

  const watchRole = watch("role");

  const onSubmit = async (data) => {
    const payload = { ...data };
    delete payload.confirmPassword;
    if (payload.role === "admin") {
      delete payload.province;
      delete payload.district;
    } else if (payload.role === "province") {
      delete payload.district;
    } else if (payload.role === "district") {
      delete payload.province;
    }

    try {
      const res = await registerUser(payload);
      toast.success(res.data.message || "Registration successful!");
      navigate("/login"); // redirect to login after success
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message || "Registration failed. Try again!";
      toast.error(msg);
    }
  };

  return (
    <div className="flex h-[80vh] bg-gray-50 pb-12">
      {/* Left illustration */}
      <div className="hidden lg:flex lg:w-1/2 justify-center items-center p-12">
        <img
          src="https://cdni.iconscout.com/illustration/premium/thumb/sign-up-illustration-download-in-svg-png-gif-file-formats--new-user-registering-log-register-form-maggy-pack-design-development-illustrations-4097209.png?f=webp"
          alt="Sign Up"
        />
      </div>

      {/* Right form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md mt-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
            Sign Up
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Enter your details to get started
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                className={`block w-full px-4 py-2 border rounded-md ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                {...register("password")}
                className={`block w-full px-4 py-2 border rounded-md ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                {...register("confirmPassword")}
                className={`block w-full px-4 py-2 border rounded-md ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                {...register("role")}
                className={`block w-full px-4 py-2 border rounded-md ${
                  errors.role ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select a role</option>
                <option value="admin">Admin</option>
                <option value="Province User">Province</option>
                <option value="District User">District</option>
              </select>
              {errors.role && (
                <p className="text-red-600 text-sm mt-1">{errors.role.message}</p>
              )}
            </div>

            {/* Conditional province */}
            {watchRole === "Province User" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Province
                </label>
                <select
                  {...register("province")}
                  className={`block w-full px-4 py-2 border rounded-md ${
                    errors.province ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select a province</option>
                  {provinces.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                {errors.province && (
                  <p className="text-red-600 text-sm mt-1">{errors.province.message}</p>
                )}
              </div>
            )}

            {/* Conditional district */}
            {watchRole === "District User" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  District
                </label>
                <select
                  {...register("district")}
                  className={`block w-full px-4 py-2 border rounded-md ${
                    errors.district ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select a district</option>
                  {districts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                {errors.district && (
                  <p className="text-red-600 text-sm mt-1">{errors.district.message}</p>
                )}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link className="text-blue-600 hover:text-blue-500" to="/login">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
