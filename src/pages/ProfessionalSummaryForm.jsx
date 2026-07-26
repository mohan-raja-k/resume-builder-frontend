import { useState } from 'react'
import api from '../api/axiosConfig'
import { useNavigate } from 'react-router-dom'

function ProfessionalSummaryForm() {
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const userId = localStorage.getItem('userId')
    try {
      await api.post('/professional_summary/create', {
        user: { id: userId },
        description,
      })
      navigate('/preview')
    } catch (err) {
      setError('Failed to save summary. Please try again.')
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Professional Summary</h1>
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <label className="block mb-1 text-sm font-medium text-gray-700">Summary</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5}
          placeholder="Brief overview of your background and goals..."
          className="w-full border border-gray-300 rounded px-3 py-2 mb-6" required />

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Save & Finish
        </button>
      </form>
    </div>
  )
}

export default ProfessionalSummaryForm