import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { setErrorMap, z } from "zod";
import { login } from "../../utils/Api";
import { toast } from "sonner";
import { useAuth } from "../context/AuthorizationContext";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const navigate = useNavigate();
  const { loginForContext } = useAuth();
  const formSchema = z.object({
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
    password: z.string().min(1, "Password is required"),
  });

  const [response, setResponse] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const redirectBasedOnRole = (role) => {
    switch (role) {
      case "admin":
        navigate("/superadmin");
        break;
      case "Province User":
        navigate("/provinceuser");
        break;
      case "District User":
        navigate("/districtuser");
        break;
      default:
        navigate("/");
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const serverResponse = await login(data);
      setResponse(serverResponse);

      toast.success("Logged in successfully");
      loginForContext(serverResponse.data.user);

      redirectBasedOnRole(serverResponse.data.user.role);

      // login(response);
    } catch (err) {
      if (err.response) {
        setErrMsg(err.response.data.message);
      } else {
        setErrMsg("something went wrong please try agian later!");
      }
    }
  };

  useEffect(() => {
    if (errMsg && errMsg.trim()) {
      toast.error(errMsg);
      setErrMsg("");
    }
  }, [errMsg]);

  return (
    <div className="flex h-[80vh] bg-gray-50 pb-12">
      {/* Left side - Logo and text */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 ">
        <div className="mb-8">
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/sign-up-illustration-download-in-svg-png-gif-file-formats--log-register-form-user-interface-pack-design-development-illustrations-6430773.png?f=webp"
            alt="Login illustration"
          />
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md mt-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-600 mt-2">
              Enter your credentials to Login to your account
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

            {/* Submit button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full cursor-pointer px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Logging In..." : "Log In"}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
