import { useState } from 'react'
import api from '../api/axiosConfig'
import { useNavigate } from 'react-router-dom'

function CertificationsForm() {
  const [certificationName, setCertificationName] = useState('')
  const [issuedBy, setIssuedBy] = useState('')
  const [year, setYear] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const userId = localStorage.getItem('userId')
    try {
      await api.post('/certifications/create', {
        user: { id: userId },
        certificationName,
        issuedBy,
        year: year || null,
      })
      navigate('/professional-summary')
    } catch (err) {
      setError('Failed to save certification. Please try again.')
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Certifications</h1>
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <label className="block mb-1 text-sm font-medium text-gray-700">Certification Name</label>
        <input type="text" value={certificationName} onChange={(e) => setCertificationName(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4" required />

        <label className="block mb-1 text-sm font-medium text-gray-700">Issued By</label>
        <input type="text" value={issuedBy} onChange={(e) => setIssuedBy(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4" />

        <label className="block mb-1 text-sm font-medium text-gray-700">Year</label>
        <input type="date" value={year} onChange={(e) => setYear(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-6" />

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Save & Continue
        </button>
      </form>
    </div>
  )
}

export default CertificationsForm