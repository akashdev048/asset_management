import { client, appclient } from "./index";


export const getDeals = (token, deal_id) => appclient.get(`get_deal?deal_id=${deal_id}`, { headers: { "Authorization": `Bearer ${token}` } });
export const getEquipmentNumbers = (token, RsNumber, basin) => appclient.get(`get_bc_resource?resource_group_no=${RsNumber}&basin=${basin}`, { headers: { "Authorization": `Bearer ${token}` } });
export const getEqipment = (token, id) => appclient.get(`get_equipments?id=${id}`, { headers: { "Authorization": `Bearer ${token}` } });
export const getBasins = (token, RsNumber) => appclient.get(`get_basin?resource_group_no=${RsNumber}`, { headers: { "Authorization": `Bearer ${token}` } });

export const getHose = (token, id) =>
  appclient.get(`get_hose?id=${id}`, {
    headers: { "Authorization": `Bearer ${token}` },
  });
export const saveHose = (token, payload) =>
  appclient.post("save_hose", payload, {
    headers: { "Authorization": `Bearer ${token}` },
  });

export const saveEqipment = (token, payload) =>
  appclient.post("save_equipment", payload, {
    headers: { "Authorization": `Bearer ${token}` },
  });


export const getCustomPackage = (token, id) =>
  appclient.get(`get_custom_package?id=${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const saveCustomPackageItems = (token, payload) =>
  appclient.post(
    "save_custom_package_items",
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );


export const getHSE = (token, id) =>
  appclient.get(`get_hse?id=${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const saveHSE = (token, payload) =>
  appclient.post(
    "save_hse", // endpoint path only
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );



export const getRegions = (token) => client.get(`pricebook/get_regions`, { headers: { "Authorization": `Bearer ${token}` } });
export const savePriceBook = (payload, token) => client.post(`pricebook/save_pricebook`, payload, { headers: { "Authorization": `Bearer ${token}` } });


export const updatePriceBook = (payload, token) => client.put(`pricebook/edit_pricebook`, payload, { headers: { "Authorization": `Bearer ${token}` } });

export const deletePriceBook = (id, token) =>
  client.delete(`pricebook/delete_booking?order_id=${id}`, {
    headers: { "Authorization": `Bearer ${token}` }
  });