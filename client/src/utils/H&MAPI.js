import axios from 'axios';

const baseOptions = {
  headers: {
    'x-rapidapi-key': `${import.meta.env.VITE_RAPIDAPI_KEY}`,
    'x-rapidapi-host': 'h-m-hennes-mauritz.p.rapidapi.com'
  }
};

export const fetchHMCategories = async () => {
  try {
    const response = await axios.request({
      ...baseOptions,
      method: 'GET',
      url: 'https://h-m-hennes-mauritz.p.rapidapi.com/categories'
    });

    // Filter out Valentine's Day edit from subcategories
    const filteredData = {
      ...response.data,
      data: response.data.data.map(category => ({
        ...category,
        subcategory: category.subcategory.filter(sub => 
          !sub.title.toLowerCase().includes('valentine') && !sub.title.toLowerCase().includes('the character shop')
        )
      }))
    };

    return filteredData;
  } catch (error) {
    console.error("Error fetching H&M categories:", error);
    throw error;
  }
};

export const fetchNewArrivals = async (page = 1, perPage = 22) => {
  try {
    const response = await axios.request({
      ...baseOptions,
      method: 'GET',
      url: 'https://h-m-hennes-mauritz.p.rapidapi.com/product/new-arrivals',
      params: {
        page: page.toString(),
        perPage: perPage.toString()
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    throw error;
  }
};
