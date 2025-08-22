import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const { t } = useTranslation();
  // const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Token yoxlama
  // useEffect(() => {
  //   const token =
  //     localStorage.getItem("access_token") ||
  //     sessionStorage.getItem("access_token");
  //   setIsLoggedIn(!!token);
  // }, []);

  // const handleLogout = () => {
  //   // Tokenləri sil
  //   localStorage.removeItem("access_token");
  //   localStorage.removeItem("user");
  //   sessionStorage.removeItem("access_token");
  //   sessionStorage.removeItem("user");

  //   setIsLoggedIn(false);
  //   navigate("/"); // Ana səhifəyə yönləndir
  // };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Menyu linkləri */}
        <div className="flex space-x-6">
          <Link to="/" className="text-white font-medium hover:text-yellow-400">
            {t("home")}
          </Link>
          <Link
            to="/menu"
            className="text-white font-medium hover:text-yellow-400"
          >
            {t("menu")}
          </Link>
          <Link
            to="/wishlist"
            className="text-white font-medium hover:text-yellow-400"
          >
            {t("wishlist_title")}
          </Link>
        </div>

       
      </div>
    </nav>
  );
}
