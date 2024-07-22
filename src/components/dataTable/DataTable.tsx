import React, { useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridToolbar,
} from "@mui/x-data-grid";
import "./dataTable.scss";
import { Link, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Edit from "@components/edit/edit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Props = {
  columns: GridColDef[];
  rows: object[];
  slug: string;
};

const DataTable = (props: Props) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const queryClient = useQueryClient();
  const location = useLocation();

  let BASE_URL = "";
  let endpoint = "";

  switch (location.pathname) {
    case "/cybers":
      BASE_URL = `${import.meta.env.VITE_CYBER_API_BASE_URL}/api`;
      endpoint = "cybers";
      break;
    case "/users":
      BASE_URL = `${import.meta.env.VITE_USER_API_BASE_URL}/api`;
      endpoint = "users";
      break;
    default:
      console.error("Unknown path:", location.pathname);
      break;
  }

  const handleDelete = async (id: number) => {
    try {
      const confirmed = window.confirm("Are you sure you want to delete this item?");
      if (!confirmed) return;

      const response = await fetch(`${BASE_URL}/${endpoint}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error('Failed to delete');
      }
      queryClient.invalidateQueries([endpoint]);
      // queryClient.invalidateQueries({
      //   queryKey: [endpoint],
      // });
      
      toast.success("Item deleted successfully!"); // Notification de succès
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (data: any) => {
    setEditData(data);
    setEditModalOpen(true);
  };

  const actionColumn: GridColDef = {
    field: "action",
    headerName: "Action",
    width: 200,
    renderCell: (params) => {
      return (
        <div className="action">
          <Link to={`/${props.slug}/${params.row.id}`}>
            <img src="/view.svg" alt="View" />
          </Link>
          <div className="delete" onClick={() => handleDelete(params.row.id)}>
            <img src="/delete.svg" alt="Delete" />
          </div>
          <div className="delete" onClick={() => handleEdit(params.row)}>
            <img src="/edit.svg" alt="Edit" />
          </div>
        </div>
      );
    },
  };

  return (
    <div className="dataTable">
      <DataGrid
        className="dataGrid"
        rows={props.rows}
        columns={[...props.columns, actionColumn]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        disableColumnFilter
        disableDensitySelector
        disableColumnSelector
      />
      {editModalOpen && (
        <Edit
          slug={props.slug}
          columns={props.columns}
          setOpen={setEditModalOpen}
          initialValues={editData}
          BASE_URL={BASE_URL}
          endpoint={endpoint}
          rowId={editData.id}
        />
      )}
    </div>
  );
};

export default DataTable;
