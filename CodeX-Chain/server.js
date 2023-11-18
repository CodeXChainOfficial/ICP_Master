import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import pkg from 'pg';

const app = express();
const port = 5004;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:1CCf63d-c25c3dgff1Cab6F2A5*C5cFC@roundhouse.proxy.rlwy.net:38917/railway';
const { Client } = pkg;

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
        WHERE table_name = 'plugInToken'
      );
    `);

    const tableExists = result.rows[0].exists;

    if (!tableExists) {
      // Create the LastToken table if it does not exist
      await client.query(`
        CREATE TABLE plugInToken (
          name TEXT,
          symbol TEXT,
          decimals TEXT,
          TotalSupply TEXT,
          walletAddress TEXT
        );
      `);

      console.log('plugInToken table created');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initDatabase();




app.post('/api/pluginERC20', async (req, res) => {
  const { name, symbol, decimals, TotalSupply, walletAddress } = req.body;

  try {
    // Execute the script with the provided data

    const result = await executeBash(name,symbol, decimals, TotalSupply, walletAddress);
   
      const deployedTokens = {name,symbol, deciamls, TotalSupply, walletAddress}
  
        for (const token of deployedTokens) {
          await client.query('INSERT INTO plugInToken VALUES ($1, $2, $3, $4, $5)', [
            token.name,
            token.symbol,
            token.deciamls,
            token.TotalSupply,
            token.walletAddress,
          ]);
        }
    
      
    // Send the data to the frontend
    res.json({
   
    success: true, message: 'Token deployed sduccessfully.',symbol,  name,result,walletAddress, decimals,TotalSupply })
  } catch (error) {
    console.error('Error deploying token:', error);
    res.status(500).json({ success: false, message: 'Error deploying token.' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});