export async function loginRequest(creds){

    const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      };
    
      const baseURL = import.meta.env.VITE_SERVER_URL;
    
      const response = await fetch(baseURL + "login", options);
      return response.accessToken;
}

export async function getOrders(token) {
    const options = {
      method: "GET",
      // the server will reject our request if we don't include the Authorization header with a valid token!
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(baseURL + "orders", options).then(convertToJson);
    return response;
  }