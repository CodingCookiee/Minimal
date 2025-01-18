/* eslint-disable prettier/prettier */
/* eslint-disable no-underscore-dangle */
import cloudinary from "../lib/cloudinary.js";
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '../../client'); 

const uploadFolder = async (folderPath, cloudinaryFolder) => {
  console.log(`Scanning directory: ${folderPath}`);
  const files = await fs.readdir(folderPath, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(folderPath, file.name);
    
    if (file.isDirectory()) {
      
      const newCloudinaryFolder = `${cloudinaryFolder}/${file.name}`;
      await uploadFolder(fullPath, newCloudinaryFolder);
    } else if (file.isFile() && /\.(jpg|jpeg|png|gif)$/i.test(file.name)) {
      try {
        const result = await cloudinary.uploader.upload(fullPath, {
          folder: cloudinaryFolder,
          public_id: path.parse(file.name).name,
          resource_type: 'auto',
          overwrite: true,
          use_filename: true
        });
        console.log(`✅ Uploaded: ${file.name} to ${cloudinaryFolder}`);
      } catch (error) {
        console.error(`❌ Failed to upload ${file.name}:`, error.message);
      }
    }
  }
};

const main = async () => {
  const baseFolder = path.join(projectRoot, 'public');
  console.log(`Starting upload from base folder: ${baseFolder}`);
  
  const categories = ['Men', 'Women', 'Sales'];
  
  for (const category of categories) {
    const categoryPath = path.join(baseFolder, category);
    console.log(`Processing category: ${category} at path: ${categoryPath}`);
    await uploadFolder(categoryPath, `minimal/${category}`);
  }
};

main().catch(error => {
  console.error('Upload process failed:', error);
  process.exit(1);
});
