import { Routes, Route } from 'react-router-dom'
   import Navbar from './components/Navbar'
   import Home from './pages/Home'
   import Login from './pages/Login'
   import Register from './pages/Register'
   import PersonalInfoForm from './pages/PersonalInfoForm'
   import EducationForm from './pages/EducationForm'
   import SkillsForm from './pages/SkillsForm'
   import WorkExperienceForm from './pages/WorkExperienceForm'
   import ProjectsForm from './pages/ProjectsForm'
  import CertificationsForm from './pages/CertificationsForm'
  import ProfessionalSummaryForm from './pages/ProfessionalSummaryForm'
  import Preview from './pages/Preview'

   function App() {
     return (
       <>
         <Navbar />
         <Routes>
           <Route path="/" element={<Home />} />
           <Route path="/login" element={<Login />} />
           <Route path="/register" element={<Register />} />
           <Route path="/personal-info" element={<PersonalInfoForm />} />
           <Route path="/education" element={<EducationForm />} />
           <Route path="/skills" element={<SkillsForm />} />
           <Route path="/work-experience" element={<WorkExperienceForm />} />
<Route path="/projects" element={<ProjectsForm />} />
<Route path="/certifications" element={<CertificationsForm />} />
<Route path="/professional-summary" element={<ProfessionalSummaryForm />} />
<Route path="/preview" element={<Preview />} />
         </Routes>
       </>
     )
   }

   export default App