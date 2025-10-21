import React from "react";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-20 bg-white border-r flex flex-col items-center justify-between py-4">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 bg-gray-800 rounded-full" />
          <div className="flex flex-col gap-3">
            <div className="w-8 h-8 bg-gray-700 rounded-md" />
            <div className="w-8 h-8 bg-gray-400 rounded-md" />
            <div className="w-8 h-8 bg-gray-300 rounded-md" />
          </div>
        </div>

        {/* Footer icon */}
        <div className="w-6 h-6 bg-gray-800 rounded-full" />
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col p-4 overflow-y-auto">
        {/* Header */}
        <header className="mb-4">
          <input
            type="text"
            value="Dashboard"
            readOnly
            className="w-full border border-gray-300 rounded-md p-2 text-sm font-medium bg-white"
          />
        </header>

        {/* Statistik Section */}
        <section className="mb-6">
          <h2 className="font-semibold text-gray-800 mb-2">Statistika</h2>
          <div className="flex gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex-1 bg-white border rounded-lg shadow-sm p-10 flex flex-col justify-between"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-900">Porem ipsum dolor</h3>
                  <div className="w-3 h-3 bg-grey-700 rounded-full" />
                </div>
                <p className="text-gray-500 text-xs mt-1">0000 %</p>
              </div>
            ))}
          </div>
        </section>

        {/* Plot Section */}
        <section className="flex gap-4 mb-6">
          <div className="flex-1 bg-white border rounded-lg h-64" />
          <div className="flex-1 bg-white border rounded-lg h-64" />
        </section>

        {/* Footer */}
        <footer>
          <div className="w-full border rounded-md bg-white text-center text-xs text-gray-500 p-2">
            Copyright Porem ipsum dolor sit amet | Porem ipsum dolor sit amet
          </div>
        </footer>
      </main>
    </div>
  );
}
