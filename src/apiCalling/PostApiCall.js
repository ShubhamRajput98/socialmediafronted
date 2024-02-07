export const PostApiCall = async (url, data, type) => {
  let response = [];
  var raw = {};
  var myHeaders = new Headers();
  var formdata = new FormData();

  if (type === "form") {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const value = data[key];
        formdata.append(key, value);
      }
    }
  } else {
    myHeaders.append("Content-Type", "application/json");
    raw = JSON.stringify(data);
  }

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: type === "form" ? formdata : raw,
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
