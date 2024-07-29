// ./app/page.js

import React from 'react';
import { headers } from 'next/headers'; // Import from next/headers

const fetchWithHeaders = async (url, headers) => {
  console.log('Fetching URL:', url); // Log URL
  console.log('Request Headers:', headers); // Log headers

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...headers,
        'Host': 'tixtrade.com',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error fetching data:', error);
    return { error: 'Failed to fetch data' };
  }
};


const Page = async () => {
  // Access headers in server components
  const requestHeaders = headers(); // Retrieve request headers

  // Extract cookies if needed
  const cookies = requestHeaders.get('cookie') || '';

  // Define headers to forward in fetch request
  const customHeaders = {
    'Cookie': cookies,
    'User-Agent': requestHeaders.get('user-agent') || '', // Add other headers as needed
  };

  // Fetch data with custom headers
  const data = await fetchWithHeaders('http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/current-user', customHeaders);

  return (
    <div>
      <h1>You are now logged in</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default Page;
