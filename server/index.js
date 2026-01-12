// Minimal Express backend for LoveLoggy - 1-to-1 Private Couple System
// WARNING: This server is designed for ONE COUPLE ONLY per deployment.
// Each deployment instance is a private space for exactly two people.

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const DB_PATH = path.join(__dirname, 'db.json');
const PORT = process.env.PORT || 3000;

// Single couple system - no coupleId needed, only 2 users allowed
function readDB(){
  try{ return JSON.parse(fs.readFileSync(DB_PATH, 'utf8')); }
  catch(e){ return { user1: null, user2: null, messages:[], keys:[], inviteCode: null, pairedAt: null, startDate: null }; }
}
function writeDB(db){ fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2)); }

const app = express();
app.use(cors());
app.use(express.json({limit:'2mb'}));

// Health
app.get('/api/health',(req,res)=> res.json({ok:true, system: '1-to-1 private couple'}));

// Signup - First user creates the couple, second user joins with invite code
app.post('/api/signup', async (req,res)=>{
  const { name, email, password, inviteCode, startDate } = req.body;
  if(!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });

  const db = readDB();
  
  // Check if both slots are taken
  if(db.user1 && db.user2) return res.status(400).json({ error: 'This couple space is full. Only 2 users allowed.' });
  
  // Check if email already registered
  if((db.user1 && db.user1.email === email.toLowerCase()) || (db.user2 && db.user2.email === email.toLowerCase())) {
    return res.status(400).json({ error: 'Email already registered' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = { id: uuidv4(), name, email: email.toLowerCase(), passwordHash: hashed, profilePic: null, createdAt: new Date().toISOString() };

  // If inviteCode provided, this is user2 joining
  if(inviteCode){
    if(!db.user1) return res.status(400).json({ error: 'No couple to join yet' });
    if(db.inviteCode !== inviteCode.toUpperCase()) return res.status(400).json({ error: 'Invalid invite code' });
    if(db.user2) return res.status(400).json({ error: 'Couple already complete' });
    
    db.user2 = user;
    db.pairedAt = new Date().toISOString();
    writeDB(db);
    return res.json({ success: true, user, coupled: true, partner: { name: db.user1.name, email: db.user1.email, profilePic: db.user1.profilePic } });
  }

  // First user - create the couple and invite code
  if(db.user1) return res.status(400).json({ error: 'First user already exists. Use invite code to join.' });
  
  const invite = generateInvite();
  db.user1 = user;
  db.inviteCode = invite;
  db.startDate = startDate || null;
  db.createdAt = new Date().toISOString();
  writeDB(db);
  
  res.json({ success: true, user, inviteCode: invite, coupled: false, message: 'Share invite code with your partner' });
});

// Login
app.post('/api/login', async (req,res)=>{
  const { email, password } = req.body;
  if(!email || !password) return res.status(400).json({ error: 'Missing fields' });
  
  const db = readDB();
  const user = (db.user1 && db.user1.email === email.toLowerCase()) ? db.user1 : 
               (db.user2 && db.user2.email === email.toLowerCase()) ? db.user2 : null;
  
  if(!user) return res.status(400).json({ error: 'No such user' });
  
  const ok = await bcrypt.compare(password, user.passwordHash);
  if(!ok) return res.status(400).json({ error: 'Invalid credentials' });
  
  const safe = { id: user.id, name: user.name, email: user.email, profilePic: user.profilePic };
  const coupled = !!(db.user1 && db.user2);
  const partner = coupled ? (user.id === db.user1.id ? 
    { name: db.user2.name, email: db.user2.email, profilePic: db.user2.profilePic } :
    { name: db.user1.name, email: db.user1.email, profilePic: db.user1.profilePic }) : null;
  
  res.json({ success: true, user: safe, coupled, partner, inviteCode: coupled ? null : db.inviteCode });
});

// Get couple status
app.get('/api/couple/status',(req,res)=>{
  const db = readDB();
  const coupled = !!(db.user1 && db.user2);
  res.json({
    coupled,
    inviteCode: coupled ? null : db.inviteCode,
    user1: db.user1 ? { name: db.user1.name, profilePic: db.user1.profilePic } : null,
    user2: db.user2 ? { name: db.user2.name, profilePic: db.user2.profilePic } : null,
    pairedAt: db.pairedAt,
    startDate: db.startDate
  });
});

// Register public key for ECDH (no coupleId needed - only one couple)
app.post('/api/keys/register',(req,res)=>{
  const { userId, publicKeyJwk } = req.body;
  if(!userId || !publicKeyJwk) return res.status(400).json({ error: 'Missing fields' });
  
  const db = readDB();
  if(!db.user1 && !db.user2) return res.status(400).json({ error: 'No users yet' });
  
  // Remove any existing key for this user
  db.keys = db.keys.filter(k => k.userId !== userId);
  db.keys.push({ id: uuidv4(), userId, publicKeyJwk, createdAt: new Date().toISOString() });
  writeDB(db);
  res.json({ success: true });
});

// Fetch partner public key (no coupleId needed)
app.get('/api/keys/partner/:userId',(req,res)=>{
  const { userId } = req.params;
  const db = readDB();
  
  // Find the OTHER user's key
  const partnerKey = db.keys.find(k => k.userId !== userId);
  if(!partnerKey) return res.status(404).json({ error: 'Partner key not found' });
  
  res.json({ publicKeyJwk: partnerKey.publicKeyJwk });
});

// Store encrypted message (no coupleId - only one couple exists)
app.post('/api/messages',(req,res)=>{
  const { senderId, senderName, ciphertext, iv } = req.body;
  if(!senderId || !ciphertext || !iv) return res.status(400).json({ error: 'Missing fields' });
  
  const db = readDB();
  if(!db.user1 || !db.user2) return res.status(400).json({ error: 'Couple not complete yet' });
  
  db.messages.push({ 
    id: uuidv4(), 
    senderId, 
    senderName: senderName || 'Unknown',
    ciphertext, 
    iv, 
    createdAt: new Date().toISOString() 
  });
  writeDB(db);
  res.json({ success: true });
});

// Get all messages (no coupleId needed - return all messages for the one couple)
app.get('/api/messages',(req,res)=>{
  const db = readDB();
  res.json({ messages: db.messages || [] });
});

// Serve static front-end if present (useful when running in a single container)
const STATIC_ROOT = path.join(__dirname, '..');
if (fs.existsSync(path.join(STATIC_ROOT, 'index.html'))) {
  app.use(express.static(STATIC_ROOT));
  // Fallback to index.html for non-API routes (SPA friendly)
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(STATIC_ROOT, 'index.html'));
  });
}

function generateInvite(){
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for(let i=0;i<6;i++) code += chars.charAt(Math.floor(Math.random()*chars.length));
  return code;
}

app.listen(PORT, ()=> console.log('LoveLoggy server running on', PORT));
