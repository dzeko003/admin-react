import React, { useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import "./edit.scss";

type EditProps = {
  slug: string;
  columns: GridColDef[];
  setOpen: (open: boolean) => void;
  initialValues: any;
  BASE_URL: string;
  endpoint: string;
  rowId: number;
};

const Edit: React.FC<EditProps> = ({
  slug,
  columns,
  setOpen,
  initialValues,
  BASE_URL,
  endpoint,
  rowId,
}) => {
  const [formValues, setFormValues] = useState(initialValues);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImgFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedData = {
      name: formValues.name,
      longitude: parseFloat(formValues.longitude),
      latitude: parseFloat(formValues.latitude),
      address: formValues.address,
      printers: parseInt(formValues.printers, 10),
      img: formValues.img ? formValues.img : null,
    };

    mutation.mutate(updatedData);
  };

  const mutation = useMutation({
    mutationFn: (updatedData: any) => {
      if (!BASE_URL) {
        throw new Error("BASE_URL is not defined properly");
      }

      return fetch(`${BASE_URL}/${endpoint}/${rowId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries([`${slug}s`]);
      setOpen(false);
    },
    onError: (error) => {
      console.error("Failed to update:", error);
    },
  });

  const hasImgColumn = columns.some((column) => column.field === "img");

  return (
    <div className="edit">
      <div className="modal">
        <h1>Edit {slug}</h1>
        <span className="close" onClick={() => setOpen(false)}>
          &times;
        </span>
        <form onSubmit={handleSubmit}>
          {columns
            .filter((column) => column.field !== "id" && column.field !== "created_at")
            .map((column) => (
              <div className="item" key={column.field}>
                <label>{column.headerName}</label>
                {column.field !== "img" ? (
                  <input
                    type={column.type === "number" ? "number" : "text"}
                    name={column.field}
                    value={formValues[column.field] !== undefined ? String(formValues[column.field]) : ""}
                    onChange={handleChange}
                  />
                ) : (
                  <input type="file" onChange={handleFileChange} />
                )}
              </div>
            ))}
          {hasImgColumn && (
            <div className="item">
              <label>Image</label>
              <input type="file" onChange={handleFileChange} />
            </div>
          )}
          <button type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default Edit;
