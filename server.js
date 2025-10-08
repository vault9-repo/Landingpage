import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import Click from "./models/Click.js";
import Fixture from "./models/Fixture.js";
import Prediction from "./models/Prediction.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI,{
  useNewUrlParser:true,
  useUnifiedTopology:true
})
.then(()=>console.log("✅ MongoDB connected"))
.catch(err=>console.error("❌ MongoDB error:", err));

// Serve static files
app.use(express.static(path.join(__dirname,"public")));

// ---------------- FIXTURES ----------------
app.get("/admin/fixtures", async (req,res)=>{
  const fixtures = await Fixture.find().sort({date:1,time:1});
  res.json(fixtures);
});
app.post("/admin/fixture", async (req,res)=>{
  const {_id,date,time,homeTeam,awayTeam,leagueId} = req.body;
  if(_id) await Fixture.findByIdAndUpdate(_id,{date,time,homeTeam,awayTeam,leagueId});
  else await new Fixture({date,time,homeTeam,awayTeam,leagueId}).save();
  res.json({success:true});
});
app.delete("/admin/fixture", async (req,res)=>{
  const {_id} = req.body;
  await Fixture.findByIdAndDelete(_id);
  res.json({success:true});
});

// ---------------- PREDICTIONS ----------------
app.get("/admin/predictions", async (req,res)=>{
  const predictions = await Prediction.find();
  res.json(predictions);
});
app.post("/admin/prediction", async (req,res)=>{
  const {_id,homeTeam,awayTeam} = req.body;
  if(_id) await Prediction.findByIdAndUpdate(_id,{homeTeam,awayTeam});
  else await new Prediction({homeTeam,awayTeam}).save();
  res.json({success:true});
});
app.delete("/admin/prediction", async (req,res)=>{
  const {_id} = req.body;
  await Prediction.findByIdAndDelete(_id);
  res.json({success:true});
});

// ---------------- CLICK TRACKING ----------------
const getToday = ()=> new Date().toISOString().slice(0,10);

// Record click
app.post("/api/clicks", async (req,res)=>{
  const {type,userId} = req.body;
  if(!type || !userId) return res.status(400).json({error:"Missing type or userId"});

  let doc = await Click.findOne({date:getToday()});
  if(!doc){
    doc = new Click({
      date: getToday(),
      homepage:0,
      download:0,
      facebook:0,
      whatsapp:0,
      telegram:0,
      gmail:0,
      users:[]
    });
  }

  // Only count one click per user per type per day
  if(!doc.users.some(u=>u.userId===userId && u.type===type)){
    doc[type] = (doc[type]||0)+1;
    doc.users.push({userId,type});
    await doc.save();
  }

  res.json({success:true});
});

// Get today's clicks
app.get("/admin/clicks", async (req,res)=>{
  const doc = await Click.findOne({date:getToday()});
  res.json({
    homepageClicks: doc?.homepage||0,
    downloadClicks: doc?.download||0,
    facebook: doc?.facebook||0,
    whatsapp: doc?.whatsapp||0,
    telegram: doc?.telegram||0,
    gmail: doc?.gmail||0
  });
});

// ---------------- FRONTEND ROUTES ----------------
app.get("/admin",(req,res)=>res.sendFile(path.join(__dirname,"public","admin.html")));
app.get("*",(req,res)=>res.sendFile(path.join(__dirname,"public","index.html")));

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>console.log(`🚀 Server running on http://localhost:${PORT}`));
