import campusImage from '../assets/IT_company_image.jpg'

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        <img
          src={campusImage}
          alt="Campus"
          className="w-full h-auto rounded-lg shadow-md"
        />
        <h1 className="text-3xl font-bold text-gray-800 text-center mt-6">
          Welcome to Resume Builder
        </h1>
      </div>
    </div>
  )
}

export default Home