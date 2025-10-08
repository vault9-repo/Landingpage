import axios from "axios";

const API_BASE = ""; // leave empty if backend is same domain

const getUserId = ()=>{
  let userId = localStorage.getItem("pp_userId");
  if(!userId){
    userId = crypto.randomUUID();
    localStorage.setItem("pp_userId",userId);
  }
  return userId;
}

export const trackClick = async (type)=>{
  try{
    const userId = getUserId();
    await axios.post(`${API_BASE}/api/clicks`, {type,userId});
  }catch(err){
    console.error("Error tracking click:",err.message);
  }
}
