export default function Loader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-primary-500/10 rounded-full"></div>
        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
    </div>
  )
}