import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-black text-white">

      <Sidebar />

      <main className="flex-1 overflow-y-auto p-10">

        <div className="max-w-7xl mx-auto">
          {children}
        </div>

      </main>

    </div>
  );
}