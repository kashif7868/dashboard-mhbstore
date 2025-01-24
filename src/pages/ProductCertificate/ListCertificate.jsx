import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCertificates, deleteCertificate } from "../../app/reducers/productCertificateSlice";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';
import { Button, Container, Box, Typography } from '@mui/material';

const ListCertificate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { certificates, loading, error } = useSelector(
    (state) => state.certificates
  );

  useEffect(() => {
    dispatch(getCertificates());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleAddCertificate = () => {
    navigate("/add-certificates");
  };

  const handleDelete = (id) => {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this certificate?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            dispatch(deleteCertificate(id));
            toast.success("Certificate deleted successfully");
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  const handleEdit = (id) => {
    navigate(`/edit-certificates/${id}`);
  };

  // Define columns for the DataGrid
  const columns = [
    { 
      field: "srNo", 
      headerName: "Sr. No.", 
      width: 100 
    },
    { field: "name", headerName: "Certificate Name", width: 250 },
    { field: "detail", headerName: "Details", width: 350 },
    {
      field: "image",
      headerName: "Image",
      width: 150,
      renderCell: (params) => (
        <img
          src={`https://api.mhbstore.com/${params.row.image}`}
          alt={params.row.name}
          style={{
            width: "100px",
            height: "auto",
            borderRadius: "8px",
          }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleEdit(params.row.id)}
            sx={{ marginRight: "10px", backgroundColor: "#000", color: "#fff" }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleDelete(params.row.id)}
            sx={{ backgroundColor: "#000", color: "#fff" }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  // Prepare rows based on the fetched certificates data
  const rows = certificates.map((cert, index) => ({
    srNo: index + 1, // Serial Number starting from 1
    id: cert._id,    // ID used for editing and deleting
    name: cert.name,
    detail: cert.detail,
    image: cert.image,
  }));

  return (
    <Container maxWidth="lg" sx={{ backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <Typography variant="h4" sx={{ color: "#000" }}>
          Certificate List
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddCertificate}
          sx={{ backgroundColor: "#000", color: "#fff" }}
        >
          Add Certificate
        </Button>
      </Box>

      <div style={{ height: 400, width: '100%', backgroundColor: "#fff" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          sx={{
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            boxShadow: 3,
          }}
        />
      </div>

      <ToastContainer />
    </Container>
  );
};

export default ListCertificate;
