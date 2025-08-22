import { useState, useMemo, useEffect } from "react";
import { deleteContract, getAllContracts } from "../services/contractService";
import { jsPDF } from "jspdf";
import { useNavigate } from "react-router";
import Button from "../components/ui/button/Button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getAllServicePackages } from "../services/servicePackageService";

interface Contract {
  _id?: string;
  contractNumber?: string;
  subscriberId?: {
    fname?: string;
    lname?: string;
    address?: string;
  };
  startDate?: string;
  endDate?: string;
  servicePackage?: string;
  servicePackageName?: string;
  subscriberName?: string;
  totalPaidAmount?: string;
  combiModel?: string;
  contractValue?: string;
  initialPayment?: string;
  status?: string;
}

type PageItem = number | "...";

// Dinamik səhifə düymələri
function getPageItems(
  current: number,
  total: number,
  siblings: number = 1
): PageItem[] {
  // Kiçik total-da ellipsis lazım deyil
  if (total <= 1) return [1];
  if (total <= 2 + 2 * siblings) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: PageItem[] = [];
  const first = 1;
  const last = total;

  const left = Math.max(current - siblings, 2); // 2-dən başlayır (1 artıq əlavə olunacaq)
  const right = Math.min(current + siblings, total - 1); // total-1-də bitir (son ayrıca əlavə olunacaq)

  pages.push(first);

  // Sol tərəfdə boşluq varsa "..."
  if (left > 2) pages.push("...");

  // Orta diapazon
  for (let p = left; p <= right; p++) pages.push(p);

  // Sağ tərəfdə boşluq varsa "..."
  if (right < total - 1) pages.push("...");

  pages.push(last);

  // Dublikatları təmizlə (nadir hallarda kənar hallarda ola bilər)
  return pages.filter((v, i, a) => i === 0 || v !== a[i - 1]);
}

