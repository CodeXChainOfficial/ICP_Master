import express from 'express';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import cors from 'cors';
import util from 'util';
import { exec } from 'child_process';
import fs from 'fs';
import pg from 'pg'
const app = express();
const port = 5004;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:1CCf63d-c25c3dgff1Cab6F2A5*C5cFC@roundhouse.proxy.rlwy.net:38917/railway';
const { Client } = pg;

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL database');
  } catch (error) {
    console.error('Error connecting to PostgreSQL database:', error);
  }
}

connectToDatabase();


// Check if the LastToken table exists and create it if not
async function initDatabase() {
  try {
    const result = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'LastToken'
      );
    `);

    const tableExists = result.rows[0].exists;

    if (!tableExists) {



      
const launchPadTableExists = await client.query(`
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'LaunchPad'
);

`);



if (!launchPadTableExists.rows[0].exists) {
await client.query(`
  CREATE TABLE LaunchPad (
    id SERIAL PRIMARY KEY,
    name TEXT,
    wallet TEXT,
    description TEXT,
    logo TEXT,
    launchPadType TEXT,
    incubationNeeded BOOLEAN,
    milestoneNeeded BOOLEAN,
    generateDashboard BOOLEAN,
    currency TEXT,
    wallets JSONB,
    walletVotingPower INT
  );
