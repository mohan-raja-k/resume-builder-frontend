import { useState } from 'react'
import api from '../api/axiosConfig'
import { useNavigate } from 'react-router-dom'

function EducationForm() {
  const [institutionName, setInstitutionName] = useState('')
  const [degree, setDegree] = useState('')
  const [field, setField] = useState('')
  const [startYear, setStartYear] = useState('')
  const [endYear, setEndYear] = useState('')
  const [grade, setGrade] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const userId = localStorage.getItem('userId')

    try {
      await api.post('/education/create', {
        user: { id: userId },
        institutionName,
        degree,
        field,
        startYear,
        endYear: endYear || null,
        grade,
      })
      navigate('/skills')
    } catch (err) {
      setError('Failed to save education. Please try again.')
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Education</h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <label className="block mb-1 text-sm font-medium text-gray-700">Institution Name</label>
        <input
          type="text"
          value={institutionName}
          onChange={(e) => setInstitutionName(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          required
        />

        <label className="block mb-1 text-sm font-medium text-gray-700">Degree</label>
        <input
          type="text"
          value={degree}
          onChange={(e) => setDegree(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          required
        />

        <label className="block mb-1 text-sm font-medium text-gray-700">Field of Study</label>
        <input
          type="text"
          value={field}
          onChange={(e) => setField(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          required
        />

        <label className="block mb-1 text-sm font-medium text-gray-700">Start Date</label>
        <input
          type="date"
          value={startYear}
          onChange={(e) => setStartYear(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          required
        />

        <label className="block mb-1 text-sm font-medium text-gray-700">End Date (optional)</label>
        <input
          type="date"
          value={endYear}
          onChange={(e) => setEndYear(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
        />

        <label className="block mb-1 text-sm font-medium text-gray-700">Grade/CGPA</label>
        <input
          type="text"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
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

export default EducationForm