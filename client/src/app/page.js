// ./app/page.js

import React from 'react';
import { headers } from 'next/headers';
import { NextRequest } from 'next/server';
import axios from 'axios';



const Page = async () => {
  const authorization = headers().get('Host')
  console.log(NextRequest.cookies.getAll())
  
  // console.log('================',{...headers()})

  const response = await axios.get('http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/current-user',{
    ...headers()
  }
  );
  console.log("------------",response);
  return (
    <div>
      <h1>You are now logged in</h1>
      {/* <pre>{JSON.stringify(data ,null, 2)}</pre> */}
    </div>
  );
};

export default Page;
