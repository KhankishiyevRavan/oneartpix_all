import React from "react";

interface RepairService {
  [x: string]: any;
  repairDate: string;
  repairPrice: string;
  serviceType: string;
  description: string;
  repairTime: string;
  status: string;
  result: string;
  technician: {
    fname: string;
    lname: string;
    _id: string;
  };
}

interface RepairServiceCardProps {
  repairs?: RepairService[];
}

const RepairServiceCard: React.FC<RepairServiceCardProps> = ({ repairs }) => {
  console.log(repairs);

  if (repairs?.length === 0) {
    return (
      <div className="p-4 border rounded-xl text-sm text-gray-500 dark:text-gray-400">
        Təmir xidməti əlavə edilməyib.
      </div>
    );
  }

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 mt-6">
      <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
        Təmir xidmətləri
      </h4>
      <div className="space-y-6">
        {repairs?.map((repair, index) => (
          <div
            key={index}
            className="border p-4 rounded-xl bg-gray-50 dark:bg-white/[0.02]"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Xidmət Tarixi
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {repair.repairDate
                    ?.slice(0, 10)
                    .split("-")
                    .reverse()
                    .join("-")}{" "}
                  {repair.repairTime}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Xidmət Statusu
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {repair.status}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Usta
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {repair.technician._id}
                </p>
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Açıqlama
                </p>
                <p className="text-sm text-gray-700 dark:text-white/80">
                  {repair.notes}
                </p>
              </div>
              {/* <div className="md:col-span-2 lg:col-span-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Nəticə
                </p>
                <p className="text-sm text-gray-700 dark:text-white/80">
                  {repair.result}
                </p>
              </div> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RepairServiceCard;
