import axios from 'axios';

const getAuthToken = () => {
  return localStorage.getItem('access_token');
};

export const fetchData = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const postData = async (url, data, useFormData = false) => {
  try {
    const headers = {
      'Authorization': `Bearer ${getAuthToken()}`,
    };

    if (!useFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await axios.post(url, data, {
      headers,
      maxBodyLength: Infinity,
    });

    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

export const updateData = async (url, data, useFormData = false) => {
  try {
    const headers = {
      'Authorization': `Bearer ${getAuthToken()}`,
    };

    if (!useFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await axios.put(url, data, {
      headers,
      maxBodyLength: Infinity,
    });

    return response.data;
  } catch (error) {
    console.error('Error updating data:', error);
    throw error;
  }
};

export const deleteData = async (url) => {
  try {
    const response = await axios.delete(url, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
      maxBodyLength: Infinity,
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting data:', error);
    throw error;
  }
};
