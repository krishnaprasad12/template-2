import React from "react";
import "./Contact.css";
import { MdCall } from "react-icons/md";
import { BsFillChatDotsFill } from "react-icons/bs";
import {HiChatBubbleBottomCenter} from 'react-icons/hi2'

// connecting backend
import {useState,useEffect} from 'react';
import axios from 'axios';


const Contact = () => {

  const [contacts,setContacts]=useState([]);

  useEffect(()=> {
    fetchContacts();
  }, []);

  const fetchContacts = async() => {
    try {
      const res = await axios.get('http://localhost:3000/api/contactus')
      const data = res.data;
      setContacts(data);
      console.log(res.data);
    }
    catch(error) {
      console.log(error);
    }
  }

  return (
    <div id="contact-us" className="c-wrapper">
      <div className="paddings innerWidth flexCenter c-container">
        {/* left side */}
        <div className="flexColStart c-left">
          <span className="orangeText">Our Contact Us</span>
          <span className="primaryText">{contacts[0]?.title}</span>
          <span className="secondaryText">
           {contacts[0]?.description}
          </span>

          <div className="flexColStart contactModes">
            {/* first row */}
            <div className="flexStart row">
              <div className="flexColCenter mode">
                <div className="flexStart">
                  <div className="flexCenter icon">
                    <MdCall size={25} />
                  </div>
                  <div className="flexColStart detail">
                    <span className="primaryText">Call</span>
                    <span className="secondaryText">{contacts[0]?.call}</span>
                  </div>
                </div>
                <div className="flexCenter button">Call now</div>
              </div>

              <div className="flexColCenter mode">
                <div className="flexStart">
                  <div className="flexCenter icon">
                    <BsFillChatDotsFill size={25} />
                  </div>
                  <div className="flexColStart detail">
                    <span className="primaryText">Chat</span>
                    <span className="secondaryText">{contacts[0]?.chat}</span>
                  </div>
                </div>
                <div className="flexCenter button">Chat now</div>
              </div>
            </div>

            {/* second row */}
            <div className="flexStart row">
              <div className="flexColCenter mode">
                <div className="flexStart">
                  <div className="flexCenter icon">
                    <BsFillChatDotsFill size={25} />
                  </div>
                  <div className="flexColStart detail">
                    <span className="primaryText">Video Call</span>
                    <span className="secondaryText">{contacts[0]?.videocall}</span>
                  </div>
                </div>
                <div className="flexCenter button">Video Call now</div>
              </div>

              <div className="flexColCenter mode">
                <div className="flexStart">
                  <div className="flexCenter icon">
                    <HiChatBubbleBottomCenter size={25} />
                  </div>
                  <div className="flexColStart detail">
                    <span className="primaryText">Message</span>
                    <span className="secondaryText">0{contacts[0]?.message}</span>
                  </div>
                </div>
                <div className="flexCenter button">Message now</div>
              </div>
            </div>
          </div>
        </div>

        {/* right side */}
        <div className="flexEnd c-right">
          <div className="image-container">
            <img src={`http://localhost:3000/${contacts[0]?.imageUrl}`} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
