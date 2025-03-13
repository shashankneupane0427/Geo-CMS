import { Routes, Route } from "react-router-dom";
import Layout from "./layout";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { Toaster } from "sonner";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Routes that should use the Layout */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Route>
    </Routes>
  );
}

export default App;
