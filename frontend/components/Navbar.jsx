import { Link } from "react-router-dom";
import { logout } from '../auth/auth'
function Navbar(){
    return(
        <nav>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/employs">Employees</Link>
            <Link to="/create">Add Employ</Link>
            <Link to={logout}>Logout</Link>
        </nav>
    )
}
export default Navbar