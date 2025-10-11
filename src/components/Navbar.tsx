<nav className="w-full flex items-center justify-between px-6 py-3 bg-[#18181b] shadow-md fixed top-0 left-0 z-50">
  {/* Logo section - left aligned */}
  <div className="flex items-center space-x-2">
    <img
      src="../assets/hap-logo-3.png" // Update with your logo path
      alt="Hap Logo"
      className="h-12 w-12 object-contain drop-shadow-lg bg-white/10 rounded-full p-1"
      style={{
        background: "linear-gradient(135deg, #00f2fe 0%, #4a00e0 100%)",
        border: "2px solid #fff",
        boxShadow: "0 4px 24px 0 rgba(0,0,0,0.25)",
      }}
    />
    <span className="font-bold text-2xl bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent drop-shadow">
      Hap
    </span>
  </div>
  {/* ...rest of navbar (center/right sections)... */}
</nav>