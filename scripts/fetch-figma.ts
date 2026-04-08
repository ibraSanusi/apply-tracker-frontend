import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY;

async function fetchFigmaDesign() {
  if (!FIGMA_TOKEN || !FIGMA_FILE_KEY) {
    console.error('Error: FIGMA_TOKEN and FIGMA_FILE_KEY must be set in your .env file.');
    console.error('Current FIGMA_TOKEN:', FIGMA_TOKEN ? '***' : 'missing');
    console.error('Current FIGMA_FILE_KEY:', FIGMA_FILE_KEY ? 'present' : 'missing');
    process.exit(1);
  }

  console.log(`🚀 Fetching Figma design for key: ${FIGMA_FILE_KEY}...`);

  try {
    const response = await fetch(`https://api.figma.com/v1/files/${FIGMA_FILE_KEY}`, {
      headers: {
        'X-Figma-Token': FIGMA_TOKEN,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Figma API returned ${response.status}: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    // Ensure the output directory exists
    const outputDir = path.resolve(process.cwd(), 'src/figma');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, 'design.json');
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');

    console.log(`✅ Success! Design JSON saved to: ${outputPath}`);
  } catch (error) {
    console.error('❌ Error fetching Figma design:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

fetchFigmaDesign();
