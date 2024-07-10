import { useState } from "react";
import "./Cybers.scss";
import DataTable from "../../components/dataTable/DataTable";
import Add from "../../components/add/Add";
import { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import cyberAxiosClient from "@api/cyberApi";
import axios from "axios";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "img",
    headerName: "Image",
    width: 100,
    renderCell: (params) => {
      return <img src={params.row.img || "/noavatar.png"} alt="" />;
    },
  },
  {
    field: "name",
    type: "string",
    headerName: "Name",
    width: 250,
  },
  {
    field: "longitude",
    type: "string",
    headerName: "Longitude",
    width: 150,
  },
  {
    field: "latitude",
    type: "string",
    headerName: "Latitude",
    width: 150,
  },
  {
    field: "address",
    type: "string",
    headerName: "Address",
    width: 200,
  },
  {
    field: "printers",
    headerName: "Printers",
    type: "string",
    width: 200,
  },
  {
    field: "created_at",
    headerName: "Created At",
    width: 200,
    type: "string",
  },
 
];

const Cybers = () => {
  const [open, setOpen] = useState(false);

  // TEST THE API  (Express Js API)

  // const { isLoading, data } = useQuery({
  //   queryKey: ["allcybers"],
  //   queryFn: () =>
  //     fetch("http://localhost:8800/api/cybers").then(
  //       (res) => res.json()
  //     ),
  // });

  // Test Laravel Api
  const BASE_URL = `${import.meta.env.VITE_CYBER_API_BASE_URL}/api`;

  const { isLoading, data, error } = useQuery({
    queryKey: ["allcybers"],
    queryFn: async () => {
      try {
        const response = await axios.get(`${BASE_URL}/cybers`);
        return response.data;
      } catch (err) {
        console.error("Error fetching users:", err);
        throw err;
      }
    },
  });

  return (
    <div className="cybers">
      <div className="info">
        <h1>Cybers</h1>
        <button onClick={() => setOpen(true)}>Add New Cyber</button>
      </div>
      
      {/* TEST THE API  */}

      {isLoading ? (
        "Loading..."
      ) : (
        <DataTable slug="cybers" columns={columns} rows={data} />
      )}
      {open && <Add slug="cyber" columns={columns} setOpen={setOpen} />}
    </div>
  );
};

export default Cybers;