const Contracts = () => {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const [packages, setPackages] = useState<string[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const contractsPerPage = 5;

  const fetchContracts = async () => {
    try {
      const data = await getAllContracts();
      setContracts(data.sort(() => -1));
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await getAllServicePackages();
        if (data) {
          const newOptions = data.map((d: any) => d.name);
          setPackages(newOptions);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchPackages();
    fetchContracts();
  }, []);

  const filteredContracts = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();

    return contracts.filter((contract) => {
      const searchableFields = [
        contract.contractNumber,
        contract.subscriberName,
        contract.contractValue,
        contract.initialPayment,
        contract.status,
        contract.servicePackageName,
        contract.combiModel,
        contract.startDate?.slice(0, 10),
        contract.endDate?.slice(0, 10),
      ];

      const matchesSearch =
        searchQuery === "" ||
        searchableFields.some((field) =>
          field?.toString().toLowerCase().includes(searchLower)
        );

      const matchesStatus =
        statusFilter === "all" || contract.status === statusFilter;

      const matchesService =
        serviceFilter === "all" ||
        contract.servicePackageName === serviceFilter;

      return matchesSearch && matchesStatus && matchesService;
    });
  }, [contracts, searchQuery, statusFilter, serviceFilter]);

  // Ümumi səhifə sayı (memo)
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredContracts.length / contractsPerPage)),
    [filteredContracts.length]
  );

  // Filter dəyişəndə currentPage mövcud aralıqda qalsın
  useEffect(() => {
    setCurrentPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);

  const paginatedContracts = useMemo(() => {
    const startIndex = (currentPage - 1) * contractsPerPage;
    const endIndex = startIndex + contractsPerPage;
    return filteredContracts.slice(startIndex, endIndex);
  }, [filteredContracts, currentPage]);

  const generatePDF = (contract: Contract) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Contract Details", 14, 22);

    doc.setFontSize(12);
    doc.text(`Contract Number: ${contract.contractNumber || ""}`, 14, 40);
    doc.text(`Subscriber ID: ${contract.subscriberId || ""}`, 14, 50);
    doc.text(`Contract Value: ${contract.contractValue || ""} AZN`, 14, 60);
    doc.text(`Initial Payment: ${contract.initialPayment || "0"} AZN`, 14, 70);
    doc.text(`Start Date: ${contract.startDate?.slice(0, 10) || ""}`, 14, 80);
    doc.text(`End Date: ${contract.endDate?.slice(0, 10) || ""}`, 14, 90);
    doc.text(`Status: ${contract.status || ""}`, 14, 100);
    doc.text(`Service Package: ${contract.servicePackage || ""}`, 14, 110);
    doc.text(`Model: ${contract.combiModel || ""}`, 14, 120);

    doc.save(`Contract_${contract.contractNumber || contract._id}.pdf`);
  };

  const editContract = (contract: Contract) => {
    navigate(`/edit-contract/${contract._id}`);
  };

  const viewContractDetails = (contract: Contract) => {
    navigate(`/contract/${contract._id}`);
  };

  const handleDelete = async (contractId: string) => {
    const confirmed = window.confirm(
      "Bu müqaviləni silmək istədiyinizə əminsiniz?"
    );
    if (!confirmed) return;

    try {
      const result = await deleteContract(contractId);
      alert(result.message || "Müqavilə silindi");
      fetchContracts();
      // İstəsən burada fetchContracts() çağırıb siyahını yeniləyə bilərsən
    } catch (err) {
      alert("Müqavilə silinərkən xəta baş verdi");
    }
  };

  return (
    <>
      {/* Filter Section */}
      <div className="flex flex-wrap gap-4 mb-5">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-500 dark:text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx={11} cy={11} r={8} />
              <line x1={21} y1={21} x2={16.65} y2={16.65} />
            </svg>
          </div>
          <input
            type="text"
            className="w-full py-2 pl-10 pr-3 border border-gray-300 dark:border-gray-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white/90"
            placeholder="Müqavilələri axtarın..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          className="py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white/90"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Bütün statuslar</option>
          <option value="Gözləmədə">Gözləmədə</option>
          <option value="Aktiv">Aktiv</option>
          <option value="expired">Müddəti bitdi</option>
        </select>

        <select
          className="py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white/90"
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
        >
          <option value="all">Bütün xidmət növləri</option>
          {packages.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Contract List */}
      <div className="space-y-4">
        {paginatedContracts.length > 0 ? (
          paginatedContracts.map((contract) => (
            <div
              key={contract._id}
              className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden cursor-pointer hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
            >
              {/* Contract Header */}
              <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <div className="font-medium text-gray-800 dark:text-white/90">
                  Kontrakt #{contract.contractNumber}
                </div>
                <div className="flex gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${
                      contract.status === "cozlenmis"
                        ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                        : contract.status === "active"
                        ? "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-400"
                    }`}
                  >
                    {contract.status}
                  </span>
                  {contract.servicePackageName && (
                    <span className="bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 px-3 py-1 rounded-full text-xs font-medium uppercase">
                      {contract.servicePackageName}
                    </span>
                  )}
                </div>
              </div>

              {/* Contract Body */}
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Müştəri
                    </div>
                    <div className="font-medium text-gray-800 dark:text-white/90">
                      {contract.subscriberName}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Kontrakt Dəyəri
                    </div>
                    <div className="font-medium text-gray-800 dark:text-white/90">
                      {contract.contractValue} AZN
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      İlkin Ödəniş
                    </div>
                    <div className="font-medium text-gray-800 dark:text-white/90">
                      {contract.initialPayment} AZN
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Cari Ödəniş
                    </div>
                    <div className="font-medium text-gray-800 dark:text-white/90">
                      {contract.totalPaidAmount} AZN
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Başlama Tarixi
                    </div>
                    <div className="font-medium text-gray-800 dark:text-white/90">
                      {contract.startDate
                        ?.slice(0, 10)
                        .split("-")
                        .reverse()
                        .join("-")}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Bitmə Tarixi
                    </div>
                    <div className="font-medium text-gray-800 dark:text-white/90">
                      {contract.endDate
                        ?.slice(0, 10)
                        .split("-")
                        .reverse()
                        .join("-")}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Model
                    </div>
                    <div className="font-medium text-gray-800 dark:text-white/90">
                      {contract.combiModel}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Ünvan
                    </div>
                    <div className="font-medium text-gray-800 dark:text-white/90">
                      {contract?.subscriberId?.address}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 mt-4">
                  {role === "admin" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        contract._id && handleDelete(contract._id);
                      }}
                      className="px-3 py-2 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded text-sm font-medium transition-colors"
                    >
                      Sil
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      viewContractDetails(contract);
                    }}
                    className="px-3 py-2 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded text-sm font-medium transition-colors"
                  >
                    Ətraflı Bax
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      editContract(contract);
                    }}
                    className="px-3 py-2 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded text-sm font-medium transition-colors"
                  >
                    Redaktə Et
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      generatePDF(contract);
                    }}
                    className="px-3 py-2 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded text-sm font-medium transition-colors"
                  >
                    PDF Yarat
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              Kriteriyalarınıza uyğun heç bir müqavilə tapılmadı.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="relative flex justify-center items-center gap-2 p-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="absolute left-4 inline-flex items-center justify-center gap-2 rounded-lg transition px-4 py-3 text-sm 
            bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 
            disabled:opacity-50 disabled:cursor-not-allowed
            dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300"
        >
          <ArrowLeft />
          Əvvəlki
        </button>

        <div className="flex gap-2">
          {getPageItems(currentPage, totalPages, 2).map((item, idx) =>
            item === "..." ? (
              <span
                key={`dots-${idx}`}
                className="px-3 py-1 rounded text-sm bg-transparent text-gray-500 dark:text-gray-400 select-none"
              >
                ...
              </span>
            ) : (
              <Button
                key={item}
                onClick={() => setCurrentPage(item)}
                size="sm"
                className={`px-3 py-1 rounded text-sm ${
                  currentPage === item
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                {item}
              </Button>
            )
          )}
        </div>

        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="absolute right-4 inline-flex items-center justify-center gap-2 rounded-lg transition px-4 py-3 text-sm 
            bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 
            disabled:opacity-50 disabled:cursor-not-allowed
            dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300"
        >
          Növbəti
          <ArrowRight />
        </button>
      </div>
    </>
  );
};

export default Contracts;
