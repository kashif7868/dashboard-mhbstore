import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const PatnerDetails = () => {
  const { partnerId } = useParams(); // Get the partner ID from the URL as 'partnerId'
  const [partner, setPartner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPartnerById = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `https://api.mhbstore.com/api/partners/${partnerId}`
        );
        setPartner(response.data);
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    if (partnerId) {
      fetchPartnerById(); // Fetch the partner data by partnerId
    }
  }, [partnerId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!partner) {
    return <div>No partner found</div>;
  }

  return (
    <div>
      <h2>Partner Details</h2>
      <div style={{ marginBottom: "20px" }}>
        <h3>Partner Information</h3>
        <div>
          <img
            src={`https://api.mhbstore.com/${partner.partnerImage}`}
            alt={partner.partnerName} // This might trigger the warning
            width="150"
            height="150"
          />
          <p>
            <strong>Name:</strong> {partner.partnerName}
          </p>
          <p>
            <strong>Email:</strong> {partner.partnerEmail}
          </p>
          <p>
            <strong>Phone Number:</strong> {partner.partnerPhoneNumber}
          </p>
          <p>
            <strong>Address:</strong> {partner.partnerAddress}
          </p>
          <p>
            <strong>Status:</strong> {partner.status}
          </p>
          <p>
            <strong>Product Name:</strong> {partner.productName}
          </p>
          <p>
            <strong>Product Details:</strong> {partner.productDetails}
          </p>
          <p>
            <strong>Product Stock:</strong> {partner.productStock}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(partner.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div>
        <h3>Product Images</h3>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {partner.productImages && partner.productImages.length > 0 ? (
            partner.productImages.map((image, index) => (
                <img
                src={`https://api.mhbstore.com/${partner.partnerImage}`}
                alt={partner.partnerName}  // Just the partner's name is enough as an alt description
                width="150"
                height="150"
              />
            ))
          ) : (
            <p>No product images available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatnerDetails;
