import { BrowserRouter as Router } from 'react-router-dom'
import RoutesComponent from './Routes'
import Navbar from './components/Navbar'
import { UserProvider } from './contexts/UserContext'

const App = () => {
  return (
    <Router>
      <UserProvider>
        <Navbar />
        <RoutesComponent />
      </UserProvider>
    </Router>
  )
}

export default App
