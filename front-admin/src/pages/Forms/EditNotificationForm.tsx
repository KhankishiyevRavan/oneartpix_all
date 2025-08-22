"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getNotificationById,
  NotificationTypes,
  updateNotificationStatus,
} from "../../services/notificationsService";
import Button from "../../components/ui/button/Button";
import Select from "../../components/form/Select";

export default function EditNotificationForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<NotificationTypes | null>(
    null
  );

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const data = await getNotificationById(id!);
        console.log("Fetched notification:", data);
        setNotification(data);
        setStatus(data?.status || "pending");
      } catch (err) {
        console.error("Error fetching notification:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotification();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateNotificationStatus(id!, status);
      alert(
        `${notification?.subscriberId?.fname || ""} ${
          notification?.subscriberId?.lname || ""
        } - ${notification?.type || ""} ${
          status === "pending" ? "Gözləmədə" : "Tamamlandı"
        } status uğurla dəyişdi`
      );

      navigate("/notifications"); // uğurlu olduqdan sonra geri yönləndir
    } catch (err) {
      console.error("Error updating:", err);
      alert("Xəta baş verdi!");
    }
  };

  if (loading) return <p>Yüklənir...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded-xl border bg-white dark:bg-gray-800">
      <h2 className="text-lg font-semibold mb-4">
        Notifikasiya statusunu dəyiş
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Status
        </label>
        <Select
          value={status}
          onChange={(value: string) => setStatus(value)}
          options={[
            { value: "pending", label: "Gözləmədə" },
            { value: "finish", label: "Tamamlandı" },
          ]}
          className="border px-3 py-2 rounded-lg dark:bg-gray-700 dark:text-gray-200"
        />

        <div className="flex gap-3">
          <Button type="submit" size="sm">
            Yadda saxla
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => navigate("/notifications")}
          >
            Geri qayıt
          </Button>
        </div>
      </form>
    </div>
  );
}
