import React from 'react'
import "./Footer.css"
const Footer = () => {
  return (
  
    <div className='footer'>
      <div className="footerContainer">
        <div className="item">
          <h2>Categories</h2>
          <span>Graphics & Design</span>
          <span>Digital Marketing</span>
          <span>Writing & Translation</span>
          <span>Video & Animation</span>
          <span>Music & Audio</span>
          <span>Programming & Tech</span>
          <span>Data</span>
          <span>Business</span>
          <span>Lifestyle</span>
          <span>Photography</span>
          <span>Sitemap</span>
        </div>
        <div className="item">
          <h2>About</h2>
          <span>Patnerships</span>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>

        </div>
        <div className="item">
          <h2>Support & Education</h2>
          <span>Help & support</span>
          <span>Trust & safety</span>
          <span>Skill-Link Guides</span>
        </div>
      </div> 
      
    </div>
  )
}

export default Footer
