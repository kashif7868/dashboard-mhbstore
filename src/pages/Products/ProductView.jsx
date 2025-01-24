import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../assets/css/product/productView.css";
import { FaStar } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { getProductById } from "../../app/reducers/productSlice";

const ProductView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productId } = useParams();

  // State variables for product options
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedMeter, setSelectedMeter] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Fetch product from Redux store based on productId from URL
  const product = useSelector((state) =>
    state.product.products.find((p) => p._id === productId)
  );

  // Fetch related products based on category (assuming `categoryId` or `firstLevelCategory`)
  const relatedProducts = useSelector((state) =>
    state.product.products.filter(
      (related) =>
        related.firstLevelCategory === product?.firstLevelCategory &&
        related._id !== product?._id
    )
  );

  const isLoading = !product; // Loading state for when product is being fetched

  useEffect(() => {
    if (productId) {
      dispatch(getProductById(productId)); // Fetch product by ID
    }
  }, [dispatch, productId]);

  if (isLoading) {
    return <div className="error-message">Loading product...</div>;
  }

  const handleQuantityChange = (type) => {
    if (type === "increment") {
      setQuantity(quantity + 1);
    } else if (type === "decrement" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="product-view-container">
      {/* Product Images */}
      <div className="product-images-section">
        {product.images && product.images.length > 0 ? (
          <>
            <img
              src={`https://api.mhbstore.com/${product.images[selectedImageIndex]}`}
              alt={product.productName}
              className="main-product-image"
            />
            <div className="thumbnail-container">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={`https://api.mhbstore.com/${image}`}
                  alt={`Thumbnail ${index + 1}`}
                  className={`thumbnail ${
                    index === selectedImageIndex ? "thumbnail-active" : ""
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="error-message">No images available</div>
        )}
      </div>

      {/* Product Details */}
      <div className="product-details-section">
        <div className="product-details-contant-info">
          <h1 className="product-title">{product.productName}</h1>
          <p className="product-description">{product.description}</p>
          <div className="product-reviews-section">
            <p>Reviews:</p>
            <div className="stars-container">
              {Array.from({ length: 5 }).map((_, index) => (
                <FaStar
                  key={index}
                  className={`star ${
                    index < Math.round(product.ratings) ? "star-filled" : ""
                  }`}
                />
              ))}
              <span>({product.ratings.toFixed(1)})</span>
            </div>
          </div>
          <div className="quantity-section">
            <button
              onClick={() => handleQuantityChange("decrement")}
              className="quantity-btn"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="quantity-value">{quantity}</span>
            <button
              onClick={() => handleQuantityChange("increment")}
              className="quantity-btn"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <div className="product-price-section">
            {product.oldPrice && (
              <span className="old-price">
                ₨ <del>{product.oldPrice}</del>
              </span>
            )}
            <span className="current-price">₨ {product.price * quantity}</span>
          </div>

          {/* Color Options */}
          {product.colors && product.colors.length > 0 && (
            <div className="color-options-section">
              <p>Colors:</p>
              <div className="color-options">
                {product.colors.split(",").map((color, index) => (
                  <div
                    key={index}
                    className={`color-box ${
                      selectedColor === color ? "color-active" : ""
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    onClick={() => setSelectedColor(color)}
                  ></div>
                ))}
              </div>
            </div>
          )}

          {/* Size Options */}
          {product.size && (
            <div className="size-options-section">
              <p>Size:</p>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                <option value="">Select Size</option>
                {["Small", "Medium", "Large"].map((size, index) => (
                  <option key={index} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Meter Options */}
          {product.meter && (
            <div className="meter-options-section">
              <p>Meters:</p>
              <select
                value={selectedMeter}
                onChange={(e) => setSelectedMeter(e.target.value)}
              >
                <option value="">Select Meterage</option>
                <option value={product.meter}>{product.meter}m</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      <div className="related-products-section">
        <h3>Related Products</h3>
        <div className="related-products-grid">
          {relatedProducts.slice(0, 4).map((related) => (
            <div
              key={related._id}
              className="related-product-card"
              onClick={() => navigate(`/product-view-details/${related._id}`)}
            >
              <img
                src={`https://api.mhbstore.com/${related.images[0]}`}
                alt={related.productName}
                className="related-product-img"
              />
              <div className="related-product-info">
                <p className="related-product-name">{related.productName}</p>
                <div className="related-product-price">
                  {related.oldPrice && (
                    <p className="related-product-old-price">
                      <del>₨ {related.oldPrice}</del>
                    </p>
                  )}
                  <p className="related-product-current-price">
                    ₨ {related.price}
                  </p>
                </div>
                <div className="related-product-rating">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      color={i < Math.floor(related.ratings) ? "#ffc107" : "#e4e5e9"}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductView;
