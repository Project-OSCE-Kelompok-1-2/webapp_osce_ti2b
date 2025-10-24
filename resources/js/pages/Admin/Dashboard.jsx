import React from "react";

export default function Dashboard() {
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Main content */}
            <main className="flex-1 flex flex-col p-6 overflow-y-auto">
                {/* Header */}
                <header className="mb-4">
                    <input
                        type="text"
                        value="Dashboard"
                        readOnly
                        className="w-full border border-gray-400 rounded-md p-2 text-sm font-medium bg-white"
                    />
                </header>

                {/* Statistik Section */}
                <section className="mb-8">
                    <h2 className="font-semibold text-gray-800 mb-3">
                        Statistika
                    </h2>
                    <div className="flex gap-4 border-roun">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="flex-1 bg-white border-black border rounded-lg shadow-sm p-4 flex flex-col justify-between"
                            >
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-gray-900">
                                        Porem ipsum dolor
                                    </h3>
                                    <div className="w-3 h-3 bg-grey-800 rounded-full" />
                                </div>
                                <p className="text-gray-500 text-xs mt-1">
                                    0000 %
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Plot Section */}
                <section className="mb-8">
                    <h2 className="font-semibold text-gray-800 mb-3">Plot</h2>
                    <div className="flex gap-4">
                        <div className="flex-1 bg-white border-black border rounded-lg h-64" />
                        <div className="flex-1 bg-white border-black border rounded-lg h-64" />
                    </div>
                </section>

                {/* Footer */}
                <footer className= "mt-auto">
                    <div className="w-full border-black border rounded-md bg-white text-center text-xs text-gray-600 p-2">
                        Copyright Porem ipsum dolor sit amet | Porem ipsum dolor
                        sit amet
                    </div>
                </footer>
            </main>
        </div>
    );
}
