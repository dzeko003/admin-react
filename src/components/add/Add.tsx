import { GridColDef } from "@mui/x-data-grid";
import "./add.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useLocation } from 'react-router-dom';

type Props = {
  slug: string;
  columns: GridColDef[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Add = (props: Props) => {
  const [formValues, setFormValues] = useState<{
    [key: string]: string | boolean;
  }>({
    lastName: "",
    firstName: "",
    email: "",
    phone: "",
    createdAt: "",
    verified: false,
  });
  
  const [imgFile, setImgFile] = useState<File | null>(null);
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
    // Ajouter d'autres cas selon vos besoins
    default:
      console.error("Unknown path:", location.pathname);
      break;
  }

  const mutation = useMutation({
    mutationFn: (newData: FormData) => {
      if (!BASE_URL) {
        throw new Error('BASE_URL is not defined properly');
      }

      return fetch(`${BASE_URL}/${endpoint}`, {
        method: "POST",
        body: newData,
      });
    },
    onSuccess: () => {
      if (props.slug) {
        queryClient.invalidateQueries({ queryKey: [`all${props.slug}s`] });
      } else {
        console.error("Invalid props.slug:", props.slug);
      }
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormValues({
      ...formValues,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImgFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const formData = new FormData();
    for (const key in formValues) {
      const value = formValues[key];
      const stringValue = typeof value === 'boolean' ? value.toString() : value;
      formData.append(key, stringValue);
    }
    if (imgFile) {
      formData.append("img", imgFile);
    }
  
    mutation.mutate(formData);
    props.setOpen(false);
  };

  const hasImgColumn = props.columns.some((column) => column.field === "img");

  return (
    <div className="add">
      <div className="modal">
        <span className="close" onClick={() => props.setOpen(false)}>
          X
        </span>
        <h1>Add new {props.slug}</h1>
        <form onSubmit={handleSubmit}>
          {props.columns
            .filter((item) => item.field !== "id" && item.field !== "img" && item.field !== "created_at")
            .map((column) => (
              <div className="item" key={column.field}>
                <label>{column.headerName}</label>
                <input
                  type={column.type}
                  name={column.field}
                  value={formValues[column.field] !== undefined ? String(formValues[column.field]) : ""}
                  onChange={handleInputChange}
                  placeholder={column.field}
                />
              </div>
            ))}
          {hasImgColumn && (
            <div className="item">
              <label>Image</label>
              <input type="file" onChange={handleFileChange} />
            </div>
          )}
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Add;
