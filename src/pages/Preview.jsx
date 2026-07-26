import { useState, useEffect, useRef } from 'react'
import html2canvas from 'html2canvas-pro'
import jsPDF from 'jspdf'
import api from '../api/axiosConfig'

function Preview() {
  const [personalInfo, setPersonalInfo] = useState(null)
  const [summary, setSummary] = useState(null)
  const [education, setEducation] = useState([])
  const [skills, setSkills] = useState([])
  const [workExperience, setWorkExperience] = useState([])
  const [projects, setProjects] = useState([])
  const [certifications, setCertifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const resumeRef = useRef()

  useEffect(() => {
    const fetchAll = async () => {
      const userId = localStorage.getItem('userId')
      try {
        const [
          personalInfoRes,
          summaryRes,
          educationRes,
          skillsRes,
          workExperienceRes,
          projectsRes,
          certificationsRes,
        ] = await Promise.all([
          api.get(`/personal_info/user/${userId}`),
          api.get(`/professional_summary/user/${userId}`),
          api.get(`/education/user/${userId}`),
          api.get(`/skill/user/${userId}`),
          api.get(`/work_experience/user/${userId}`),
          api.get(`/project/user/${userId}`),
          api.get(`/certifications/user/${userId}`),
        ])

        setPersonalInfo(personalInfoRes.data)
        setSummary(summaryRes.data)
        setEducation(educationRes.data)
        setSkills(skillsRes.data)
        setWorkExperience(workExperienceRes.data)
        setProjects(projectsRes.data)
        setCertifications(certificationsRes.data)
      } catch (err) {
        setError('Failed to load resume data.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [])

  const handleDownload = async () => {
    const element = resumeRef.current
    if (!element) {
      console.error('resumeRef.current is null')
      return
    }

    try {
      const canvas = await html2canvas(element, { scale: 2 })
      const imgData = canvas.toDataURL('image/jpeg', 0.98)

      const pdf = new jsPDF('p', 'in', 'letter')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()

      const imgWidth = pdfWidth
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
      heightLeft -= pdfHeight

      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
        heightLeft -= pdfHeight
      }

      pdf.save(`${personalInfo?.fullName || 'resume'}.pdf`)
      console.log('PDF generated successfully')
    } catch (err) {
      console.error('PDF generation failed:', err)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-end mb-4">
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Download PDF
          </button>
        </div>

        <div ref={resumeRef} className="bg-white shadow-md rounded-lg p-10">

          {/* Personal Info */}
          {personalInfo && (
            <div className="mb-8 text-center border-b pb-6">
              <h1 className="text-3xl font-bold text-gray-800">{personalInfo.fullName}</h1>
              <p className="text-gray-600 mt-1">
                {personalInfo.email} {personalInfo.phoneNumber && `• ${personalInfo.phoneNumber}`} {personalInfo.location && `• ${personalInfo.location}`}
              </p>
              <p className="text-blue-600 text-sm mt-1">
                {personalInfo.linkedInProfile} {personalInfo.gitHubProfile && `• ${personalInfo.gitHubProfile}`}
              </p>
            </div>
          )}

          {/* Professional Summary */}
          {summary && summary.description && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-2 border-b pb-1">Professional Summary</h2>
              <p className="text-gray-700">{summary.description}</p>
            </div>
          )}

          {/* Work Experience */}
          {workExperience.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-2 border-b pb-1">Work Experience</h2>
              {workExperience.map((exp) => (
                <div key={exp.id} className="mb-4">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-gray-800">{exp.jobTitle} — {exp.companyName}</h3>
                    <span className="text-sm text-gray-500">
                      {exp.startDate} – {exp.endDate || 'Present'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{exp.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-2 border-b pb-1">Education</h2>
              {education.map((edu) => (
                <div key={edu.id} className="mb-4">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-gray-800">{edu.degree} — {edu.institutionName}</h3>
                    <span className="text-sm text-gray-500">
                      {edu.startYear} – {edu.endYear || 'Present'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{edu.field} {edu.grade && `• Grade: ${edu.grade}`}</p>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
{skills.length > 0 && (
  <div className="mb-8">
    <h2 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-1">Skills</h2>
    <div className="flex flex-wrap gap-2.5">
      {skills.map((skill) => (
        <span
          key={skill.id}
          className="inline-flex items-center justify-center bg-blue-50 text-blue-700 border border-blue-200 text-sm font-medium px-4 py-1.5 rounded-md"
        >
          {skill.skillName}
        </span>
      ))}
    </div>
  </div>
)}

          {/* Projects */}
          {projects.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-2 border-b pb-1">Projects</h2>
              {projects.map((proj) => (
                <div key={proj.id} className="mb-4">
                  <h3 className="font-medium text-gray-800">{proj.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{proj.description}</p>
                  <p className="text-gray-500 text-xs mt-1">Tech: {proj.techStack}</p>
                  {proj.projectLink && proj.projectLink !== 'null' && (
                    <a href={proj.projectLink} className="text-blue-600 text-sm underline" target="_blank" rel="noreferrer">
                      {proj.projectLink}
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2 border-b pb-1">Certifications</h2>
              {certifications.map((cert) => (
                <div key={cert.id} className="mb-2">
                  <p className="text-gray-800 font-medium">{cert.certificationName}</p>
                  <p className="text-gray-500 text-sm">{cert.issuedBy} {cert.year && `• ${cert.year}`}</p>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default Preview