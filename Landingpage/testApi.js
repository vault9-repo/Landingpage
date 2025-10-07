import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_BASE = "https://v3.football.api-sports.io";
const API_KEY = process.env.API_KEY;

async function testFixtures() {
  const date = new Date().toISOString().split("T")[0]; // today's date YYYY-MM-DD

  try {
    const response = await axios.get(`${API_BASE}/fixtures`, {
      headers: {
        "x-apisports-key": API_KEY
      },
      params: { date }
    });

    console.log("Success! Number of fixtures today:", response.data.response.length);
    console.log("First fixture:", response.data.response[0]);
  } catch (error) {
    console.error("API call failed:", error.response?.data || error.message);
  }
}

testFixtures();
