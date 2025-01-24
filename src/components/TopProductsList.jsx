import React from 'react';
import '../assets/css/topProductsList.css';

const products = [
  { name: 'Patimax Fragrance', items: '100 Items', coupon: '$flat' },
  { name: 'Nulo MedalSeries', items: '100 Items', coupon: '$flat' },
  { name: 'Pedigree Puppy Dry', items: '100 Items', coupon: '$flat' },
];

const TopProductsList = () => (
  <div className="top-products">
    <h3>Top Products</h3>
    <ul>
      {products.map((product, index) => (
        <li key={index}>
          <span>{product.name}</span>
          <span>{product.items}</span>
          <span>{product.coupon}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default TopProductsList;
