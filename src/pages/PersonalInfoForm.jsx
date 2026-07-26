import { useState } from 'react'
import api from '../api/axiosConfig'
import { useNavigate } from 'react-router-dom'

function PersonalInfoForm() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [location, setLocation] = useState('')
  const [linkedInProfile, setLinkedInProfile] = useState('')
  const [gitHubProfile, setGitHubProfile] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const userId = localStorage.getItem('userId')

    try {
      await api.post('/personal_info/create', {
        user: { id: userId },
        fullName,
        email,
        phoneNumber,
        location,
        linkedInProfile,
        gitHubProfile,
      })
      navigate('/education')
    } catch (err) {
      setError('Failed to save personal info. Please try again.')
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Personal Info</h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <label className="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          required
        />

        <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          required
        />

        <label className="block mb-1 text-sm font-medium text-gray-700">Phone Number</label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
        />

        <label className="block mb-1 text-sm font-medium text-gray-700">Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
        />

        <label className="block mb-1 text-sm font-medium text-gray-700">LinkedIn Profile</label>
        <input
          type="text"
          value={linkedInProfile}
          onChange={(e) => setLinkedInProfile(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
        />

        <label className="block mb-1 text-sm font-medium text-gray-700">GitHub Profile</label>
        <input
          type="text"
          value={gitHubProfile}
          onChange={(e) => setGitHubProfile(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-6"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Save & Continue
        </button>
      </form>
    </div>
  )
}

export default PersonalInfoForm