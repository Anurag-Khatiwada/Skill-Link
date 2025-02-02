import React from 'react';
import './ProjectCard.css';
import { Link } from 'react-router-dom';

const ProjectCard = ({ item }) => {
  return (
    <Link to={`gig/${item?._id}`} className='link'>
      <div className='projectCard'>
        <img src={item.cover} alt={item.cat} className="coverImage" />
        <div className="info">
          <img src={item?.user?.img} alt={item?.user?.username} className="userImage" />
          <div className="texts">
            <h2>{item.cat}</h2>
            <span>by {item?.user?.username}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;