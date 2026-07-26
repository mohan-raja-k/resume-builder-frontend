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
            <div style={{ marginBottom: '24px', textAlign: 'center', paddingBottom: '20px', borderBottom: '2px solid #1f2937' }}>
              <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111827', letterSpacing: '0.05em', textTransform: 'uppercase', wordBreak: 'break-word' }}>
                {personalInfo.fullName}
              </h1>
              <p style={{ color: '#4b5563', marginTop: '8px', wordBreak: 'break-word' }}>
                {personalInfo.email}{' '}
                {personalInfo.phoneNumber && `• ${personalInfo.phoneNumber}`}{' '}
                {personalInfo.location && `• ${personalInfo.location}`}
              </p>
              <p style={{ color: '#2563eb', fontSize: '14px', marginTop: '4px', wordBreak: 'break-word' }}>
                {personalInfo.linkedInProfile}{' '}
                {personalInfo.gitHubProfile && `• ${personalInfo.gitHubProfile}`}
              </p>
            </div>
          )}

          {summary && summary.description && (
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', paddingBottom: '4px', marginBottom: '12px', borderBottom: '1px solid #9ca3af' }}>
                Professional Summary
              </h2>
              <p style={{ color: '#374151', wordBreak: 'break-word', lineHeight: 1.6 }}>{summary.description}</p>
            </div>
          )}

          {workExperience.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', paddingBottom: '4px', marginBottom: '12px', borderBottom: '1px solid #9ca3af' }}>
                Work Experience
              </h2>
              {workExperience.map((exp) => (
                <div key={exp.id} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0 8px' }}>
                    <h3 style={{ fontWeight: 600, color: '#1f2937', wordBreak: 'break-word' }}>
                      {exp.jobTitle} — {exp.companyName}
                    </h3>
                    <span style={{ fontSize: '14px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                      {exp.startDate} – {exp.endDate || 'Present'}
                    </span>
                  </div>
                  <p style={{ color: '#4b5563', fontSize: '14px', marginTop: '4px', wordBreak: 'break-word', lineHeight: 1.6 }}>
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {education.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', paddingBottom: '4px', marginBottom: '12px', borderBottom: '1px solid #9ca3af' }}>
                Education
              </h2>
              {education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0 8px' }}>
                    <h3 style={{ fontWeight: 600, color: '#1f2937', wordBreak: 'break-word' }}>
                      {edu.degree} — {edu.institutionName}
                    </h3>
                    <span style={{ fontSize: '14px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                      {edu.startYear} – {edu.endYear || 'Present'}
                    </span>
                  </div>
                  <p style={{ color: '#4b5563', fontSize: '14px', marginTop: '4px', wordBreak: 'break-word' }}>
                    {edu.field} {edu.grade && `• Grade: ${edu.grade}`}
                  </p>
                </div>
              ))}
            </div>
          )}

          {skills.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', paddingBottom: '4px', marginBottom: '12px', borderBottom: '1px solid #9ca3af' }}>
                Skills
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {skills.map((skill) => (
                  <span
                    key={skill.id}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#eff6ff',
                      color: '#1d4ed8',
                      border: '1px solid #bfdbfe',
                      fontSize: '14px',
                      fontWeight: 600,
                      padding: '6px 16px',
                      borderRadius: '8px',
                      marginRight: '10px',
                      marginBottom: '10px',
                      wordBreak: 'break-word',
                      maxWidth: '100%',
                    }}
                  >
                    {skill.skillName}
                  </span>
                ))}
              </div>
            </div>
          )}

          {projects.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', paddingBottom: '4px', marginBottom: '12px', borderBottom: '1px solid #9ca3af' }}>
                Projects
              </h2>
              {projects.map((proj) => (
                <div key={proj.id} style={{ marginBottom: '16px' }}>
                  <h3 style={{ fontWeight: 600, color: '#1f2937', wordBreak: 'break-word' }}>{proj.title}</h3>
                  <p style={{ color: '#4b5563', fontSize: '14px', marginTop: '4px', wordBreak: 'break-word', lineHeight: 1.6 }}>
                    {proj.description}
                  </p>
                  <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px', wordBreak: 'break-word' }}>Tech: {proj.techStack}</p>
                  {proj.projectLink && proj.projectLink !== 'null' && (
                    
                      href={proj.projectLink}
                      style={{ color: '#2563eb', fontSize: '14px', marginTop: '4px', display: 'inline-block', wordBreak: 'break-word', textDecoration: 'underline' }}
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
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', paddingBottom: '4px', marginBottom: '12px', borderBottom: '1px solid #9ca3af' }}>
                Certifications
              </h2>
              {certifications.map((cert) => (
                <div key={cert.id} style={{ marginBottom: '12px' }}>
                  <p style={{ color: '#1f2937', fontWeight: 600, wordBreak: 'break-word' }}>{cert.certificationName}</p>
                  <p style={{ color: '#6b7280', fontSize: '14px', wordBreak: 'break-word' }}>
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