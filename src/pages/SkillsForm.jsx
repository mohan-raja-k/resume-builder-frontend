import { useState } from 'react'
import api from '../api/axiosConfig'
import { useNavigate } from 'react-router-dom'

function SkillsForm() {
  const [skillsInput, setSkillsInput] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const userId = localStorage.getItem('userId')

    const skillNames = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)

    if (skillNames.length === 0) {
      setError('Please enter at least one skill.')
      return
    }

    try {
      for (const skillName of skillNames) {
        await api.post('/skill/create', {
          user: { id: userId },
          skillName,
        })
      }
      navigate('/work-experience')
    } catch (err) {
      setError('Failed to save skills. Please try again.')
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Skills</h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <label className="block mb-1 text-sm font-medium text-gray-700">
          Skills (comma-separated)
        </label>
        <textarea
          value={skillsInput}
          onChange={(e) => setSkillsInput(e.target.value)}
          placeholder="React, Java, Spring Boot, MySQL"
          rows={4}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-6"
          required
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

export default SkillsForm