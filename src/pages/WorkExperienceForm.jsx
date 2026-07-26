import { useState } from 'react'
import api from '../api/axiosConfig'
import { useNavigate } from 'react-router-dom'

function WorkExperienceForm() {
  const [companyName, setCompanyName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const userId = localStorage.getItem('userId')
    try {
      await api.post('/work_experience/create', {
        user: { id: userId },
        companyName,
        jobTitle,
        description,
        startDate,
        endDate: endDate || null,
      })
      navigate('/projects')
    } catch (err) {
      setError('Failed to save work experience. Please try again.')
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Work Experience</h1>
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <label className="block mb-1 text-sm font-medium text-gray-700">Company Name</label>
        <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4" required />

        <label className="block mb-1 text-sm font-medium text-gray-700">Job Title</label>
        <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4" required />

        <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4" required />

        <label className="block mb-1 text-sm font-medium text-gray-700">Start Date</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4" required />

        <label className="block mb-1 text-sm font-medium text-gray-700">End Date (optional)</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-6" />

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Save & Continue
        </button>
      </form>
    </div>
  )
}

export default WorkExperienceForm