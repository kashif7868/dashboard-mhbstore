import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress, Button } from '@mui/material'; 
import { AiFillDelete, AiOutlineEye } from "react-icons/ai";
import DataTable from "react-data-table-component";
import { ToastContainer, toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import { getAllPartners, deletePartner } from '../../app/reducers/partnerSlice';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import "react-toastify/dist/ReactToastify.css";
import "react-confirm-alert/src/react-confirm-alert.css";

const PatnerListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize the navigate function
  const { partners, isLoading, error } = useSelector((state) => state.partner);
  
  useEffect(() => {
    dispatch(getAllPartners());
  }, [dispatch]);

  const handleDelete = (id) => {
    confirmAlert({
      title: 'Confirm to Delete',
      message: 'Are you sure you want to delete this partner?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            dispatch(deletePartner(id));
            toast.success('Partner deleted successfully');
          },
        },
        {
          label: 'No',
        },
      ],
    });
  };

  const handleView = (partnerId) => {
    navigate(`/partner-details/${partnerId}`);
  };
  const columns = [
    {
      name: 'Partner Image',
      selector: (row) => row.partnerImage,
      cell: (row) => (
        <img
          src={`https://api.mhbstore.com/${row.partnerImage}`}
          alt={row.partnerName}
          width="50"
          height="50"
        />
      ),
    },
    {
      name: 'Partner Name',
      selector: (row) => row.partnerName,
    },
    {
      name: 'Product Image',
      selector: (row) => row.productImages,
      cell: (row) => (
        <img
          src={
            row.productImages && row.productImages.length > 0
              ? `https://api.mhbstore.com/${row.productImages[0]}`
              : "default_image_url"
          }
          alt={row.productName}
          className="checkout-product-image"
          width="50"
          height="50"
        />
      ),
    },
    {
      name: 'Product Name',
      selector: (row) => row.productName,
    },
    {
      name: 'Phone Number',
      selector: (row) => row.partnerPhoneNumber,
    },
    {
      name: 'Email',
      selector: (row) => row.partnerEmail,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div>
          <Button onClick={() => handleView(row._id)}>
            <AiOutlineEye />
            View
          </Button>
          <Button onClick={() => handleDelete(row._id)}>
            <AiFillDelete />
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2>Partner List</h2>
      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <p>{error}</p>
      ) : (
        <DataTable
          columns={columns}
          data={partners}
          pagination
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default PatnerListPage;
