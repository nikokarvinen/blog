import { BrowserRouter as Router } from "react-router-dom";
import RoutesComponent from "./Routes";
import Navbar from "./components/Navbar";
import { UserProvider } from "./contexts/UserContext";
import "./index.css";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <RoutesComponent />
      </Router>
    </UserProvider>
  );
};

export default App;
