import {
  DataGrid,
  GridColDef,
  GridToolbar,
} from "@mui/x-data-grid";
import "./dataTable.scss";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import productAxiosClient from "@api/productApi";

import cyberAxiosClient from "@api/cyberApi";
import { AxiosInstance } from "axios";
import userAxiosClient from "@api/userApi";




type Props = {
  columns: GridColDef[];
  rows: object[];
  slug: string;
};

const DataTable = (props: Props) => {

  const queryClient = useQueryClient();

  const getAxiosClient = (slug: string): AxiosInstance => {
    if (slug === 'products') return productAxiosClient;
    if (slug === 'users') return userAxiosClient;
    if (slug === 'cybers') return cyberAxiosClient;
    throw new Error('Invalid slug');
};
  
  const mutation = useMutation({
    mutationFn: (id: number) => {
      const axiosClient = getAxiosClient(props.slug);
      return axiosClient.delete(`/${props.slug}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`all${props.slug}`] });
    }
  });

  const handleDelete = (id: number) => {
    mutation.mutate(id);
  };

  const actionColumn: GridColDef = {
    field: "action",
    headerName: "Action",
    width: 200,
    renderCell: (params) => {
      return (
        <div className="action">
          <Link to={`/${props.slug}/${params.row.id}`}>
            <img src="/view.svg" alt="" />
          </Link>
          <div className="delete" onClick={() => handleDelete(params.row.id)}>
            <img src="/delete.svg" alt="" />
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
    </div>
  );
};

export default DataTable;
