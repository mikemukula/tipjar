import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'database.json');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Initialize Database JSON file if it doesn't exist
const initialData = {
  creator: {
    name: 'Nuwayama',
    username: 'nuwayama',
    bio: 'Sharing authentic Ugandan food recipes from Kampala. Your G$ tips help buy fresh local ingredients!',
    youtube: 'https://youtube.com/c/nuwayama',
    twitter: 'https://twitter.com/nuwayama'
  },
  tips: [
    {
      sender: 'Alice K.',
      address: '0x321a...d93e',
      amount: 25,
      message: 'The Rolex (street food) recipe was incredible! 🔥 Tried it this morning.',
      date: 'Jun 5, 2026, 10:15 AM'
    },
    {
      sender: 'Kev_Celo',
      address: '0x992b...fa10',
      amount: 100,
      message: 'Amazing content. Excited to see more local chefs using GoodDollar UBI!',
      date: 'Jun 4, 2026, 8:43 PM'
    },
    {
      sender: 'Shreya',
      address: '0x00f1...89a1',
      amount: 50,
      message: 'Greetings from Kenya! Love the presentation.',
      date: 'Jun 4, 2026, 2:12 PM'
    }
  ]
};

const readDB = () => {
  try {
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading database file:', err);
    return initialData;
  }
};

const writeDB = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing to database file:', err);
  }
};

// API Endpoints

// 1. Get current creator profile
app.get('/api/profile', (req, res) => {
  const db = readDB();
  res.json(db.creator);
});

// 2. Save/Update creator profile
app.post('/api/profile', (req, res) => {
  const db = readDB();
  db.creator = { ...db.creator, ...req.body };
  writeDB(db);
  res.json({ success: true, profile: db.creator });
});

// 3. Get all tips
app.get('/api/tips', (req, res) => {
  const db = readDB();
  res.json(db.tips);
});

// 4. Add a new tip
app.post('/api/tips', (req, res) => {
  const db = readDB();
  const newTip = {
    sender: req.body.sender || 'Anonymous Fan',
    address: req.body.address || '0x' + Array.from({length: 8}, () => Math.floor(Math.random()*16).toString(16)).join('...') + Array.from({length: 4}, () => Math.floor(Math.random()*16).toString(16)).join(''),
    amount: parseInt(req.body.amount) || 0,
    message: req.body.message || 'Supported the creator!',
    date: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  };
  
  db.tips = [newTip, ...db.tips];
  writeDB(db);
  res.json({ success: true, tip: newTip });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
