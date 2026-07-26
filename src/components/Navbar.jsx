import { Link } from 'react-router-dom'

function Navbar() {
  const isLoggedIn = !!localStorage.getItem('token')

  return (
    <nav className="flex gap-6 p-4 bg-gray-100 shadow-sm flex-wrap">
      <Link to="/" className="text-gray-700 font-medium hover:text-blue-600">Home</Link>
      {!isLoggedIn && (
        <>
          <Link to="/login" className="text-gray-700 font-medium hover:text-blue-600">Login</Link>
          <Link to="/register" className="text-gray-700 font-medium hover:text-blue-600">Register</Link>
        </>
      )}
      {isLoggedIn && (
        <>
          <Link to="/personal-info" className="text-gray-700 font-medium hover:text-blue-600">Personal Info</Link>
          <Link to="/education" className="text-gray-700 font-medium hover:text-blue-600">Education</Link>
          <Link to="/skills" className="text-gray-700 font-medium hover:text-blue-600">Skills</Link>
          <Link to="/work-experience" className="text-gray-700 font-medium hover:text-blue-600">Work Experience</Link>
          <Link to="/projects" className="text-gray-700 font-medium hover:text-blue-600">Projects</Link>
          <Link to="/certifications" className="text-gray-700 font-medium hover:text-blue-600">Certifications</Link>
          <Link to="/professional-summary" className="text-gray-700 font-medium hover:text-blue-600">Summary</Link>
          <Link to="/preview" className="text-blue-600 font-semibold hover:text-blue-800">Preview Resume</Link>
        </>
      )}
    </nav>
  )
}

export default Navbar