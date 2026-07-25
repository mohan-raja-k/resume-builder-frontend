import { Link } from 'react-router-dom'

   function Navbar() {
     return (
       <nav className="flex gap-6 p-4 bg-gray-100 shadow-sm">
         <Link to="/" className="text-gray-700 font-medium hover:text-blue-600">
           Home
         </Link>
         <Link to="/login" className="text-gray-700 font-medium hover:text-blue-600">
           Login
         </Link>
         <Link to="/register" className="text-gray-700 font-medium hover:text-blue-600">
           Register
         </Link>
       </nav>
     )
   }

   export default Navbar