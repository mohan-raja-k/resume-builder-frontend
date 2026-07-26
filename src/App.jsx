import { Routes, Route } from 'react-router-dom'
   import Navbar from './components/Navbar'
   import Home from './pages/Home'
   import Login from './pages/Login'
   import Register from './pages/Register'
   import PersonalInfoForm from './pages/PersonalInfoForm'
   import EducationForm from './pages/EducationForm'

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
         </Routes>
       </>
     )
   }

   export default App