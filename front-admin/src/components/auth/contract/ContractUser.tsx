import { useState, useMemo, useEffect } from "react";
import { jsPDF } from "jspdf";
import { useNavigate } from "react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getContractsBySubscriberId } from "../../../services/contractService";
import { getAllServicePackages } from "../../../services/servicePackageService";
import Button from "../../ui/button/Button";

interface Contract {
  _id?: string;
  contractNumber?: string;
  subscriberId?: string;
  subscriberInfo?: {
    fname?: string;
    lname?: string;
    address?: string;
  };
  startDate?: string;
  endDate?: string;
  servicePackage?: string;
  servicePackageName?: string;
  // terms?: string;
  combiModel?: string;
  contractValue?: string;
  initialPayment?: string;
  status?: string;
}

const ContractUser = () => {
  const navigate = useNavigate();
  const subscriberId = localStorage.getItem("id");
  const [packages, setPackages] = useState<string[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const contractsPerPage = 5;
  const permissions = JSON.parse(localStorage.getItem("permissions") || "{}");
  const role = localStorage.getItem("role");
  const fetchContracts = async () => {
    if (!subscriberId) return;
    try {
      let data = await getContractsBySubscriberId(subscriberId);

      console.log(data);
      setContracts(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        let data = await getAllServicePackages();
        if (data) {
          const newOptions = data.map((d) => d.name);
          setPackages(newOptions);
        }
        console.log(data);
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
      const matchesSearch =
        searchQuery === "" ||
        (contract.contractNumber?.toLowerCase().includes(searchLower) ?? false);

      const matchesStatus =
        statusFilter === "all" || contract.status === statusFilter;
      const matchesService =
        serviceFilter === "all" ||
        contract.servicePackageName === serviceFilter;

      return matchesSearch && matchesStatus && matchesService;
    });
  }, [contracts, searchQuery, statusFilter, serviceFilter]);

  const generatePDF = (contract: Contract) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Contract Details", 14, 22);

    doc.setFontSize(12);
    doc.text(`Contract Number: ${contract.contractNumber || ""}`, 14, 40);
    doc.text(`Subscriber ID: ${subscriberId}`, 14, 50);
    doc.text(`Contract Value: ${contract.contractValue} AZN`, 14, 60);
    doc.text(`Initial Payment: ${contract.initialPayment || "0"} AZN`, 14, 70);
    doc.text(`Start Date: ${contract.startDate?.slice(0, 10)}`, 14, 80);
    doc.text(`End Date: ${contract.endDate?.slice(0, 10)}`, 14, 90);
    doc.text(`Status: ${contract.status || ""}`, 14, 100);
    doc.text(`Service Package: ${contract.servicePackage || ""}`, 14, 110);
    doc.text(`Model: ${contract.combiModel || ""}`, 14, 120);

    // if (contract.terms) {
    //   doc.text("Terms:", 14, 130);
    //   doc.text(contract.terms, 14, 140);
    // }

    doc.save(`Contract_${contract.contractNumber || contract._id}.pdf`);
  };

  const editContract = (contract: Contract) => {
    navigate(`/edit-contract/${contract._id}`);
  };

  // New function to view contract details
  const viewContractDetails = (contract: Contract) => {
    navigate(`/contract/${contract._id}`);
  };

  const paginatedContracts = useMemo(() => {
    const startIndex = (currentPage - 1) * contractsPerPage;
    const endIndex = startIndex + contractsPerPage;
    return filteredContracts.slice(startIndex, endIndex);
  }, [filteredContracts, currentPage]);

  const totalPages = Math.ceil(filteredContracts.length / contractsPerPage);

  return (
    <div className="">
      {/* Header */}
      {/* <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-4 ">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Müqavilə Məlumatı
        </h2>
      </div> */}

      {/* Filter Section */}
      <div className="flex flex-wrap gap-4 mb-5">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-500"
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
            className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white/90"
            placeholder="Müqavilələri axtarın..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="py-2 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white/90"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Bütün statuslar</option>
          <option value="Gözləmədə">Gözləmədə</option>
          <option value="Aktiv">Aktiv</option>
          <option value="expired">Müddəti bitdi</option>
        </select>
        <select
          className="py-2 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white/90"
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
        >
          <option value="all">Bütün xidmət növləri</option>
          {packages.map((p) => (
            <option value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* Contract List */}
      <div className="space-y-4">
        {paginatedContracts.length > 0 ? (
          paginatedContracts.map((contract) => (
            <div
              key={contract._id}
              className="border border-gray-200 rounded-md overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            >
              {/* Contract Header */}
              <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800">
                <div className="font-medium dark:text-white/90">
                  Kontrakt #{contract.contractNumber}
                </div>
                <div className="flex gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${
                      contract.status === "cozlenmis"
                        ? "bg-green-100 text-green-600"
                        : contract.status === "active"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {contract?.status == "Aktiv" && "Aktiv"}
                    {contract?.status == "Gözləmədə" && "Gözləmədə"}
                  </span>
                  {contract?.servicePackageName && (
                    <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-medium uppercase">
                      {contract?.servicePackageName}
                    </span>
                  )}
                </div>
              </div>

              {/* Contract Body */}
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 ">
                      Kontrakt Dəyəri
                    </div>
                    <div className="font-medium dark:text-white/90">
                      {contract?.contractValue} AZN
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">İlkin Ödəniş</div>
                    <div className="font-medium dark:text-white/90">
                      {contract?.initialPayment} AZN
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Başlama Tarixi</div>
                    <div className="font-medium dark:text-white/90">
                      {contract?.startDate?.slice(0, 10)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Bitmə Tarixi</div>
                    <div className="font-medium dark:text-white/90">
                      {contract?.endDate
                        ?.slice(0, 10)
                        .split("-")
                        .reverse()
                        .join("-")}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Model</div>
                    <div className="font-medium dark:text-white/90">
                      {contract?.combiModel}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Ünvan</div>
                    <div className="font-medium dark:text-white/90">
                      {contract?.subscriberInfo?.address}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 mt-4">
                  {role == "admin" ||
                    (permissions?.contracts?.view_documents && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          viewContractDetails(contract);
                        }}
                        className="px-3 py-2 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded text-sm font-medium transition-colors"
                      >
                        Ətraflı Bax
                      </button>
                    ))}
                  {role == "admin" ||
                    (permissions?.contracts?.upload_documents && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          editContract(contract);
                        }}
                        className="px-3 py-2 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded text-sm font-medium transition-colors"
                      >
                        Redaktə Et
                      </button>
                    ))}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      generatePDF(contract);
                    }}
                    className="px-3 py-2 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded text-sm font-medium transition-colors"
                  >
                    PDF Yarat
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              Kriteriyalarınıza uyğun heç bir müqavilə tapılmadı.
            </p>
          </div>
        )}
      </div>
      <div className="relative flex justify-center items-center gap-2 p-4">
        {currentPage !== 1 && (
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="absolute left-4 inline-flex items-center justify-center gap-2 rounded-lg transition  px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300"
          >
            <ArrowLeft />
            Əvvəlki
          </button>
        )}

        <div className="flex gap-3">
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              size="sm"
              className={`px-3 py-1 rounded text-sm ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              {i + 1}
            </Button>
          ))}
        </div>

        {currentPage !== totalPages && (
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="absolute right-4 inline-flex items-center justify-center gap-2 rounded-lg transition  px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300"
          >
            Növbəti
            <ArrowRight />
          </button>
        )}
      </div>
    </div>
  );
};

export default ContractUser;
