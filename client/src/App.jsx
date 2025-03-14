import { Routes, Route } from "react-router-dom";
import Layout from "./layout";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { Toaster } from "sonner";

import SuperAdmin from "./pages/SuperAdmin";
import ProvinceUser from "./pages/ProvinceUser";
import DistrictUser from "./pages/DistrictUser";
import AuthorizationContext from "./context/AuthorizationContext";
import PrivateRoute from "./pages/PrivateRoute";

function App() {
  return (
    <AuthorizationContext>
      <Routes>
        <Route element={<Layout />}>
          {/* Routes that should use the Layout */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/superadmin"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <SuperAdmin />
              </PrivateRoute>
            }
          />

          <Route
            path="/provinceuser"
            element={
              <PrivateRoute allowedRoles={["Province User"]}>
                <ProvinceUser />
              </PrivateRoute>
            }
          />

          <Route
            path="/districtuser"
            element={
              <PrivateRoute allowedRoles={["District User"]}>
                <DistrictUser />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </AuthorizationContext>
  );
}

export default App;
