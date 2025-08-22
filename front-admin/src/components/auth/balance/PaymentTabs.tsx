const tabs = [
  { id: "topup", label: "Balans" },
  { id: "contracts", label: "Müqavilələr" },
  { id: "services", label: "Əlaqəli xidmətlər" },
  { id: "bonuses", label: "Bonus və promokodlar" },
  { id: "documents", label: "Sənədlər" },
  { id: "history", label: "Əməliyyat tarixçəsi" },
];

export default function PaymentTabs({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (id: string) => void;
}) {
  return (
    <div className="flex gap-4 border-b">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`pb-2 border-b-2 ${
            activeTab === tab.id
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
