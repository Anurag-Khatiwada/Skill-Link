import React from 'react';
import './ProjectCard.css';
import { Link } from 'react-router-dom';

const ProjectCard = ({item}) => {


  return (
    <Link to={`gig/${item?._id}`} className='link'>
        <div className='projectCard'>
            <img src={item.cover} alt="" />
            <div className="info">
                <img src={item?.user?.img} alt="" />
                <div className="texts">
                    <h2>{item.cat}</h2>
                    <span>{item?.user?.username}</span>
                </div>
            </div>
        </div>
    </Link>
  );
};

export default ProjectCard;
