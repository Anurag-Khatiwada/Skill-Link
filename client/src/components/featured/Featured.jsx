import React,{useState} from 'react';
import "./Featured.css";
import { Link, useNavigate } from 'react-router-dom'
// List of categories for suggestions
const categoriesList = [  'Web Design', 'WordPress', 'Logo Design', 'Digital Marketing', 'AI Services', 
  'Graphic Design', 'Video & Animation', 'Writing & Translation', 'Music & Audio', 
  'Programming & Tech', 'Business', 'Lifestyle', 'Game Development', 'SEO', 
  'Data Science', 'Photo Editing', 'Mobile App Development', 'E-commerce Development', 
  'Social Media Management', 'Content Writing', 'Illustration', '3D Modeling', 
  'Voice Over', 'Online Tutoring', 'Virtual Assistance', 'Project Management'
];

const Featured = () => {
  const [input, setInput] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([])
  const navigate = useNavigate();

  const handleChange = (e)=>{
    const value = e.target.value;
    setInput(value);

    if(value){
      const filtered = categoriesList.filter((cat)=> cat.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCategories(filtered)
    }else{
      setFilteredCategories([])
    }
  }
  
  const handleSuggestion = (category)=>{
    setInput(category);
    setFilteredCategories([])
  }

  const handleSubmit = ()=>{
    navigate(`/gigs?search=${input}`)
  }
  return (
    <div className='featured'>
        <div className="featureContainer">
            <div className="left">
              <div className="title">
                <h1>Are you looking for Freelancers?</h1>
                <p>Hire Great Freelancers, Fast. SKill-Link helps you hire freelancers at a moment's notice</p>
              </div>
              <div className="search">
                <div className="searchInput">
                  <img src="./img/search.svg" alt="" />
                  <input onChange={handleChange} type="text" value={input} placeholder="Search for services" />
                  {filteredCategories.length>0 && ( 
                  <>
                      <div className="suggestions">
                        {filteredCategories.map((category, index)=>(
                          <div key={index} className="suggestionItem" onClick={()=>handleSuggestion(category)}>
                            {category}
                            <hr />
                          </div>
                        ))}
                      </div>
                  </>
                  )}
                </div>
                <button onClick={handleSubmit}  className="buttons">Search</button>
              </div>
              <div className="popular">
               <span>Popular:</span>
               <Link to='/gigs?cat=web design'>  <button>Web Design</button> </Link>
                <Link to='/gigs?cat=wordpress'> <button>WordPress</button> </Link>
                <Link to='/gigs?cat=logo design'> <button>Logo Design</button> </Link>
               <Link to='/gigs?cat=digital marketing'>  <button>Digital marketing</button> </Link>
                <Link to='/gigs?cat=AI services'> <button>AI Services</button> </Link>
              </div>
            </div>
            <div className="right">
              <div className="zero"></div>
              <img src="./img/featured.jpg" alt="" />
              
            </div>
        </div>

    </div>
  )
}

export default Featured

