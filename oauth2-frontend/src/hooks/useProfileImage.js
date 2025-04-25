import React, { useState , useEffect } from "react";
import defaultUserImage from "../assets/defaultUserImage.jpeg"

export const useProfileImage = ({user}) => {

    const[imageUrl,setImageUrl] = useState(null); 

    useEffect(() => {

      const checkImage = async () => {

        try{
          
          const token = localStorage.getItem("token");

          if (!token) {
            console.error("No token found, using default image");
            setImageUrl(defaultUserImage);
            return;
          }

          const response = await fetch(`http://localhost:8080/${user.local_picture}`,{ 
            method : "HEAD",
            headers : {
              Authorization : `Bearer ${token}`
            },
          });

          if(response.ok){
            setImageUrl(`http://localhost:8080/${user.local_picture}`);
          }else {
            setImageUrl(defaultUserImage);
          }

        }catch(error){
          console.log(error);
          setImageUrl(defaultUserImage);
        }

      }

      if(user?.local_picture){
        checkImage();
      }else {
        setImageUrl(defaultUserImage);
      }

    }, [user?.local_picture]);

    return imageUrl;

};