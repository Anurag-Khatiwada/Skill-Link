import React from 'react';
import "./Home.css"
import Featured from '../../components/featured/Featured';
import Slide from '../../components/slide/Slide';
import { cards } from "../../data";
import { projects } from "../../data";
import CatCard from "../../components/catCard/CatCard";
import ProjectCard from '../../components/projectCard/ProjectCard';

const Home = () => {
  return (
    <div>
      <Featured />
      <h1 className='SERVICE'>Services:</h1>
      <Slide slidesToShow={3} arrowsScroll={3}>
        {
          cards.map(card => (
            <CatCard key={card.id} item={card} />
          ))
        }
      </Slide>
      <div className="ads">
        <div className="adsContainer">
          <div className="item1">
            <img src="/public/img/girl.png" alt="" />
          </div>
          <div className="item2">
            <h1>Find The Best Freelancers Here </h1>
            <div className="f1">
              <div className="check">
                <img src="/public/img/check.svg" alt="" />
                <h2>24/7 AI Chatbot Assistance</h2>
              </div>
              <div className="content">
                <p>Get instant support anytime with our intelligent AI chatbot. Available 24/7 for your convenience.</p>
              </div>
            </div>
            <div className="f1">
              <div className="check">
                <img src="/public/img/check.svg" alt="" />
                <h2>Skilled Freelancers for Every Need</h2>
              </div>
              <div className="content">
                <p>Find the perfect freelancer from our pool of verified professionals. Guaranteed quality for any project need.</p>
              </div>
            </div>
            <div className="f1">
              <div className="check">
                <img src="/public/img/check.svg" alt="" />
                <h2>Secure Payment System</h2>
              </div>
              <div className="content">
                <p>Your funds are secure with us. Release payments only when you're satisfied.</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>
      <h1 className='PROFILE'>Profile:</h1> 
      <Slide slidesToShow={3} arrowsScroll={3}> 
        {
          projects.map(card => (
            <ProjectCard key={card.id} item={card} />
          ))
        }
      </Slide>
    </div>
  );
};

export default Home;

