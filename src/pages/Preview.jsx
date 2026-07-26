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

  const containerRef = useRef()

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
    if (!containerRef.current) {
      console.error('containerRef.current is null')
      return
    }

    const container = containerRef.current
    const originalWidth = container.style.width
    const originalMaxWidth = container.style.maxWidth

    try {
      await document.fonts.ready

      container.style.width = '800px'
      container.style.maxWidth = '800px'
      window.scrollTo(0, 0)
      await new Promise((resolve) => setTimeout(resolve, 200))

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        windowWidth: container.scrollWidth,
        windowHeight: container.scrollHeight,
      })

      const pdf = new jsPDF('p', 'in', 'letter')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 0.5
      const usableWidth = pageWidth - margin * 2
      const usableHeight = pageHeight - margin * 2

      const pxPerInch = canvas.width / usableWidth
      const pageHeightPx = Math.floor(usableHeight * pxPerInch)

      let renderedHeight = 0
      let pageNum = 0

      while (renderedHeight < canvas.height) {
        const sliceHeight = Math.min(pageHeightPx, canvas.height - renderedHeight)

        const pageCanvas = document.createElement('canvas')
        pageCanvas.width = canvas.width
        pageCanvas.height = sliceHeight
        const ctx = pageCanvas.getContext('2d')
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height)
        ctx.drawImage(
          canvas,
          0, renderedHeight, canvas.width, sliceHeight,
          0, 0, canvas.width, sliceHeight
        )

        const imgData = pageCanvas.toDataURL('image/jpeg', 0.98)
        const imgHeightIn = sliceHeight / pxPerInch

        if (pageNum > 0) pdf.addPage()
        pdf.addImage(imgData, 'JPEG', margin, margin, usableWidth, imgHeightIn)

        renderedHeight += sliceHeight
        pageNum++
      }

      pdf.save(`${personalInfo?.fullName || 'resume'}.pdf`)
      console.log('PDF generated successfully')
    } catch (err) {
      console.error('PDF generation failed:', err)
    } finally {
      container.style.width = originalWidth
      container.style.maxWidth = originalMaxWidth
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

        <div ref={containerRef} className="bg-white shadow-md rounded-lg p-10">

          {personalInfo && (
            <div className="mb-6 text-center pb-5 border-b-2 border-gray-800">
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-wide break-words uppercase">
                {personalInfo.fullName}
              </h1>
              <p className="text-gray-600 mt-2 break-words">
                {personalInfo.email}{' '}
                {personalInfo.phoneNumber && `• ${personalInfo.phoneNumber}`}{' '}
                {personalInfo.location && `• ${personalInfo.location}`}
              </p>
              <p className="text-blue-600 text-sm mt-1 break-words">
                {personalInfo.linkedInProfile}{' '}
                {personalInfo.gitHubProfile && `• ${personalInfo.gitHubProfile}`}
              </p>
            </div>
          )}

          {summary && summary.description && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 pb-1 mb-3 border-b border-gray-400">
                Professional Summary
              </h2>
              <p className="text-gray-700 break-words leading-relaxed">{summary.description}</p>
            </div>
          )}

          {workExperience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 pb-1 mb-3 border-b border-gray-400">
                Work Experience
              </h2>
              {workExperience.map((exp) => (
                <div key={exp.id} className="mb-4">
                  <div className="flex justify-between flex-wrap gap-x-2">
                    <h3 className="font-semibold text-gray-800 break-words">
                      {exp.jobTitle} — {exp.companyName}
                    </h3>
                    <span className="text-sm text-gray-500 whitespace-nowrap">
                      {exp.startDate} – {exp.endDate || 'Present'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1 break-words leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 pb-1 mb-3 border-b border-gray-400">
                Education
              </h2>
              {education.map((edu) => (
                <div key={edu.id} className="mb-4">
                  <div className="flex justify-between flex-wrap gap-x-2">
                    <h3 className="font-semibold text-gray-800 break-words">
                      {edu.degree} — {edu.institutionName}
                    </h3>
                    <span className="text-sm text-gray-500 whitespace-nowrap">
                      {edu.startYear} – {edu.endYear || 'Present'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1 break-words">
                    {edu.field} {edu.grade && `• Grade: ${edu.grade}`}
                  </p>
                </div>
              ))}
            </div>
          )}

          {skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 pb-1 mb-3 border-b border-gray-400">
                Skills
              </h2>
              <div className="flex flex-wrap">
                {skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="inline-flex items-center justify-center bg-blue-50 text-blue-700 border border-blue-200 text-sm font-semibold px-4 py-1.5 rounded-lg mr-2.5 mb-2.5 break-words max-w-full"
                  >
                    {skill.skillName}
                  </span>
                ))}
              </div>
            </div>
          )}

          {projects.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 pb-1 mb-3 border-b border-gray-400">
                Projects
              </h2>
              {projects.map((proj) => (
                <div key={proj.id} className="mb-4">
                  <h3 className="font-semibold text-gray-800 break-words">{proj.title}</h3>
                  <p className="text-gray-600 text-sm mt-1 break-words leading-relaxed">
                    {proj.description}
                  </p>
                  <p className="text-gray-500 text-xs mt-1 break-words">Tech: {proj.techStack}</p>
                  {proj.projectLink && proj.projectLink !== 'null' && (
                    
                      href={proj.projectLink}
                      className="text-blue-600 text-sm mt-1 inline-block break-words"
                      style={{ textDecoration: 'underline' }}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {proj.projectLink}
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {certifications.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 pb-1 mb-3 border-b border-gray-400">
                Certifications
              </h2>
              {certifications.map((cert) => (
                <div key={cert.id} className="mb-3">
                  <p className="text-gray-800 font-semibold break-words">{cert.certificationName}</p>
                  <p className="text-gray-500 text-sm break-words">
                    {cert.issuedBy} {cert.year && `• ${cert.year}`}
                  </p>
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