import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Post from "./components/Post";
import Register from "./components/Register";
import Settings from "./components/Settings";

const RoutesComponent = () => {
  return (
    <Routes>
      <Route path="/posts" element={<Post />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/" element={<Navigate to="/posts" />} />
    </Routes>
  );
};

export default RoutesComponent;
