import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section
      className="flex flex-col items-center justify-center text-center text-white px-6"
      style={{
        minHeight: "calc(100vh - 89px - 277px)", // header və footer hündürlüklərini çıxırıq
        backgroundColor: "#121b25",
      }}
    >
      <h1 className="text-7xl font-bold text-[#ffd8a2]">404</h1>
      <h2 className="mt-4 text-2xl font-semibold">Page Not Found</h2>
      <p className="mt-2 text-gray-400">
        Oops! The page you are looking for doesn’t exist or has been moved.
      </p>

      <Link
        to="/"
        className="mt-6 rounded-md bg-[#ffd8a2] px-6 py-3 text-[#121b25] font-medium hover:bg-[#e5c28f]"
      >
        Go Back Home
      </Link>
    </section>
  );
}
