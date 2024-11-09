import React from 'react';
import './CatCard.css';
import { Link } from 'react-router-dom';

const CatCard = ({ item }) => {

  return (
    <Link to={`/gigs?cat=${item.title}`} className="catCard">
      <div className="desc">{item.desc}</div>
      <div className="cardImg"><img src={item.img} alt={item.title} /></div>
      <div className="title">{item.title}</div>
    </Link>
  );
};

export default CatCard;
