/* eslint-disable prettier/prettier */
/* eslint-disable no-underscore-dangle */
import cloudinary from "../lib/cloudinary.js";
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '../../client/public/Sales');

const uploadFolder = async (folderPath, cloudinaryFolder) => {
  console.log(`Scanning directory: ${folderPath}`);
  const files = await fs.readdir(folderPath, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(folderPath, file.name);
    
    if (file.isDirectory()) {
      // Only convert Men/Women to lowercase, keep other folder names as-is
      const folderName = file.name === 'Men' ? 'men' : 
                        file.name === 'Women' ? 'women' : 
                        file.name;
      const newCloudinaryFolder = `${cloudinaryFolder}/${folderName}`;
      await uploadFolder(fullPath, newCloudinaryFolder);
    } else if (file.isFile() && /\.(jpg|jpeg|png|gif)$/i.test(file.name)) {
      try {
        await cloudinary.uploader.upload(fullPath, {
          folder: cloudinaryFolder,
          public_id: path.parse(file.name).name,
          resource_type: 'auto',
          overwrite: true
        });
        console.log(`✅ Uploaded: ${file.name} to ${cloudinaryFolder}`);
      } catch (error) {
        console.error(`❌ Failed to upload ${file.name}:`, error.message);
      }
    }
  }
};

const main = async () => {
  console.log(`Starting upload from: ${projectRoot}`);
  await uploadFolder(projectRoot, 'minimal/sale');
};

main().catch(console.error);
