import { Link, useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
      {/* Big 404 */}
      <div className="relative mb-6">
        <div className="font-display text-[10rem] font-bold text-gray-100 leading-none select-none">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-xl">
            <i className="fas fa-home text-white text-3xl" />
          </div>
        </div>
      </div>

      <h1 className="font-display text-2xl font-bold text-gray-900 mb-2">
        Page not found
      </h1>
      <p className="text-gray-400 text-sm max-w-xs mb-8 leading-relaxed">
        The page you're looking for doesn't exist or may have been moved.
      </p>

      <div className="flex gap-3 flex-wrap justify-center">
        <button
          onClick={() => navigate(-1)}
          className="btn-ghost px-6 py-2.5 text-sm">
          <i className="fas fa-arrow-left text-xs" /> Go Back
        </button>
        <Link to="/" className="btn-primary px-6 py-2.5 text-sm">
          <i className="fas fa-search text-xs" /> Browse Properties
        </Link>
      </div>

      {/* Quick links */}
      <div className="mt-12 flex gap-6 text-sm text-gray-400">
        <Link to="/search?deal=sale" className="hover:text-primary transition-colors">Buy</Link>
        <Link to="/search?deal=rent" className="hover:text-primary transition-colors">Rent</Link>
        <a href="/agent" className="hover:text-primary transition-colors">Agent Portal</a>
      </div>
    </div>
  )
}
