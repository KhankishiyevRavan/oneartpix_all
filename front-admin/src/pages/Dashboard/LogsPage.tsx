import { useEffect, useState } from "react";
import { getAllLogs, LogType } from "../../services/logService";

export default function LogsPage() {
  const [logs, setLogs] = useState<LogType[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await getAllLogs();
        setLogs(data);
        console.log(data);
        
      } catch (error) {
        console.error("Loglar alınarkən xəta:", error);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Əməliyyat logları</h2>
      <div className="overflow-auto">
        <table className="min-w-full table-auto border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">İstifadəçi</th>
              <th className="px-4 py-2">Əməliyyat</th>
              <th className="px-4 py-2">Tip</th>
              <th className="px-4 py-2">Vaxt</th>
              <th className="px-4 py-2">Detallar</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id} className="border-t">
                <td className="px-4 py-2">{log.userId?.fname} {log.userId?.lname}</td>
                <td className="px-4 py-2 capitalize">{log.operation}</td>
                <td className="px-4 py-2">{log.entityType}</td>
                <td className="px-4 py-2">{log.timestamp}</td>
                <td className="px-4 py-2">
                  <pre className="text-xs max-w-xs whitespace-pre-wrap">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
