import React from 'react';
import './CatCard.css';
import { Link } from 'react-router-dom';

const CatCard = ({ item }) => {

  return (
    <Link to={`/gigs?cat=${item.title}`} >
    <div className='catCard'>
      <img className='catcardImg' src={item.img} alt="" />
      <span className="desc">{item.desc}</span>
      <span className="title">{item.title}</span>
  </div>
    </Link>
  );
};

export default CatCard;
