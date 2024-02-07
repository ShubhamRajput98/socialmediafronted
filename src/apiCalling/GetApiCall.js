export const GetApiCall = async (url) => {
  let response = [];

  var myHeaders = new Headers();

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
    credentials: "include",
  };

  await fetch(url, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      response = result;
      return result;
    })
    .catch((error) => console.log("error", error));

  return response;
};
