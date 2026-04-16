import { Navigate } from 'react-router-dom'
function ProtecedRoute({children}){
    const token =localStorage.getItem("token");
    return token ? children :  <Navigate to="/"/>
}
export default ProtecedRoute