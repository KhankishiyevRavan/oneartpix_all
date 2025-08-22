"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import {
  getAllUsers,
  userDataInterface,
} from "../../services/userService";
import { useNavigate } from "react-router";
import Button from "../ui/button/Button";
import { ArrowLeft, ArrowRight, LucideEye } from "lucide-react";
import { getAllRoles } from "../../services/roleService";

export default function UsersDataTable() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<userDataInterface[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    const saved = localStorage.getItem("itemsPerPage");
    return saved ? Number(saved) : 2;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | active | passiv
  const [roleFilter, setRoleFilter] = useState("all");

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      console.log(data);
      setUsers(data);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setUsers([]);
    }
  };
  useEffect(() => {
    fetchUsers();
    const fetchRoles = async () => {
      try {
        const data = await getAllRoles(); // Backend-dən bütün rolları alırıq
        console.log(data);

        setRoles(data); // Rolları state-ə saxlayırıq
      } catch (err) {
        console.error("Error fetching roles:", err);
        alert("Naməlum xəta");
      }
    };
    fetchRoles();
  }, []);

  const filteredUsers = users
    .filter((user) =>
      `${user.fname} ${user.email} ${user.role}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .filter((user) => {
      if (statusFilter === "all") return true;
      if (statusFilter === "active") return user?.status === true;
      if (statusFilter === "passiv") return user?.status === false;
      return true;
    })
    .filter((user) => {
      if (roleFilter === "all") return true;
      return user.role === roleFilter;
    });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("ID buferə kopyalandı");
  };
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="p-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="relative">
            <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
              <svg
                className="fill-gray-500 dark:fill-gray-400"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                  fill=""
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="İstifadəçi adı, e-poçt və ya rola görə axtarın..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
            />
          </div>
          <div className="relative z-20 bg-transparent">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full py-2 pl-3 pr-8 text-sm text-gray-800 bg-transparent border border-gray-300 rounded-lg appearance-none dark:bg-dark-900 h-9 bg-none shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            >
              <option value="all">Bütün rollar</option>
              {roles.map((r) => (
                <option key={r._id} value={r.name}>
                  {r.showName}
                </option>
              ))}
            </select>
            <span className="absolute z-30 text-gray-500 -translate-y-1/2 right-2 top-1/2 dark:text-gray-400">
              <svg
                className="stroke-current"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.8335 5.9165L8.00016 10.0832L12.1668 5.9165"
                  stroke=""
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </span>
          </div>
          <div className="relative z-20 bg-transparent">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 pl-3 pr-8 text-sm text-gray-800 bg-transparent border border-gray-300 rounded-lg appearance-none dark:bg-dark-900 h-9 bg-none shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            >
              <option
                value="all"
                className="text-gray-500 dark:bg-gray-900 dark:text-gray-400"
              >
                Bütün statuslar
              </option>
              <option
                value="active"
                className="text-gray-500 dark:bg-gray-900 dark:text-gray-400"
              >
                Aktiv
              </option>
              <option
                value="passiv"
                className="text-gray-500 dark:bg-gray-900 dark:text-gray-400"
              >
                Deaktiv
              </option>
            </select>
            <span className="absolute z-30 text-gray-500 -translate-y-1/2 right-2 top-1/2 dark:text-gray-400">
              <svg
                className="stroke-current"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.8335 5.9165L8.00016 10.0832L12.1668 5.9165"
                  stroke=""
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-500 dark:text-gray-400"> Göstər </span>
            <div className="relative z-20 bg-transparent">
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1); // yeni limit seçildikdə səhifəni sıfırla
                  localStorage.setItem("itemsPerPage", e.target.value);
                }}
                className="w-full py-2 pl-3 pr-8 text-sm text-gray-800 bg-transparent border border-gray-300 rounded-lg appearance-none dark:bg-dark-900 h-9 bg-none shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              >
                <option
                  value="2"
                  className="text-gray-500 dark:bg-gray-900 dark:text-gray-400"
                >
                  2
                </option>
                <option
                  value="8"
                  className="text-gray-500 dark:bg-gray-900 dark:text-gray-400"
                >
                  8
                </option>
                <option
                  value="10"
                  className="text-gray-500 dark:bg-gray-900 dark:text-gray-400"
                >
                  10
                </option>
                <option
                  value="20"
                  className="text-gray-500 dark:bg-gray-900 dark:text-gray-400"
                >
                  20
                </option>
                <option
                  value="50"
                  className="text-gray-500 dark:bg-gray-900 dark:text-gray-400"
                >
                  50
                </option>
              </select>
              <span className="absolute z-30 text-gray-500 -translate-y-1/2 right-2 top-1/2 dark:text-gray-400">
                <svg
                  className="stroke-current"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.8335 5.9165L8.00016 10.0832L12.1668 5.9165"
                    stroke=""
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </span>
            </div>
            <span className="text-gray-500 dark:text-gray-400">
              {" "}
              istifadəçi{" "}
            </span>
          </div>
        </div>

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
                İstifadəçi
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-800 text-start text-theme-xs dark:text-white/90"
              >
                E-poçt
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-800 text-start text-theme-xs dark:text-white/90"
              >
                Rol
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-800 text-start text-theme-xs dark:text-white/90"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-800 text-center text-theme-xs dark:text-white/90"
              >
                Fəaliyyət
              </TableCell>
              {/* <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-800 text-start text-theme-xs dark:text-white/90"
              >
                Actions
              </TableCell> */}
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {currentUsers.map((user, index) => (
              <TableRow
                key={index}
                className=" hover:bg-gray-50 dark:hover:bg-white/5"
              >
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <span
                    onClick={() => user._id && handleCopy(user._id)}
                    className="cursor-pointer hover:underline"
                  >
                    {user._id}
                  </span>
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {user.fname}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {user.email}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {user.role}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      user.status === true
                        ? "success"
                        : user.status === false
                        ? "warning"
                        : "error"
                    }
                  >
                    {user.status ? "Aktiv" : "Deaktiv"}
                  </Badge>
                </TableCell>
                <TableCell className=" px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 flex justify-center">
                  <LucideEye
                    className="cursor-pointer"
                    onClick={() => navigate(`/list/user/${user._id}`)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
    </div>
  );
}
