"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useNavigate } from "react-router";
import {
  getAllPayments,
  PaymentInterface,
} from "../../services/paymentService";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import Button from "../ui/button/Button";

export default function PaymentsTable() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<PaymentInterface[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getAllPayments();
        setPayments(data);
      } catch (err: any) {
        console.error("Error fetching payments:", err);
      }
    };
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter((payment) => {
    const search = searchTerm.toLowerCase();
    const paymentPurposeText =
      payment.paymentType === "monthly"
        ? `${payment.months?.[0] ?? ""} Aylıq ödəniş`.toLowerCase()
        : payment.paymentType === "annual"
        ? "İllik ödəniş"
        : "Balans artımı";

    return (
      payment._id?.toLowerCase().includes(search) ||
      payment.createdAt?.toLowerCase().includes(search) ||
      payment.contractNumber?.toString().toLowerCase().includes(search) ||
      payment.receivedByName?.toLowerCase().includes(search) ||
      payment.paymentType?.toLowerCase().includes(search) ||
      paymentPurposeText.includes(search)
    );
  });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  type PageItem = number | "...";
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
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="p-4">
        {/* Axtarış input */}
        <div className="relative mb-4 max-w-xs">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="Axtarış..."
          />
        </div>

        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-800 text-start text-theme-xs dark:text-white/90"
                >
                  ID
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-800 text-start text-theme-xs dark:text-white/90"
                >
                  Tarix
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-800 text-start text-theme-xs dark:text-white/90"
                >
                  İstifadəçi
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-800 text-start text-theme-xs dark:text-white/90"
                >
                  Müqavilə Nömrəsi
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-800 text-start text-theme-xs dark:text-white/90"
                >
                  Ödəniş Tipi
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-800 text-start text-theme-xs dark:text-white/90"
                >
                  Ödəniş Məqsədi
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-800 text-start text-theme-xs dark:text-white/90"
                >
                  Fəaliyyətlər
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {currentPayments.map((note) => (
                <TableRow key={note._id}>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {note._id}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {String(note.createdAt).slice(0, 10)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {note.receivedByName === "admin admin"
                      ? "admin"
                      : note.receivedByName}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {note.contractNumber}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {note.method === "cash" ? "Nəğd" : "Online"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {note.paymentType === "monthly"
                      ? `${note.months[0]} Aylıq ödəniş`
                      : note.paymentType === "annual"
                      ? "İllik ödəniş"
                      : "Balans artımı"}
                  </TableCell>
                  <TableCell>
                    <div className="flex py-3 px-5 gap-1">
                      <button
                        onClick={() => {
                          navigate(`/invoice/${note._id}`);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="20px"
                          height="20px"
                        >
                          <path
                            fill="#6B7280"
                            d="m18.988 2.012l3 3L19.701 7.3l-3-3zM8 16h3l7.287-7.287l-3-3L8 13z"
                          />
                          <path
                            fill="#6B7280"
                            d="M19 19H8.158c-.026 0-.053.01-.079.01c-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .896-2 2v14c0 1.104.897 2 2 2h14a2 2 0 0 0 2-2v-8.668l-2 2z"
                          />
                        </svg>
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
      </div>
    </div>
  );
}
