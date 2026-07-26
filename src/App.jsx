import { Routes, Route } from 'react-router-dom'
   import Navbar from './components/Navbar'
   import Home from './pages/Home'
   import Login from './pages/Login'
   import Register from './pages/Register'
   import PersonalInfoForm from './pages/PersonalInfoForm'

   function App() {
     return (
       <>
         <Navbar />
         <Routes>
           <Route path="/" element={<Home />} />
           <Route path="/login" element={<Login />} />
           <Route path="/register" element={<Register />} />
           <Route path="/personal-info" element={<PersonalInfoForm />} />
         </Routes>
       </>
     )
   }

   export default App