`);

console.log('LaunchPad table created');
}
      // Create the LastToken table if it does not exist
      await client.query(`
        CREATE TABLE LastToken (
          name TEXT,
          symbol TEXT,
          Taddress TEXT,
          walletAddress TEXT,
          category TEXT,
          transactionHash TEXT
        );
      `);

      console.log('LastToken table created');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initDatabase();

const executeScript = async (scriptPath, args) => {
  try {
    const { stdout, stderr } = await exec(`${scriptPath} ${args.join(' ')}`);
    console.log('stdout:', stdout);
    console.error('stderr:', stderr);
    return stdout;
  } catch (error) {
    console.error('Error executing script:', error);
    throw error;
  }
};



// Assuming the output format is like "Canister ID: <canisterId>"
// Assuming the output format is like "Canister ID: <canisterId>"
const executeBashIdentity = async (identity) => {
  const scriptPath = './identity.sh';
  try {
    const scriptOutput = await executeScript(scriptPath, [identity]);

  

    console.log('Bash script execution result:', scriptOutput);
  } catch (error) {
    console.error('Error executing script:', error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};

app.post('/api/saveLaunchPadData', async (req, res) => {
  const launchPadData = req.body;

  try {
    // Assuming you have a LaunchPad table in your database
    await client.query('INSERT INTO LaunchPad (name, wallet, description, logo, launchPadType, incubationNeeded, milestoneNeeded, generateDashboard, currency, wallets, walletVotingPower) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)', [
      launchPadData.name,
      launchPadData.wallet,
      launchPadData.description,
      launchPadData.logo,
      launchPadData.launchPadType,
      launchPadData.incubationNeeded,
      launchPadData.milestoneNeeded,
      launchPadData.generateDashboard,
      launchPadData.currency,
      JSON.stringify(launchPadData.wallets), // Assuming wallets is an array
      launchPadData.walletVotingPower,
    ]);

    res.json({ success: true, message: 'LaunchPad data saved successfully.' });
  } catch (error) {
    console.error('Error saving LaunchPad data:', error);
    res.status(500).json({ success: false, message: 'Error saving LaunchPad data.' });
  }
});


const executeBash = async (image_url, decimals, totalsupply, name, symbol, principal) => {
  const scriptPath = './src/motoko/DIP20/motoko/bash.sh';
  try {

    const scriptOutput = await executeScript(scriptPath, [image_url, decimals, totalsupply, name, symbol, principal]);

    console.log('Bash script execution result:', scriptOutput);
    return scriptOutput;
  } catch (error) {
    console.error('Error executing script:', error);
    return error;
    throw error; // Rethrow the error to handle it in the calling function
  }
};
// Import necessary modules

// ... (previous code)

app.post('/api/dip20', async (req, res) => {
  const { image_url, identity, name, symbol, decimals, totalSupply } = req.body;

  try {
    // Execute the script with the provided data

    const result = await executeBash(image_url,decimals, totalSupply, name, symbol, identity);

    const oldcanisterID=fs.readFileSync('./canister-id-dip20', 'utf8').trim();
    for (;;) {
      const newcanisterId = fs.readFileSync('./canister-id-dip20', 'utf8').trim();
      if (newcanisterId !== oldcanisterID) {
        const canisterId = newcanisterId;
        break;
      }}
      const category = "ICP_DIP20"
      const deployedTokens = {name,symbol, image_url, principal, category , canisterId}
  
        for (const token of deployedTokens) {
          await client.query('INSER T INTO LastToken VALUES ($1, $2, $3, $4, $5, $6)', [
            token.name,
            token.symbol,
            token.image_url,
            token.principal,
            token.category,
            token.canisterID,
          ]);
        }
    
      
    // Send the data to the frontend
    res.json({
      canisterID: canisterId,
      name: name,
      symbol: symbol,
      principal: principal,
    success: true, message: 'Token deployed sduccessfully.',symbol,  canisterId,result,image_url, decimals,totalSupply, name,symbol,identity });
  } catch (error) {
    console.error('Error deploying token:', error);
    res.status(500).json({ success: false, message: 'Error deploying token.' });
  }
});

app.post('/api/identity', async (req, res) => {
  const { identity} = req.body;
  try {
    // Execute the script with the provided data
    // You might need to modify this based on your script
    await executeBashIdentity(identity);

    // Read Canister ID from the file
    const ID = fs.readFileSync('ID-id-file', 'utf8').trim();

    res.json({ success: true, message: 'New Idendity created.', ID });
  } catch (error) {
    console.error('Error deploying token:', error);
    res.status(500).json({ success: false, message: 'Error create identity.' });
  }
});




let storedCanisterInfo = null;

// ... (previous code)

// Define a schema and model for your tokens
/*const tokenSchema = new mongoose.Schema({
  name: String,
  symbol: String,
  tokenAddress: String,
  walletAddress: String,
  category: String,
  // Add other properties as needed
});

const Token = mongoose.model('Token', tokenSchema);



// ... (previous code)*/

/*

app.post('/api/scriptInfo', (req, res) => {
  const { canisterInfo } = req.body;
  storedCanisterInfo = canisterInfo; // Store canisterInfo

  // Respond with a success message
  res.json({ message: 'Data receive successfully',storedCanisterInfo });
});

app.get('/api/scriptInfo', (req, res) => {
  // Respond with the storedCanisterInfo
  res.json({ storedCanisterInfo });
});


app.get('/api/storedCanisterInfo', (req, res) => {
  // Retrieve the storedCanisterInfo (implement this logic based on how you store it)
  const storedCanisterInfo = // retrieve your storedCanisterInfo

  // Respond with the storedCanisterInfo
  res.json({ storedCanisterInfo });
});


app.get("/indexICP", (req, res) => {
  const principal = req.query.principal; // Retrieve the principal from the query parameters
  const agent = JSON.parse(req.query.agent); // Parse the agent from JSON
  const actor = JSON.parse(req.query.actor); // Parse the actor from JSON

  res.send(`
    <html>
      <head>
        <title>ICP Data</title>
      </head>
      <body>
        <h1>Principal: ${principal}</h1>
        <p>Agent: ${JSON.stringify(agent)}</p>
        <p>Actor: ${JSON.stringify(actor)}</p>
      </body>
    </html>
  `);

  // Now you have access to the principal, agent, and actor.

  // Your logic here...

  res.send("Hello ICP Page"); // Respond to the request
});

*/

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});