"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { getAllRepairs, Repair } from "../../services/repairService";

export default function RepairsTable() {

  const [operators, setOperators] = useState<Repair[]>([]);

  useEffect(() => {
    const fetchOperators = async () => {
      try {
        const data = await getAllRepairs();
        console.log(data);

        setOperators(data);
      } catch (err: any) {
        console.error("Error fetching operators:", err);
      }
    };

    fetchOperators();
  }, []);
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              {/* <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-800 text-start text-theme-xs dark:text-white/90"
              >
                ID
              </TableCell> */}
           
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-800 text-start text-theme-xs dark:text-white/90"
              >
                Müştəri
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-800 text-start text-theme-xs dark:text-white/90"
              >
                Müştəri nömrəsi
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-800 text-start text-theme-xs dark:text-white/90"
              >
                Müştəri adresi
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-800 text-start text-theme-xs dark:text-white/90"
              >
                Texnik
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-800 text-start text-theme-xs dark:text-white/90"
              >
                Texnik nömrəsi
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-800 text-start text-theme-xs dark:text-white/90"
              >
                Qeydlər
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {operators?.map((operator) => (
              <TableRow key={operator?._id}>
                {/* <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  {operator._id}
                  </span>
                </TableCell> */}
               
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {operator.customerName}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {operator.customerPhone}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {operator.callerAddress}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {operator.technicianFullName}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {operator.technicianPhone}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {operator.notes}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
