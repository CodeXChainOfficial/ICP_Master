import fs from 'fs';

// File paths
const eip1193ProviderPath = 'node_modules/web3-utils/lib/esm/web3_eip1193_provider.js';
const eventEmitterPath = 'node_modules/web3-utils/lib/esm/event_emitter.js';

// Function to remove the EventEmitter import statement
function removeEventEmitterImport(filePath) {
  try {
    let fileContent = fs.readFileSync(filePath, 'utf-8');

    // Remove the import statement for EventEmitter (with or without alias)
    fileContent = fileContent.replace(/import\s*\{\s*EventEmitter(?:\s*as\s*EventEmitterAtNode)?\s*\}\s*from\s*'events';/g, '');

    fs.writeFileSync(filePath, fileContent, 'utf-8');
    console.log(`Removed EventEmitter import from ${filePath}`);
  } catch (error) {
    console.error(`Error while processing ${filePath}:`, error);
  }
}

// Remove EventEmitter import from the specified files
removeEventEmitterImport(eip1193ProviderPath);
removeEventEmitterImport(eventEmitterPath);
