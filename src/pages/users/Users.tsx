import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/dataTable/DataTable";
import "./Users.scss";
import { useState } from "react";
import Add from "../../components/add/Add";
import { useQuery } from "@tanstack/react-query";
import userAxiosClient from "@api/userApi";
import axios from "axios";

// import { useQuery } from "@tanstack/react-query";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "img",
    headerName: "Avatar",
    width: 100,
    renderCell: (params) => {
      return <img src={params.row.img || "/noavatar.png"} alt="" />;
    },
  },
  {
    field: "first_name",
    type: "string",
    headerName: "First name",
    width: 150,
  },
  {
    field: "last_name",
    type: "string",
    headerName: "Last name",
    width: 150,
  },
  {
    field: "email",
    type: "string",
    headerName: "Email",
    width: 200,
  },
  {
    field: "phone",
    type: "string",
    headerName: "Phone",
    width: 200,
  },
  {
    field: "created_at",
    headerName: "Created At",
    width: 200,
    type: "string",
  },
  {
    field: "verified",
    headerName: "Verified",
    width: 150,
    type: "boolean",
  },
];

const Users = () => {
  const [open, setOpen] = useState(false);

  // TEST THE API (Express Js API)

  // const { isLoading, data } = useQuery({
  //   queryKey: ["allusers"],
  //   queryFn: () =>
  //     fetch("http://localhost:8800/api/users").then(
  //       (res) => res.json()
  //     ),
  // });

  // Test Laravel Api

  const BASE_URL = `${import.meta.env.VITE_USER_API_BASE_URL}/api`;

  const { isLoading, data, error } = useQuery({
    queryKey: ["allusers"],
    queryFn: async () => {
      try {
        const response = await axios.get(`${BASE_URL}/users`);
        return response.data;
      } catch (err) {
        console.error("Error fetching users:", err);
        throw err;
      }
    },
  });

  return (
    <div className="users">
      <div className="info">
        <h1>Users</h1>
        <button onClick={() => setOpen(true)}>Add New User</button>
      </div>

      {/* TEST THE API */}

      {isLoading ? (
        "Loading..."
      ) : (
        <DataTable slug="users" columns={columns} rows={data} />
      )}

      {open && <Add slug="user" columns={columns} setOpen={setOpen} />}
    </div>
  );
};

export default Users;
