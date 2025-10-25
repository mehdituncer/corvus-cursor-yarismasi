import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import HomePage from './pages/HomePage'
import CoursesPage from './pages/CoursesPage'
import CourseDetailPage from './pages/CourseDetailPage'
import AboutPage from './pages/AboutPage'
import AccessibilityPage from './pages/AccessibilityPage'
import UploadMaterialPage from './pages/UploadMaterialPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dersler" element={<CoursesPage />} />
        <Route path="/ders/:id" element={<CourseDetailPage />} />
        <Route path="/materyal-yukle" element={<UploadMaterialPage />} />
        <Route path="/hakkinda" element={<AboutPage />} />
        <Route path="/erisilebilirlik" element={<AccessibilityPage />} />
      </Routes>
    </Layout>
  )
}

export default App

