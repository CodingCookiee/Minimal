import axios from 'axios';

const options = {
  method: 'GET',
  url: 'https://h-m-hennes-mauritz.p.rapidapi.com/categories',
  headers: {
    'x-rapidapi-key': '99bfd117c0msh8450eb73e64501ap1720c4jsne413a0eb57bb',
    'x-rapidapi-host': 'h-m-hennes-mauritz.p.rapidapi.com'
  }
};

export const fetchHMCategories = async () => {
  try {
    const response = await axios.request(options);
    return response.data; // Return the data to be used in the component
  } catch (error) {
    console.error("Error fetching H&M categories:", error);
    throw error; // Rethrow the error for handling in the component
  }
};
