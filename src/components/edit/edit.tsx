import { GridColDef } from "@mui/x-data-grid";
import "./edit.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";

type Props = {
  slug: string;
  columns: GridColDef[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  initialValues: { [key: string]: any };
};

const Edit = (props: Props) => {
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

  const BASE_URL = `${import.meta.env.VITE_CYBER_API_BASE_URL}/api`;

  useEffect(() => {
    if (props.initialValues) {
      setFormValues(props.initialValues);
    }
  }, [props.initialValues]);

  const mutation = useMutation({
    mutationFn: (updatedData: FormData) => {
      return fetch(`${BASE_URL}/${props.slug}/${props.initialValues.id}`, {
        method: "PUT",
        body: updatedData,
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
    <div className="edit">
      <div className="modal">
        <span className="close" onClick={() => props.setOpen(false)}>
          X
        </span>
        <h1>Edit {props.slug}</h1>
        <form onSubmit={handleSubmit}>
          {props.columns
            .filter((item) => item.field !== "id" && item.field !== "img")
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
          <button type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default Edit;
