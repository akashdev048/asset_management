import {  client  } from "./index";


export const newLogin = (payload) => client.post(`azure_usermanagment/sso/asset_management/login`, payload);

export const getUserInfo = (token) => client.get(`azure_usermanagment/user/info`, { headers: {"Authorization" : `Bearer ${token}`} } );

export const ssoLogOut = (token) => client.post(`azure_usermanagment/sso/logout`,{}, { headers: {"Authorization" : `Bearer ${token}`} });





