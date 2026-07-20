import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import DataTable from "../components/ui/DataTable";
import LeadKanban from "../components/leads/LeadKanban";
import {
  LayoutList,
  Kanban,
  Edit2,
  Trash2,
  Mail,
  Phone,
  CircleAlert,
} from "lucide-react";
import { format } from "date-fns";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import LeadForm from "../components/forms/LeadForm";

export default function Leads() {
  const [view, setView] = useState("list"); // 'list' | 'kanban'
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const {
    data: response,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data } = await api.get("/leads");
      return data;
    },
  });

  const updateLeadStatus = useMutation({
    mutationFn: async ({ leadId, newStatus }) => {
      const { data } = await api.put(`/leads/${leadId}`, { status: newStatus });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => await api.delete(`/leads/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      setIsConfirmOpen(false);
      setSelectedRecord(null);
    },
  });

  const handleAdd = () => {
    setSelectedRecord(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (record) => {
    setSelectedRecord(record);
    setIsConfirmOpen(true);
  };

  const leads = response?.data || [];

  const columns = [
    {
      header: "Name",
      cell: (row) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-100 to-blue-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-blue-700 dark:text-blue-300 font-semibold">
              {row.firstName?.charAt(0) || row.lastName?.charAt(0) || '?'}
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {row.firstName || ''} {row.lastName || ''}
            </div>
            <div className="text-sm text-gray-500 flex flex-col gap-1 mt-1">
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3" /> {row.email}
              </span>
              {row.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {row.phone}
                </span>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Company",
      accessor: "company",
    },
    {
      header: "Status",
      cell: (row) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
          {row.status}
        </span>
      ),
    },
    {
      header: "Source",
      cell: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-slate-700 px-2 py-1 rounded-md">
          {row.source}
        </span>
      ),
    },
    {
      header: "Created",
      cell: (row) => (
        <span className="text-sm text-gray-500">
          {row.createdAt ? format(new Date(row.createdAt), "MMM dd, yyyy") : '-'}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleEdit(row)}
            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  if (isError) {
    return (
      <div className="bg-red-50 p-4 rounded-xl flex items-center text-red-800">
        <CircleAlert className="w-5 h-5 mr-3" />
        Failed to load leads. Please check your permissions or network.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="flex bg-gray-100 dark:bg-slate-900 p-1 rounded-lg">
          <button
            onClick={() => setView("list")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${view === "list"
                ? "bg-white dark:bg-slate-800 shadow-sm text-gray-900 dark:text-white"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
              }`}
          >
            <LayoutList className="w-4 h-4" />
            List View
          </button>
          <button
            onClick={() => setView("kanban")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${view === "kanban"
                ? "bg-white dark:bg-slate-800 shadow-sm text-gray-900 dark:text-white"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
              }`}
          >
            <Kanban className="w-4 h-4" />
            Kanban Board
          </button>
        </div>
      </div>

      {view === "list" ? (
        <DataTable
          title="Lead Management"
          description="Manage your incoming leads and track their journey."
          columns={columns}
          data={leads}
          loading={isLoading}
          onAdd={handleAdd}
          addButtonText="New Lead"
        />
      ) : (
        <LeadKanban
          leads={leads}
          loading={isLoading}
          onStatusChange={(leadId, newStatus) =>
            updateLeadStatus.mutate({ leadId, newStatus })
          }
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedRecord ? "Edit Lead" : "Create Lead"}
      >
        <LeadForm
          initialData={selectedRecord}
          onSuccess={() => setIsModalOpen(false)}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => deleteMutation.mutate(selectedRecord?._id)}
        title="Delete Lead"
        message={`Are you sure you want to delete the lead "${selectedRecord?.firstName} ${selectedRecord?.lastName}"? This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
