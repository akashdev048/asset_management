
import axios from "axios";


let url = window.location.href.includes('prod') ? '' :  'https://usermanagement-backend-dev-ca.proudground-2e220f19.westus2.azurecontainerapps.io/api/v1/'
export const client = axios.create({
  baseURL: url
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 500) {
      // localStorage.clear();
      // window.location.href = "/";
    }
    else if (error.response.status == 401) {
       localStorage.clear()
       window.location.href = "/login";
    }
    else {
      return error.response
    }
  }
);

let appUrl = window.location.href.includes('prod') ? '' :  'https://asset-management-backend-dev-ca.ambitiousisland-6ec47473.westus2.azurecontainerapps.io/api/v1/asset_management/'
export const appclient = axios.create({
  baseURL: appUrl
});

appclient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 500) {
      // localStorage.clear();
      // window.location.href = "/";
    }
    else if (error.response.status == 401) {
       localStorage.clear()
       window.location.href = "/login";
    }
    else {
      return error.response
    }
  }
);





