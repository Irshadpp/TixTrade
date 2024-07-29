import { useState } from 'react';
import axios from 'axios';

const useRequest = ({ method, url, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      const response = await axios[method](url, body);
      if(onSuccess){
        onSuccess(response.data);
      }
      return response.data;
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(
          <div className="mb-4">
            {error.response.data.errors.map((error, index) => (
              <p key={index} className="text-red-500 text-center mb-2">
                {error.message}
              </p>
            ))}
          </div>
        );
      } else {
        setErrors(
          <div className="mb-4">
            <p className="text-red-500 text-center mb-2">An unexpected error occurred. Please try again later.</p>
          </div>
        );
      }
    }
  };

  return { doRequest, errors };
};

export default useRequest;
