import express from 'express';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import cors from 'cors';
import util from 'util';
import { exec } from 'child_process';
import fs from 'fs';
import pg from 'pg'
import mysql from 'mysql2/promise';

const app = express();
const port = 5004;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const databaseConfig = {
  host: 'codex1.cde9gjtj7yue.us-east-1.rds.amazonaws.com',
  user: 'codex1',
  password: '9LRs31mXqzW2aylZ3pfL',
  database: 'codex1',
  port: 3306
};

// Create a MySQL connection pool
const pool = mysql.createPool(databaseConfig);

// Check if the LastToken and LaunchPad tables exist and create them if not
async function initDatabase() {
  try {
    // Check for LastToken table
    const [lastTokenRows] = await pool.query("SHOW TABLES LIKE 'LastToken'");
    if (lastTokenRows.length === 0) {
      await pool.query(`
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

    // Check for LaunchPad table
    const [launchPadRows] = await pool.query("SHOW TABLES LIKE 'LaunchPad'");
    if (launchPadRows.length === 0) {
      await pool.query(`
        CREATE TABLE LaunchPad (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name TEXT,
          wallet TEXT,
          description TEXT,
          logo TEXT,
          launchPadType TEXT,
          incubationNeeded BOOLEAN,
          milestoneNeeded BOOLEAN,
          generateDashboard BOOLEAN,
          currency TEXT,
          wallets JSON, // Assuming MySQL 5.7.8 or later for JSON support
          walletVotingPower INT
        );
      `);
      console.log('LaunchPad table created');
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
    await pool.query('INSERT INTO LaunchPad (name, wallet, description, logo, launchPadType, incubationNeeded, milestoneNeeded, generateDashboard, currency, wallets, walletVotingPower) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
      launchPadData.name,
      launchPadData.wallet,
      launchPadData.description,
      launchPadData.logo,
      launchPadData.launchPadType,
      launchPadData.incubationNeeded,
      launchPadData.milestoneNeeded,
      launchPadData.generateDashboard,
      launchPadData.currency,
      JSON.stringify(launchPadData.wallets),
      launchPadData.walletVotingPower,
    ]);

    res.json({ success: true, message: 'LaunchPad data saved successfully.' });
  } catch (error) {
    console.error('Error saving LaunchPad data:', error);
    res.status(500).json({ success: false, message: 'Error saving LaunchPad data.' });
  }
});
app.post('/api/saveDeployedTokens', async (req, res) => {
  const deployedTokens = req.body.deployedTokens;

  try {
    for (const token of deployedTokens) {
      await pool.query('INSERT INTO LastToken (name, symbol, Taddress, walletAddress, category, transactionHash) VALUES (?, ?, ?, ?, ?, ?)', [
        token.name,
        token.symbol,
        token.Taddress,
        token.walletAddress,
        token.category,
        token.transactionHash,
      ]);
    }

    res.json({ success: true, message: 'Tokens saved successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error saving tokens.' });
  }
});

app.get('/api/getDeployedTokens', async (req, res) => {
  const { category, walletAddress } = req.query;

  try {
    let query = 'SELECT name, symbol, Taddress, walletAddress, category, transactionHash FROM LastToken';
    const params = [];

    if (category && walletAddress) {
      query += ' WHERE category = ? AND walletAddress = ?';
      params.push(category, walletAddress);
    } else if (category) {
      query += ' WHERE category = ?';
      params.push(category);
    } else if (walletAddress) {
      query += ' WHERE walletAddress = ?';
      params.push(walletAddress);
    }

    const [storedTokens] = await pool.query(query, params);

    if (storedTokens.length === 0) {
      res.json({ success: true, message: 'No tokens found for the given category and wallet address.', deployedTokens: [] });
    } else {
      res.json({ success: true, deployedTokens: storedTokens });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error retrieving tokens.' });
  }
});


app.get('/api/getDeployedTokensCount', async (req, res) => {
  try {
    const [result] = await pool.query('SELECT COUNT(*) as count FROM LastToken');
    const lasttokensCount = result[0].count;

    res.json({ success: true, tokensCount: lasttokensCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error retrieving token count.' });
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