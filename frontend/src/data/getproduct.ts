// src/data/getproduct.ts

import { backendUrl } from "./links"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleProducts = async (access_token: string | undefined): Promise<any> => {
    try {
      const response = await fetch(`${backendUrl}/api/v1/getAllProduct`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${access_token}`
        }
      });
  
      const data = await response.json();
      return data.data;
  
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  