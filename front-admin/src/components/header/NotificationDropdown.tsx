import { useEffect, useRef, useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Link, useNavigate } from "react-router";
import {
  getAllNotifications,
  NotificationType,
} from "../../services/notificationsService";
import { notificationsBus } from "../../utils/notificationsBus"; // ✅ event-bus

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [selectedType, setSelectedType] = useState<"inspection" | "payment">(
    "inspection"
  );

  const navigate = useNavigate();
  const fetchingRef = useRef(false); // re-entrancy qoruması
  const pollIdRef = useRef<number | null>(null); // açıq olanda opsional polling

  const fetchNotificationsSafe = async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    try {
      const data = await getAllNotifications();
      setNotifications(data);

      // Yeni/pending varsa nöqtəni göstər
      const hasPending = data.some((n) => n.status === "pending");
      if (hasPending) setNotifying(true);
    } catch (err: any) {
      // alert("Naməlum xəta");
      console.error("Error fetching notifications:", err);
    } finally {
      fetchingRef.current = false;
    }
  };

  useEffect(() => {
    // İlk yükləmə
    fetchNotificationsSafe();

    // ✅ Başqa yerdə bildiriş dəyişəndə dərhal yenilə
    const onUpdated = () => fetchNotificationsSafe();
    notificationsBus.addEventListener("notifications:updated", onUpdated);

    // ✅ Pəncərə fokus/tab geri gələndə yenilə
    const onFocus = () => fetchNotificationsSafe();
    const onVisibility = () => {
      if (document.visibilityState === "visible") fetchNotificationsSafe();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      notificationsBus.removeEventListener("notifications:updated", onUpdated);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // Dropdown açıq olanda (istəyə görə) 15 san intervalla yenilə
  useEffect(() => {
    if (isOpen) {
      pollIdRef.current = window.setInterval(fetchNotificationsSafe, 15000);
      // açılan kimi də bir dəfə çək
      fetchNotificationsSafe();
    } else if (pollIdRef.current) {
      window.clearInterval(pollIdRef.current);
      pollIdRef.current = null;
    }
    return () => {
      if (pollIdRef.current) {
        window.clearInterval(pollIdRef.current);
        pollIdRef.current = null;
      }
    };
  }, [isOpen]);

  const toggleDropdown = () => setIsOpen((v) => !v);
  const closeDropdown = () => setIsOpen(false);
  const handleClick = () => {
    toggleDropdown();
    // açanda nöqtəni söndür, amma yeni pending gəlsə yenə yanacaq
    setNotifying(false);
  };

  const filteredNotifications = notifications.filter((note) =>
    selectedType === "inspection"
      ? note.type === "Texniki baxış"
      : note.type === "Ödəniş günü"
  );

  return (
    <div className="relative">
      <button
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full dropdown-toggle hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={handleClick}
      >
        <span
          className={`absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400 ${
            !notifying ? "hidden" : "flex"
          }`}
        >
          <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
        </span>
        <svg
          className="fill-current"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
            fill="currentColor"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute -right-[240px] mt-[17px] flex h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] lg:right-0"
      >
        <div className="flex flex-col gap-2 pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Bildirişlər
            </h5>
            <button
              onClick={toggleDropdown}
              className="text-gray-500 transition dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedType("inspection")}
              className={`flex-1 px-3 py-1 rounded text-sm ${
                selectedType === "inspection"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              Texniki baxış
            </button>
            <button
              onClick={() => setSelectedType("payment")}
              className={`flex-1 px-3 py-1 rounded text-sm ${
                selectedType === "payment"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              Ödəniş günü
            </button>
          </div>
        </div>

        <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
          {filteredNotifications
            .filter((a) => a.status === "pending")
            .slice(0, 5)
            .map((n, index) => (
              <li key={index}>
                <DropdownItem
                  onItemClick={closeDropdown}
                  className="flex gap-3 rounded-lg border-b border-gray-100 p-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
                >
                  <span
                    onClick={() => navigate("/notifications")}
                    className="block"
                  >
                    <span className="mb-1.5 block text-theme-sm text-gray-500 dark:text-gray-400 space-x-1">
                      <span className="font-medium text-gray-800 dark:text-white/90">
                        {n.subscriberName}
                      </span>
                      <span> müştərinin</span>
                      <span className="font-medium text-gray-800 dark:text-white/90">
                        {n.contractId}
                      </span>
                      <span> ID-li müqaviləsinin</span>
                      <span className="font-medium text-gray-800 dark:text-white/90">
                        {n.message}
                      </span>
                    </span>
                    <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      <span>
                        {n?.updatedAt?.slice(0, 10)}{" "}
                        {n?.updatedAt?.slice(11, 16)}
                      </span>
                    </span>
                  </span>
                </DropdownItem>
              </li>
            ))}
        </ul>

        <Link
          to="/notifications"
          className="block px-4 py-2 mt-3 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          Bütün bildirişlərə bax
        </Link>
      </Dropdown>
    </div>
  );
}
