export const DeleteApiCall = async (url) => {
  let responce = [];
  var requestOptions = {
    method: "DELETE",
    redirect: "follow",
    credentials: "include",
  };

  await fetch(url, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      responce = result;
      return result;
    })
    .catch((error) => console.log("error", error));

  return responce;
};
