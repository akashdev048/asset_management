import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { Navbar, Row, Col, Container, Form, Table, Offcanvas, Dropdown, Card, Accordion } from "react-bootstrap";
import Select from "react-select";

import logo from '../../assets/images/s3sLogo.png';
import plusIcon from '../../assets/images/plus-btn-icon.svg';
import minusIcon from '../../assets/images/minus-btn-icon.svg';
import bellIcon from '../../assets/images/bell-icon.svg';
import toggleMenuIcon from '../../assets/images/toggle-menu-icon.svg';
import exclamationIcon from '../../assets/images/exclamation-icon.svg';
import { getDeals, getEquipmentNumbers, getBasins, getEqipment, saveEqipment, getHose, saveHose, 
    getCustomPackage, saveCustomPackageItems, getHSE, saveHSE,getLabItems,saveLabItems } from "../../Services/dashboard";
import FullScreenLoader from "../../Component/Loader";
import Header from "../../Component/Header";

function Home() {
    let [activeTab, setActiveTab] = useState('equipment')
    let [isBasinLoading, setIsBasinLoading] = useState(false)
    const [showLoader, setShowLoader] = useState(false);
    const itemOptions = [
        { value: "item 1", label: "item 1" },
        { value: "item 2", label: "item 2" },
    ];
    let [raNumbers, setRaNumbers] = useState([])
    let [basins, setBasins] = useState([])

    let [deals, setDeals] = useState(
        {
            "ID": '',
            "HS_Deal_ID": '',
            "JobName": "",
            "CustomerName": "",
            "PlatformName": null,
            "NeededOnSiteBy": "",
            "SiteAddress": "",
            "AreaManager": "",
            "FieldLeader": "",
            "PrimaryBasin": ""
        }
    )


    let [equipments, setEquipments] = useState(
        [
            {
                equipment_id: 0,
                assetType: '',
                salesQuantity: null,
                operationQuantity: null,
                suppliedQuantity: null,
                Assets: [
                    {
                        SuppliedBy: {
                            value: "", label: ""
                        },
                        AssetDetails: [
                            {
                                value: null, label: "", BCR_ID: null
                            }
                        ]
                    },
                    {
                        SuppliedBy: {
                            value: "", label: ""
                        },
                        AssetDetails: [
                            {
                                value: null, label: "", BCR_ID: null
                            }
                        ]
                    }
                ],
                notes: ''
            }
        ]
    )

    let [houses, setHouses] = useState([
        {
            index: 0,
            houseType: '',
            houseDiameter: null,
            sectionLength: null,
            endFittingType: '', // 👈 renamed
            quantity: null,
            suppliedBy: '',
        },
    ]);


    let [items, setItems] = useState([
        {
            index: 0,
            itemName: '',
            quantity: null,
            suppliedBy: '',

        }
    ])

    let [customPackages, setCustomPackages] = useState([
        {
            index: 0,
            itemName: '',
            quantity: null,
            suppliedBy: '',
            notes: ''
        }
    ])
    const [hseItems, setHseItems] = useState([
        {
            ID: 0,
            HSEItemID: 0,
            itemName: "",
            quantity: null,
            size: "",
            suppliedBy: "",
        },
    ]);

    const [labItems, setLabItems] = useState([
  {
    ID: 0,
    LabItemsID: 0,
    itemName: "",
    quantity: null,
    suppliedBy: "",
  },
]);

    useEffect(() => {
        fetchDealById(383)
        fetchHose(3);
        fetchCustomPackage(3); // new
        fetchHSEItems(3);
        fetchLabItems(3)
        // fetchRsNumber('RA')
        // fetchBasins()
    }, []);


    let fetchDealById = async (deal_id) => {
        setShowLoader(true)
        let res = await getDeals(localStorage?.access_token, deal_id)
        // setShowLoader(false)
        if (res.status == 200) {
            if (res.data?.status_code == 200) {
                setDeals(res?.data?.result)
                fetchEqipment(res?.data?.result?.ID)
            }
        }
    }

    let fetchEqipment = async (equipment_id) => {
        let res = await getEqipment(localStorage?.access_token, equipment_id)
        setShowLoader(false)
        if (res.status == 200) {
            if (res.data?.status_code == 200) {
                const output = res?.data?.result.map(item => ({
                    equipment_id: item.EquipmentID ?? 0,
                    AssetType: item.AssetType ?? '',
                    SalesQuantity: item.SalesQuantity ?? null,
                    OperationQuantity: item.OperationQuantity ?? null,
                    SuppliedQuantity: item.SuppliedQuantity ?? null,
                    Assets: item?.Assets.length ?
                        item?.Assets.map(asset => ({
                            SuppliedBy: { value: asset.SuppliedBy, label: asset.SuppliedBy },
                            AssetDetails: asset.AssetDetails.map(detail => ({
                                value: detail.AssetID,
                                label: detail.AssetNo,
                                BCR_ID: detail.BCR_ID
                            }))
                        })) : [],

                    Notes: item.Notes ?? ''
                }));
                setEquipments(output)
            }
        }
    }
    let fetchHose = async (hose_id) => {
        setShowLoader(true);
        try {
            let res = await getHose(localStorage?.access_token, hose_id);
            setShowLoader(false);

            if (res.status === 200 && res.data?.status_code === 200) {
                const formatted = res.data.result.map((item, index) => ({
                    index,
                    houseType: item.HoseType ?? '',
                    houseDiameter: item.HoseDiameter ?? null,
                    sectionLength: item.SectionLength ?? null,
                    endFittingType: item.EndFittingType ?? '',
                    quantity: item.Quantity ?? null,
                    suppliedBy: item.SuppliedBy
                        ? { value: item.SuppliedBy, label: item.SuppliedBy } // ✅ fix
                        : null,
                }));

                setHouses(formatted);
            }
        } catch (err) {
            console.error("Error fetching hoses:", err);
            setShowLoader(false);
        }
    };

    let fetchCustomPackage = async (package_id) => {
        setShowLoader(true);
        try {
            const res = await getCustomPackage(localStorage?.access_token, package_id);
            setShowLoader(false);

            if (res.status === 200 && res.data?.status_code === 200) {
                const formatted = res.data.result.map((item, index) => ({
                    index,
                    itemName: item.ItemName ?? '',       // match table field
                    quantity: item.Quantity ?? 0,
                    suppliedBy: item.SuppliedBy ?? '',
                    notes: item.Notes ?? '',
                }));

                setCustomPackages(formatted);
            }
        } catch (error) {
            console.error("Error fetching custom packages:", error);
            setShowLoader(false);
        }
    };

    const fetchHSEItems = async (job_id) => {
        setShowLoader(true);
        try {
            const res = await getHSE(localStorage?.access_token, job_id);
            setShowLoader(false);

            if (res.status === 200 && res.data?.status_code === 200) {
                const formatted = res.data.result.map((item, index) => ({
                    ID: item.ID ?? 0,
                    HSEItemID: item.HSEItemID ?? 0,
                    itemName: item.ItemName ?? "",
                    quantity: item.Quantity ?? "",
                    size: item.Size ?? "",
                    suppliedBy: item.SuppliedBy ?? "",
                }));
                setHseItems(formatted);
            }
        } catch (error) {
            console.error("Error fetching HSE items:", error);
            setShowLoader(false);
        }
    };
const fetchLabItems = async (job_id) => {
  setShowLoader(true);
  try {
    const res = await getLabItems(localStorage?.access_token, job_id);
    setShowLoader(false);

    if (res.status === 200 && res.data?.status_code === 200) {
      const formatted = res.data.result.map((item, index) => ({
        index,
        ID: item.ID ?? null,
        LabItemsID: item.LabItemsID ?? null,
        itemName: item.ItemName ?? "",
        quantity: item.Quantity ?? null,
        suppliedBy: item.SuppliedBy ?? "",
      }));

      setLabItems(formatted);
    }
  } catch (error) {
    console.error("Error fetching lab items:", error);
    setShowLoader(false);
  }
};



    let fetchRsNumber = async (RsNumber, basin) => {
        setIsBasinLoading(true)
        let res = await getEquipmentNumbers(localStorage?.access_token, RsNumber, basin)
        setIsBasinLoading(false)
        if (res.status == 200) {
            if (res.data?.status_code == 200) {
                const output = res?.data?.result?.data?.map(item => ({
                    value: item.ID,
                    label: item.AssetName
                }));
                setRaNumbers(output)
            }
        }
    }

    let fetchBasins = async (assetType) => {
        setIsBasinLoading(true)
        let res = await getBasins(localStorage?.access_token, assetType)
        setIsBasinLoading(false)
        if (res.status == 200) {
            if (res.data?.status_code == 200) {
                const output = res?.data?.result.map(item => ({
                    value: item,
                    label: item
                }));
                //return output
                setBasins(output)
            }
        }
    }


    let handleAddData = (type, index) => {
        if (type === 'equipment') {
            let temp = [...equipments]
            let obj = {
                equipment_id: equipments.length,
                assetType: '',
                salesQuantity: '',
                operationQuantity: null,
                suppliedQuantity: null,
                assetDetails: [],
                notes: ''
            }
            temp.push(obj)
            setEquipments(temp)
        }
        else if (type === 'house') {
            let temp = [...houses]
            let obj = {
                index: houses.length,
                houseType: '',
                houseDiameter: null,
                sectionLength: null,
                endFittingType: '', // ✅ match state
                quantity: null,
                suppliedBy: '',
            }
            temp.push(obj)
            setHouses(temp)
        }

        else if (type === 'item') {
            let temp = [...items]
            let obj = {
                index: items.length,
                itemName: '',
                quantity: null,
                suppliedBy: '',
            }
            temp.push(obj)
            setItems(temp)
        }
        else if (type === 'custom') {
            let temp = [...customPackages];
            let obj = {
                index: customPackages.length,
                packageID: 0,
                packageName: '',
                description: '',
                quantity: 0,
                suppliedBy: null,
            };
            temp.push(obj);
            setCustomPackages(temp);
        }

    }
    let handleRemoveData = (type, index) => {
        if (type === 'equipment') {
            let temp = [...equipments]
            let updatedData = temp.filter((val => val.equipment_id !== index))
            setEquipments(updatedData)
        }
        else if (type === 'house') {
            let temp = [...houses]
            let updatedData = temp.filter((val => val.index !== index))
            setHouses(updatedData)
        }
        else if (type === 'item') {
            let temp = [...items]
            let updatedData = temp.filter((val => val.index !== index))
            setItems(updatedData)
        }
        else if (type === 'custom') {
            let temp = [...customPackages]
            let updatedData = temp.filter((val => val.index !== index))
            setCustomPackages(updatedData)
        }
    }

    let handleInputChange = (type, event, index) => {
        let { name, value } = event.target
        if (type === 'equipment') {
            let temp = [...equipments]
            temp[index][name] = value
            setEquipments(temp)
        }
        else if (type === 'house') {
            let temp = [...houses]
            temp[index][name] = value
            setHouses(temp)
        }
        else if (type === 'item') {
            let temp = [...items]
            temp[index][name] = value
            setItems(temp)
        }
        else if (type === "custom") {
            const temp = [...customPackages];
            temp[index][name] = value;
            setCustomPackages(temp);
        }
    }
    let handleSelectChange = (type, selectedOption, index, fieldName) => {
        if (type === 'equipment') {
            let temp = [...equipments];
            temp[index][fieldName] = selectedOption;
            setEquipments(temp);
        }
        else if (type === 'house') {
            let temp = [...houses];
            temp[index][fieldName] = selectedOption; // keep full {value, label}
            setHouses(temp);
        }
        else if (type == 'item') {
            let temp = [...items]
            temp[index][fieldName] = selectedOption
            setItems(temp)
        }
        else if (type === 'custom') {
            let temp = [...customPackages];
            temp[index][fieldName] = selectedOption;
            setCustomPackages(temp);
        }

        else if (type == 'suppliedBy') {
            let temp = [...equipments]
            temp[index].Assets[fieldName].SuppliedBy = selectedOption
            setEquipments(temp)
        }

    }

    let handleDealsChange = (e) => {
        let { name, value } = e.target
        setDeals({
            ...deals,
            [name]: value
        })
    }

    let handleSave = async () => {
        if (activeTab == 'equipment') {
            /// equipment api call
            const output = equipments.map(item => ({
                EquipmentID: item.equipment_id || null,
                AssetType: item.AssetType || "",
                SalesQuantity: item.SalesQuantity || null,
                OperationQuantity: item.OperationQuantity || null,
                SuppliedQuantity: item.SuppliedQuantity || null,
                Notes: item.Notes || "",
                Assets: item.Assets.map(asset => ({
                    SuppliedBy: asset.SuppliedBy?.value || "",
                    AssetDetails: asset.AssetDetails.map(detail => ({
                        AssetID: detail.value || null,
                        BCR_ID: detail.BCR_ID || null,
                        AssetNo: detail.label || ""
                    }))
                }))
            }));
            let payload =
            {
                "job_id": deals.ID,
                "result": output
            }
            setShowLoader(true)
            let res = await saveEqipment(localStorage.access_token, payload)
            console.log("res ->", res)
            setShowLoader(false)
        }
        else if (activeTab === 'house') {
            // 1️⃣ Construct the payload
            const payload = {
                job_id: 3,
                items: houses.map(item => ({
                    ID: item.ID ?? 0,
                    Hose_Type: item.houseType ?? '',
                    Section_Length: item.sectionLength ?? 0,
                    End_Fittings: item.endFittingType ?? '',
                    Quantity: Number(item.quantity) || 0,
                    Supplied_By:
                        typeof item.suppliedBy === 'object'
                            ? item.suppliedBy.value
                            : item.suppliedBy ?? '',
                    Hose_Diameter: Number(item.houseDiameter) || 0,
                })),
            };

            try {
                setShowLoader(true);
                const res = await saveHose(localStorage?.access_token, payload);
                setShowLoader(false);

                if (res.status === 200 && res.data?.status_code === 200) {
                    // ✅ Success toast
                    toast.success(res.data?.result.message || "Hose details saved successfully!");
                } else {
                    // ⚠️ Failure toast
                    toast.error("Failed to save hose details ❌");
                }
            } catch (error) {
                setShowLoader(false);
                console.error("Error saving hose:", error);
                // 🔴 Error toast
                toast.error("Something went wrong while saving hoses.");
            }
        }
        else if (activeTab == 'items') {
            //// save items api call
        }
        else if (activeTab === 'custom') {
            // 1️⃣ Build payload
            const payload = {
                job_id: 3,
                items: customPackages.map(item => ({
                    ID: item.ID ?? 0,
                    Item_Name: item.itemName ?? '',
                    Requested_Quantity: Number(item.quantity) || 0,
                    Supplied_By:
                        typeof item.suppliedBy === 'object'
                            ? item.suppliedBy.value
                            : item.suppliedBy ?? '',
                    Notes: item.notes ?? '',
                })),
            };

            console.log("Saving custom package payload:", payload);

            // 2️⃣ Call API
            try {
                setShowLoader(true);
                const res = await saveCustomPackageItems(localStorage?.access_token, payload);
                setShowLoader(false);

                if (res.status === 200 && res.data?.status_code === 200) {
                    toast.success(
                        res.data?.result?.message || "Custom packages saved successfully!"
                    );
                } else {
                    toast.error("Failed to save custom packages ❌");
                }
            } catch (error) {
                setShowLoader(false);
                console.error("Error saving custom packages:", error);
                toast.error("Something went wrong while saving custom packages.");
            }
        }

 else if (activeTab === "lap") {
  const filteredItems = labItems.filter(
    (item) => item.quantity || item.suppliedBy
  );

  const payload = {
    job_id: 3, // make sure this variable is defined
    items: filteredItems.map((item) => ({
      ID: item.ID ?? 0,
      Lab_Items_ID: item.LabItemsID ?? 0,
      Requested_Quantity: item.quantity ?? 0,
      Supplied_By: item.suppliedBy ?? "",
    //   Size: "", // optional, if applicable
    })),
  };

  console.log("Saving lab items payload:", payload);

  try {
    setShowLoader(true);
    const res = await saveLabItems(localStorage?.access_token, payload);
    setShowLoader(false);

    if (res.status === 200 && res.data?.status_code === 200) {
      toast.success(res.data?.result?.message || "Lab items saved successfully!");
    } else {
      toast.error("Failed to save lab items ❌");
    }
  } catch (error) {
    setShowLoader(false);
    console.error("Error saving lab items:", error);
    toast.error("Something went wrong while saving lab items.");
  }
}
        else if (activeTab === 'hse') {
            // 1️⃣ Build and filter payload
            const filteredItems = hseItems
                .filter(item =>
                    (item.HSEItemID || item.quantity || item.suppliedBy || item.size)
                ) // only keep items with at least one valid field
                .map(item => ({
                    ID: item.ID ?? 0,
                    HSE_Items_ID: item.HSEItemID ?? 0,
                    Requested_Quantity: Number(item.quantity) || 0,
                    Supplied_By:
                        typeof item.suppliedBy === 'object'
                            ? item.suppliedBy.value
                            : item.suppliedBy ?? '',
                    Size: item.size ?? '',
                }))
                .filter(
                    item =>
                        item.HSE_Items_ID > 0 &&
                        item.Requested_Quantity > 0 &&
                        item.Supplied_By !== ''
                ); // optional strict filter: only keep valid complete items

            const payload = {
                job_id: 3, // use dynamic job_id if available
                items: filteredItems,
            };

            console.log("Saving filtered HSE payload:", payload);

            // 2️⃣ Prevent empty payload submission
            if (payload.items.length === 0) {
                toast.warning("No valid HSE items to save.");
                return;
            }

            // 3️⃣ Call API
            try {
                setShowLoader(true);
                const res = await saveHSE(localStorage?.access_token, payload);
                setShowLoader(false);

                if (res.status === 200 && res.data?.status_code === 200) {
                    toast.success(res.data?.result?.message || "HSE items saved successfully!");
                } else {
                    toast.error("Failed to save HSE items ❌");
                }
            } catch (error) {
                setShowLoader(false);
                console.error("Error saving HSE items:", error);
                toast.error("Something went wrong while saving HSE items.");
            }
        }


        else if (activeTab == '3rdParty') {
            //// save 3rdParty api call
        }

    }

    return (
        <>
            <div className="wrapper">
                {showLoader ? <FullScreenLoader></FullScreenLoader> : null}
                <Header />
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    pauseOnHover
                    draggable
                    theme="colored"
                />
                <div className="full-assets-mange">
                    <Container fluid>
                        <Row>
                            <Col xs='12'>
                                <div className="heading-area">
                                    <h2 className="title-h2">Asset Management</h2>
                                </div>
                                <div className="manage-card-bsx mb-4">
                                    <Card className="card-assets-bxs">
                                        <Card.Body className="p-2">
                                            <Row>
                                                <Col xs="12">
                                                    <div className="manage-grop--wp">
                                                        <h4 className="title-h4-labl">Job Name</h4>
                                                        <p className="shrt-line-txtwts">{deals?.JobName} </p>
                                                    </div>
                                                </Col>
                                                <Col xs="12" md={4} lg={3}>
                                                    <div className="manage-grop--wp mb-0">
                                                        <h4 className="title-h4-labl">Customer Name</h4>
                                                        <p className="shrt-line-txtwts">{deals?.CustomerName}</p>
                                                    </div>
                                                </Col>
                                                <Col xs="12" md={4} lg={3}>
                                                    <div className="manage-grop--wp mb-0">
                                                        <h4 className="title-h4-labl">Rig/Platform Name </h4>
                                                        <p className="shrt-line-txtwts">{deals?.PlatformName}</p>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </div>
                                <div className="manage-select-elements mb-4">
                                    <Row className="less-space-5">
                                        <Col xs='6' md='3' lg='3' xl='2' className="column-filed-grid">
                                            <div className="form-group-wap mb-3 mb-xl-0">
                                                <Form.Label className="label-txt-mange">Needed on Site By</Form.Label>
                                                <Form.Control
                                                    onChange={handleDealsChange}
                                                    type="date" className="control-field-txt" placeholder="" name="NeededOnSiteBy"
                                                    value={deals?.NeededOnSiteBy?.split('T')[0]}
                                                />
                                            </div>
                                        </Col>
                                        <Col xs='6' md='3' lg='3' xl='2' className="column-filed-grid">
                                            <div className="form-group-wap mb-3 mb-xl-0">
                                                <Form.Label className="label-txt-mange">Site Address/Coordinaters</Form.Label>
                                                <Form.Control onChange={handleDealsChange} type="text" className="control-field-txt" placeholder="" name="SiteAddress" value={deals?.SiteAddress} />
                                            </div>
                                        </Col>
                                        <Col xs='6' md='3' lg='3' xl='2' className="column-filed-grid">
                                            <div className="form-group-wap mb-3 mb-xl-0">
                                                <Form.Label className="label-txt-mange">Area Manager Information</Form.Label>
                                                <Form.Control onChange={handleDealsChange} type="text" className="control-field-txt" placeholder="" name="AreaManager" value={deals?.AreaManager} />
                                            </div>
                                        </Col>
                                        <Col xs='6' md='3' lg='3' xl='2' className="column-filed-grid">
                                            <div className="form-group-wap mb-3 mb-xl-0">
                                                <Form.Label className="label-txt-mange">Field Leader Information</Form.Label>
                                                <Form.Control onChange={handleDealsChange} type="text" className="control-field-txt" placeholder="" name="FieldLeader" value={deals?.FieldLeader} />
                                            </div>
                                        </Col>
                                        <Col xs='6' md='3' lg='3' xl='2' className="column-filed-grid">
                                            <div className="form-group-wap mb-3 mb-xl-0">
                                                <Form.Label className="label-txt-mange">Primary Basin</Form.Label>
                                                <Form.Control onChange={handleDealsChange} type="text" className="control-field-txt" placeholder="" name="PrimaryBasin" value={deals?.PrimaryBasin} />
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                                <div className="box-assets-card mb-5 pb-4">
                                    <div className="multi-buttons-wp">
                                        <ul className="filter-tab-menu">
                                            <li className="tabmenu-itms-tbl"><span onClick={() => setActiveTab('equipment')} className="buttons-wgts-wp"><button type="button" className={`btn btn-multi-wp ${activeTab === 'equipment' ? 'active' : ''}`}>Equipment</button></span></li>
                                            <li className="tabmenu-itms-tbl"><span onClick={() => setActiveTab('house')} className="buttons-wgts-wp"><button type="button" className={`btn btn-multi-wp ${activeTab === 'house' ? 'active' : ''}`}>Hose</button></span></li>
                                            <li className="tabmenu-itms-tbl"><span onClick={() => setActiveTab('items')} className="buttons-wgts-wp"><button type="button" className={`btn btn-multi-wp ${activeTab === 'items' ? 'active' : ''}`}>Items</button></span></li>
                                            <li className="tabmenu-itms-tbl"><span onClick={() => setActiveTab('custom')} className="buttons-wgts-wp"><button type="button" className={`btn btn-multi-wp ${activeTab === 'custom' ? 'active' : ''}`}>Custom Package Item</button></span></li>
                                            <li className="tabmenu-itms-tbl"><span onClick={() => setActiveTab('lap')} className="buttons-wgts-wp"><button type="button" className={`btn btn-multi-wp ${activeTab === 'lap' ? 'active' : ''}`}>Lab Equipment</button></span></li>
                                            <li className="tabmenu-itms-tbl"><span onClick={() => setActiveTab('hse')} className="buttons-wgts-wp"><button type="button" className={`btn btn-multi-wp ${activeTab === 'hse' ? 'active' : ''}`}>HSE</button></span></li>
                                            <li className="tabmenu-itms-tbl"><span onClick={() => setActiveTab('3rdParty')} className="buttons-wgts-wp"><button type="button" className={`btn btn-multi-wp ${activeTab === '3rdParty' ? 'active' : ''}`}>3rd Party Rental</button></span></li>
                                        </ul>
                                    </div>
                                    <div className="table-assets-chart">
                                        {
                                            activeTab == 'equipment' ?
                                                <>
                                                    <Table responsive className="table-more-asts">
                                                        <thead className="thead-itms-wp">
                                                            <tr>
                                                                <th>Asset Type</th>
                                                                {/* <th>Asset Number</th> */}
                                                                <th>Sales Quantity

                                                                    {/* <span className="small-th-head">(Contractual)
                                                                    </span><span className="tooltips-drop"><img src={exclamationIcon} alt="" />
                                                                        <span className="dropdown-txt-tooltips note-txt-wt">(Note : Only Sales Team can Enter)</span>
                                                                    </span> */}
                                                                </th>
                                                                <th>Operation Quantity <span className="small-th-head">(Additional)</span><span className="tooltips-drop"><img src={exclamationIcon} alt="" /><span className="dropdown-txt-tooltips note-txt-wt">(Note : Only Operation Team can Enter)</span></span></th>
                                                                <th>Supplied Quantity <span className="small-th-head">(Additional)</span>
                                                                    {/* <span className="tooltips-drop"><img src={exclamationIcon} alt="" />
                                                                <span className="dropdown-txt-tooltips note-txt-wt">(Note : Only SCM Team can Enter)</span>
                                                                </span> */}
                                                                </th>
                                                                <th className="p-0">
                                                                    <div className="th-headarea-s3">
                                                                        <div className="left-headth">
                                                                            Supplied By
                                                                            <span className="tooltips-drop"><img src={exclamationIcon} alt="" />
                                                                                <span className="dropdown-txt-tooltips note-txt-wt">(Note : Only SCM Team can Enter)</span>
                                                                            </span>
                                                                        </div>
                                                                        <div className="right-headth">
                                                                            Asset Number(s) Chosen
                                                                            <span className="small-th-head">(By Basin)</span>
                                                                            <span className="tooltips-drop"><img src={exclamationIcon} alt="" />
                                                                                <span className="dropdown-txt-tooltips note-txt-wt">(Note : Only SCM Team can Enter)</span>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </th>
                                                                {/* <th>Asset Number(s) Chosen <span className="small-th-head">(By Basin)</span><span className="tooltips-drop"><img src={exclamationIcon} alt="" /><span className="dropdown-txt-tooltips note-txt-wt">(Note : Only SCM Team can Enter)</span></span></th> */}
                                                                <th>Notes <span className="tooltips-drop"><img src={exclamationIcon} alt="" /><span className="dropdown-txt-tooltips note-txt-wt">(Note : Only SCM Team can Enter)</span></span></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                equipments.map((val, index) => {
                                                                    return (
                                                                        <tr key={val.equipment_id}>
                                                                            <td>
                                                                                <div className="form-group-col">
                                                                                    <Form.Control
                                                                                        disabled
                                                                                        onChange={(e) => handleInputChange('equipment', e, index)}
                                                                                        type="text"
                                                                                        className="input-tb-txt"
                                                                                        value={val.AssetType}
                                                                                        name='AssetType'
                                                                                        placeholder=""
                                                                                    />
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <div className="form-group-col">
                                                                                    <Form.Control
                                                                                        disabled
                                                                                        type="number"
                                                                                        onChange={(e) => handleInputChange('equipment', e, index)}
                                                                                        className="input-tb-txt"
                                                                                        value={val.SalesQuantity}
                                                                                        name='SalesQuantity'
                                                                                        placeholder=""
                                                                                    />
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <div className="form-group-col">
                                                                                    <Form.Control
                                                                                        type="number"
                                                                                        onChange={(e) => handleInputChange('equipment', e, index)}
                                                                                        className="input-tb-txt"
                                                                                        value={val.OperationQuantity}
                                                                                        name='OperationQuantity'
                                                                                        placeholder=""
                                                                                    />
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <div className="form-group-col">
                                                                                    <Form.Control
                                                                                        type="number"
                                                                                        onChange={(e) => handleInputChange('equipment', e, index)}
                                                                                        className="input-tb-txt"
                                                                                        value={val.SuppliedQuantity}
                                                                                        name='SuppliedQuantity'
                                                                                        placeholder=""
                                                                                    />
                                                                                </div>
                                                                            </td>
                                                                            <td className="px-0">
                                                                                {
                                                                                    val?.Assets?.length ?
                                                                                        <>
                                                                                            {
                                                                                                val?.Assets.map((ele, i) => {
                                                                                                    return (
                                                                                                        <>
                                                                                                            <div className="d-flex less-margin-8" key={i}>
                                                                                                                <div className="form-group-col select-supp-left">
                                                                                                                    <Select
                                                                                                                        classNamePrefix="react-select"
                                                                                                                        className="single-select-optn"
                                                                                                                        options={
                                                                                                                            isBasinLoading
                                                                                                                                ? [{ label: "Loading...", value: "", isDisabled: true }]
                                                                                                                                : basins
                                                                                                                        }
                                                                                                                        // options={basins}
                                                                                                                        isClearable={true}
                                                                                                                        defaultInputValue={ele?.SuppliedBy?.value}
                                                                                                                        onMenuOpen={() => {
                                                                                                                            fetchBasins(val?.AssetType);

                                                                                                                        }}
                                                                                                                        placeholder={"Select"}
                                                                                                                        onChange={(selectedOption) => handleSelectChange('suppliedBy', selectedOption, index, i)}
                                                                                                                        isSearchable={true}
                                                                                                                        menuPortalTarget={document.body}
                                                                                                                        menuPosition="fixed"
                                                                                                                        styles={{
                                                                                                                            control: (base) => ({
                                                                                                                                ...base,
                                                                                                                                borderRadius: "8px",
                                                                                                                                borderColor: "#ccc",
                                                                                                                                minHeight: "38px",
                                                                                                                            }),
                                                                                                                            menu: (base) => ({
                                                                                                                                ...base,
                                                                                                                                zIndex: 9999,
                                                                                                                            }),
                                                                                                                        }}
                                                                                                                    />
                                                                                                                </div>

                                                                                                                <div className="form-group-col select-supp-right">
                                                                                                                    <Select
                                                                                                                        classNamePrefix="react-select"
                                                                                                                        isMulti
                                                                                                                        //options={raNumbers}
                                                                                                                        options={
                                                                                                                            isBasinLoading
                                                                                                                                ? [{ label: "Loading...", value: "", isDisabled: true }]
                                                                                                                                : raNumbers
                                                                                                                        }
                                                                                                                        value={val.assetNumberByBasin}
                                                                                                                        onChange={(selectedOption) => handleSelectChange('assetNumberByBasin', selectedOption, index, 'assetNumberByBasin')}
                                                                                                                        onMenuOpen={() => {
                                                                                                                            fetchRsNumber(val?.AssetType, ele.SuppliedBy?.value);
                                                                                                                        }}
                                                                                                                        placeholder="Select"
                                                                                                                        isSearchable={true}
                                                                                                                        menuPortalTarget={document.body}
                                                                                                                        menuPosition="fixed"
                                                                                                                        styles={{
                                                                                                                            control: (base) => ({
                                                                                                                                ...base,
                                                                                                                                borderRadius: "8px",
                                                                                                                                borderColor: "#ccc",
                                                                                                                                minHeight: "38px",
                                                                                                                            }),
                                                                                                                            menu: (base) => ({
                                                                                                                                ...base,
                                                                                                                                zIndex: 9999,
                                                                                                                            }),
                                                                                                                        }}
                                                                                                                    />
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </>
                                                                                                    )
                                                                                                })
                                                                                            }

                                                                                        </>
                                                                                        :
                                                                                        <>
                                                                                            <div className="d-flex">
                                                                                                <div className="form-group-col select-supp-left">
                                                                                                    <Select
                                                                                                        classNamePrefix="react-select"
                                                                                                        className="single-select-optn"
                                                                                                        options={basins}
                                                                                                        value={val.suppliedBy}
                                                                                                        onChange={(selectedOption) => handleSelectChange('equipment', selectedOption, index, 'suppliedBy')}
                                                                                                        placeholder="Select"
                                                                                                        isSearchable={true}
                                                                                                        menuPortalTarget={document.body}
                                                                                                        menuPosition="fixed"
                                                                                                        styles={{
                                                                                                            control: (base) => ({
                                                                                                                ...base,
                                                                                                                borderRadius: "8px",
                                                                                                                borderColor: "#ccc",
                                                                                                                minHeight: "38px",
                                                                                                            }),
                                                                                                            menu: (base) => ({
                                                                                                                ...base,
                                                                                                                zIndex: 9999,
                                                                                                            }),
                                                                                                        }}
                                                                                                    />
                                                                                                </div>

                                                                                                <div className="form-group-col select-supp-right">
                                                                                                    <Select
                                                                                                        classNamePrefix="react-select"
                                                                                                        options={raNumbers}
                                                                                                        value={val.assetNumberByBasin}
                                                                                                        onChange={(selectedOption) => handleSelectChange('equipment', selectedOption, index, 'assetNumberByBasin')}
                                                                                                        placeholder="Select"
                                                                                                        isSearchable={true}
                                                                                                        menuPortalTarget={document.body}
                                                                                                        menuPosition="fixed"
                                                                                                        styles={{
                                                                                                            control: (base) => ({
                                                                                                                ...base,
                                                                                                                borderRadius: "8px",
                                                                                                                borderColor: "#ccc",
                                                                                                                minHeight: "38px",
                                                                                                            }),
                                                                                                            menu: (base) => ({
                                                                                                                ...base,
                                                                                                                zIndex: 9999,
                                                                                                            }),
                                                                                                        }}
                                                                                                    />
                                                                                                </div>
                                                                                            </div>

                                                                                            <div className="d-flex">
                                                                                                <div className="form-group-col select-supp-left">
                                                                                                    <Select
                                                                                                        classNamePrefix="react-select"
                                                                                                        className="single-select-optn"
                                                                                                        options={basins}
                                                                                                        value={val.suppliedBy}
                                                                                                        onChange={(selectedOption) => handleSelectChange('equipment', selectedOption, index, 'suppliedBy')}
                                                                                                        placeholder="Select"
                                                                                                        isSearchable={true}
                                                                                                        menuPortalTarget={document.body}
                                                                                                        menuPosition="fixed"
                                                                                                        styles={{
                                                                                                            control: (base) => ({
                                                                                                                ...base,
                                                                                                                borderRadius: "8px",
                                                                                                                borderColor: "#ccc",
                                                                                                                minHeight: "38px",
                                                                                                            }),
                                                                                                            menu: (base) => ({
                                                                                                                ...base,
                                                                                                                zIndex: 9999,
                                                                                                            }),
                                                                                                        }}
                                                                                                    />
                                                                                                </div>

                                                                                                <div className="form-group-col select-supp-right">
                                                                                                    <Select
                                                                                                        classNamePrefix="react-select"
                                                                                                        options={raNumbers}
                                                                                                        value={val.assetNumberByBasin}
                                                                                                        onChange={(selectedOption) => handleSelectChange('equipment', selectedOption, index, 'assetNumberByBasin')}
                                                                                                        placeholder="Select"
                                                                                                        isSearchable={true}
                                                                                                        menuPortalTarget={document.body}
                                                                                                        menuPosition="fixed"
                                                                                                        styles={{
                                                                                                            control: (base) => ({
                                                                                                                ...base,
                                                                                                                borderRadius: "8px",
                                                                                                                borderColor: "#ccc",
                                                                                                                minHeight: "38px",
                                                                                                            }),
                                                                                                            menu: (base) => ({
                                                                                                                ...base,
                                                                                                                zIndex: 9999,
                                                                                                            }),
                                                                                                        }}
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                        </>

                                                                                }

                                                                            </td>
                                                                            {/* <td>
                                                                                <div className="form-group-col">
                                                                                    <Select
                                                                                        classNamePrefix="react-select"
                                                                                        options={raNumbers}
                                                                                        value={val.assetNumberByBasin}
                                                                                        onChange={(selectedOption) => handleSelectChange('equipment', selectedOption, index, 'assetNumberByBasin')}
                                                                                        placeholder="Select"
                                                                                        isSearchable={true}
                                                                                        menuPortalTarget={document.body}
                                                                                        menuPosition="fixed"
                                                                                        styles={{
                                                                                            control: (base) => ({
                                                                                                ...base,
                                                                                                borderRadius: "8px",
                                                                                                borderColor: "#ccc",
                                                                                                minHeight: "38px",
                                                                                            }),
                                                                                            menu: (base) => ({
                                                                                                ...base,
                                                                                                zIndex: 9999,
                                                                                            }),
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                            </td> */}
                                                                            <td>
                                                                                <div className="d-flex align-items-center">
                                                                                    <div className="form-group-col">
                                                                                        <Form.Control
                                                                                            type="text"
                                                                                            onChange={(e) => handleInputChange('equipment', e, index)}
                                                                                            className="input-tb-txt"
                                                                                            value={val.Notes}
                                                                                            name='Notes'
                                                                                            placeholder=""
                                                                                        />
                                                                                    </div>
                                                                                    <div className="d-flex align-items-center button-wt-action">
                                                                                        <button onClick={() => handleAddData('equipment', val.index)} type="button" className="btn icon-btn-action">
                                                                                            <img src={plusIcon} alt="icon" />
                                                                                        </button>
                                                                                        {index !== 0 && (
                                                                                            <button onClick={() => handleRemoveData('equipment', val.index)} type="button" className="btn icon-btn-action">
                                                                                                <img src={minusIcon} alt="icon" />
                                                                                            </button>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                    </Table>
                                                    <div className="total-qty-footer">
                                                        <div className="total-ft-wth">
                                                            <span style={{ marginRight: '10%' }} class="txt-label-ttl">Total Sales QTY <span className="d-inline-block ms-3"></span>{equipments.reduce((sum, e) => sum + Number(e.SalesQuantity), 0)}</span>
                                                            <span style={{ marginRight: '10%' }} class="txt-label-ttl">Total Operation QTY <span className="d-inline-block ms-3"></span>{equipments.reduce((sum, e) => sum + Number(e.OperationQuantity), 0)}</span>
                                                            <span class="txt-label-ttl">Total Supllied QTY <span className="d-inline-block ms-3"></span>{equipments.reduce((sum, e) => sum + Number(e.SuppliedQuantity), 0)}</span>
                                                        </div>
                                                    </div>
                                                </>
                                                :
                                                activeTab === 'house' ?
                                                    <>
                                                        <Table responsive className="table-more-asts">
                                                            <thead className="thead-itms-wp space-table-head">
                                                                <tr>
                                                                    <th>Hose Type</th>
                                                                    <th>Hose Diameter <span className="small-th-head">( Inches)</span></th>
                                                                    <th>Section Length <span className="small-th-head">(Feet)</span></th>
                                                                    <th>End-Fitting Type</th>
                                                                    <th>Quantity</th>
                                                                    <th>Supplied By</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    houses.map((val, index) => {
                                                                        return (
                                                                            <tr>
                                                                                <td>
                                                                                    <div className="form-group-col">
                                                                                        <Form.Control type="text" className="input-tb-txt" onChange={(e) => handleInputChange('house', e, index)} name='houseType' value={val.houseType} placeholder="" />
                                                                                    </div>
                                                                                </td>
                                                                                <td>
                                                                                    <div className="form-group-col">
                                                                                        <Form.Control type="number" className="input-tb-txt" onChange={(e) => handleInputChange('house', e, index)} name='houseDiameter' value={val.houseDiameter} placeholder="" />
                                                                                    </div>
                                                                                </td>
                                                                                <td>
                                                                                    <div className="form-group-col">
                                                                                        <Form.Control type="number" className="input-tb-txt" onChange={(e) => handleInputChange('house', e, index)} name='sectionLength' value={val.sectionLength} placeholder="" />
                                                                                    </div>
                                                                                </td>
                                                                                <td>
                                                                                    <div className="form-group-col">
                                                                                        <Form.Control type="text" className="input-tb-txt" onChange={(e) => handleInputChange('house', e, index)} name='endFittingType' value={val.endFittingType} placeholder="" />
                                                                                    </div>
                                                                                </td>
                                                                                <td>
                                                                                    <div className="form-group-col">
                                                                                        <Form.Control type="number" className="input-tb-txt" onChange={(e) => handleInputChange('house', e, index)} name='quantity' value={val.quantity} placeholder="" />
                                                                                    </div>
                                                                                </td>
                                                                                <td>
                                                                                    <div className="d-flex align-items-center">
                                                                                        <div className="form-group-col">
                                                                                            <td>
                                                                                                <div className="form-group-col select-supp-by-wth">
                                                                                                    <Select
                                                                                                        classNamePrefix="react-select"
                                                                                                        options={basins}
                                                                                                        value={val.suppliedBy}
                                                                                                        onChange={(selectedOption) => handleSelectChange('house', selectedOption, index, 'suppliedBy')}
                                                                                                        placeholder="Select"
                                                                                                        isSearchable={true}
                                                                                                        menuPortalTarget={document.body}
                                                                                                        menuPosition="fixed"
                                                                                                        styles={{
                                                                                                            control: (base) => ({
                                                                                                                ...base,
                                                                                                                borderRadius: "8px",
                                                                                                                borderColor: "#ccc",
                                                                                                                minHeight: "38px",
                                                                                                            }),
                                                                                                            menu: (base) => ({
                                                                                                                ...base,
                                                                                                                zIndex: 9999,
                                                                                                            }),
                                                                                                        }}
                                                                                                    />
                                                                                                </div>
                                                                                            </td>
                                                                                        </div>
                                                                                        <div className="d-flex align-items-center button-wt-action">
                                                                                            <button onClick={() => handleAddData('house', val.index)} type="button" className="btn icon-btn-action"><img src={plusIcon} alt="icon" /></button>
                                                                                            {
                                                                                                !index == 0 ?
                                                                                                    <button onClick={() => handleRemoveData('house', val.index)} type="button" className="btn icon-btn-action"><img src={minusIcon} alt="icon" /></button>
                                                                                                    :
                                                                                                    null
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        )
                                                                    })
                                                                }

                                                            </tbody>
                                                        </Table>
                                                        <div className="total-qty-footer">
                                                            <div className="total-ft-wth">
                                                                <span class="txt-label-ttl">Total QTY <span className="d-inline-block ms-3"></span>{
                                                                    houses.reduce((sum, e) => sum + Number(e.quantity), 0)
                                                                }</span>
                                                            </div>
                                                        </div>
                                                    </>
                                                    :
                                                    activeTab === 'items' ?
                                                        <>
                                                            <div className="table-accordion-assets">
                                                                <Accordion defaultActiveKey="0">
                                                                    <Accordion.Item className="accordion-card-itm" eventKey="0">
                                                                        <Accordion.Header className="heading-accordian-wp">Fittings</Accordion.Header>
                                                                        <Accordion.Body className="p-0">
                                                                            <Accordion>
                                                                                <Accordion.Item className="item-accordian-lst" eventKey="0">
                                                                                    <Accordion.Header>Camlock Fitting</Accordion.Header>
                                                                                    <Accordion.Body className="p-0">
                                                                                        <Table responsive className="table-more-asts">
                                                                                            <thead className="thead-itms-wp space-table-head">
                                                                                                <tr>
                                                                                                    <th>Item Name</th>
                                                                                                    <th>Quantity <span className="small-th-head">(Requested)</span></th>
                                                                                                    <th>Supplied By</th>
                                                                                                </tr>
                                                                                            </thead>
                                                                                            <tbody>
                                                                                                {
                                                                                                    items.map((val, index) => {
                                                                                                        return (
                                                                                                            <>
                                                                                                                <tr>
                                                                                                                    <td>
                                                                                                                        <div className="itm-content-parg">
                                                                                                                            <p className="txtweb-content">Camlock A, AL-6061, 1.000"-PLG x 1.000"-FNPT</p>
                                                                                                                        </div>
                                                                                                                    </td>
                                                                                                                    <td>
                                                                                                                        <div className="form-group-col">
                                                                                                                            <Form.Control type="number" onChange={(e) => handleInputChange('item', e, index)} className="input-tb-txt" name='quantity' value={items.quantity} placeholder="" />
                                                                                                                        </div>
                                                                                                                    </td>
                                                                                                                    <td>
                                                                                                                        <div className="form-group-col">
                                                                                                                            <Form.Control type="text" onChange={(e) => handleInputChange('item', e, index)} className="input-tb-txt" name='suppliedBy' value={items.suppliedBy} placeholder="" />
                                                                                                                        </div>
                                                                                                                    </td>
                                                                                                                </tr>
                                                                                                            </>
                                                                                                        )
                                                                                                    })
                                                                                                }


                                                                                            </tbody>
                                                                                        </Table>
                                                                                    </Accordion.Body>
                                                                                </Accordion.Item>
                                                                                <Accordion.Item className="item-accordian-lst" eventKey="1">
                                                                                    <Accordion.Header>Couplings</Accordion.Header>
                                                                                    <Accordion.Body className="p-0">
                                                                                        <Table responsive className="table-more-asts">
                                                                                            <thead className="thead-itms-wp space-table-head">
                                                                                                <tr>
                                                                                                    <th>Item Name</th>
                                                                                                    <th>Quantity <span className="small-th-head">(Requested)</span></th>
                                                                                                    <th>Supplied By</th>
                                                                                                </tr>
                                                                                            </thead>
                                                                                            <tbody>
                                                                                                {
                                                                                                    items.map((val, index) => {
                                                                                                        return (
                                                                                                            <>
                                                                                                                <tr>
                                                                                                                    <td>
                                                                                                                        <div className="itm-content-parg">
                                                                                                                            <p className="txtweb-content">Camlock A, AL-6061, 1.000"-PLG x 1.000"-FNPT</p>
                                                                                                                        </div>
                                                                                                                    </td>
                                                                                                                    <td>
                                                                                                                        <div className="form-group-col">
                                                                                                                            <Form.Control type="number" onChange={(e) => handleInputChange('item', e, index)} className="input-tb-txt" name='quantity' value={items.quantity} placeholder="" />
                                                                                                                        </div>
                                                                                                                    </td>
                                                                                                                    <td>
                                                                                                                        <div className="form-group-col">
                                                                                                                            <Form.Control type="text" onChange={(e) => handleInputChange('item', e, index)} className="input-tb-txt" name='suppliedBy' value={items.suppliedBy} placeholder="" />
                                                                                                                        </div>
                                                                                                                    </td>
                                                                                                                </tr>
                                                                                                            </>
                                                                                                        )
                                                                                                    })
                                                                                                }

                                                                                            </tbody>
                                                                                        </Table>
                                                                                    </Accordion.Body>
                                                                                </Accordion.Item>
                                                                                <Accordion.Item className="item-accordian-lst" eventKey="2">
                                                                                    <Accordion.Header>Elbows</Accordion.Header>
                                                                                    <Accordion.Body className="p-0">
                                                                                        <Table responsive className="table-more-asts">
                                                                                            <thead className="thead-itms-wp space-table-head">
                                                                                                <tr>
                                                                                                    <th>Item Name</th>
                                                                                                    <th>Quantity <span className="small-th-head">(Requested)</span></th>
                                                                                                    <th>Supplied By</th>
                                                                                                </tr>
                                                                                            </thead>
                                                                                            <tbody>
                                                                                                {
                                                                                                    items.map((val, index) => {
                                                                                                        return (
                                                                                                            <>
                                                                                                                <tr>
                                                                                                                    <td>
                                                                                                                        <div className="itm-content-parg">
                                                                                                                            <p className="txtweb-content">Camlock A, AL-6061, 1.000"-PLG x 1.000"-FNPT</p>
                                                                                                                        </div>
                                                                                                                    </td>
                                                                                                                    <td>
                                                                                                                        <div className="form-group-col">
                                                                                                                            <Form.Control type="number" onChange={(e) => handleInputChange('item', e, index)} className="input-tb-txt" name='quantity' value={items.quantity} placeholder="" />
                                                                                                                        </div>
                                                                                                                    </td>
                                                                                                                    <td>
                                                                                                                        <div className="form-group-col">
                                                                                                                            <Form.Control type="text" onChange={(e) => handleInputChange('item', e, index)} className="input-tb-txt" name='suppliedBy' value={items.suppliedBy} placeholder="" />
                                                                                                                        </div>
                                                                                                                    </td>
                                                                                                                </tr>
                                                                                                            </>
                                                                                                        )
                                                                                                    })
                                                                                                }

                                                                                            </tbody>
                                                                                        </Table>
                                                                                    </Accordion.Body>
                                                                                </Accordion.Item>
                                                                                <Accordion.Item className="item-accordian-lst" eventKey="3">
                                                                                    <Accordion.Header>Flanges</Accordion.Header>
                                                                                    <Accordion.Body className="p-0">
                                                                                        <Table responsive className="table-more-asts">
                                                                                            <thead className="thead-itms-wp space-table-head">
                                                                                                <tr>
                                                                                                    <th>Item Name</th>
                                                                                                    <th>Quantity <span className="small-th-head">(Requested)</span></th>
                                                                                                    <th>Supplied By</th>
                                                                                                </tr>
                                                                                            </thead>
                                                                                            <tbody>
                                                                                                {
                                                                                                    items.map((val, index) => {
                                                                                                        return (
                                                                                                            <>
                                                                                                                <tr>
                                                                                                                    <td>
                                                                                                                        <div className="itm-content-parg">
                                                                                                                            <p className="txtweb-content">Camlock A, AL-6061, 1.000"-PLG x 1.000"-FNPT</p>
                                                                                                                        </div>
                                                                                                                    </td>
                                                                                                                    <td>
                                                                                                                        <div className="form-group-col">
                                                                                                                            <Form.Control type="number" onChange={(e) => handleInputChange('item', e, index)} className="input-tb-txt" name='quantity' value={items.quantity} placeholder="" />
                                                                                                                        </div>
                                                                                                                    </td>
                                                                                                                    <td>
                                                                                                                        <div className="form-group-col">
                                                                                                                            <Form.Control type="text" onChange={(e) => handleInputChange('item', e, index)} className="input-tb-txt" name='suppliedBy' value={items.suppliedBy} placeholder="" />
                                                                                                                        </div>
                                                                                                                    </td>
                                                                                                                </tr>
                                                                                                            </>
                                                                                                        )
                                                                                                    })
                                                                                                }

                                                                                            </tbody>
                                                                                        </Table>
                                                                                    </Accordion.Body>
                                                                                </Accordion.Item>
                                                                                <Accordion.Item className="item-accordian-lst" eventKey="4">
                                                                                    <Accordion.Header>Hammer Union Fittings</Accordion.Header>
                                                                                    <Accordion.Body className="p-0">
                                                                                        <Table responsive className="table-more-asts">
                                                                                            <thead className="thead-itms-wp space-table-head">
                                                                                                <tr>
                                                                                                    <th>Item Name</th>
                                                                                                    <th>Quantity <span className="small-th-head">(Requested)</span></th>
                                                                                                    <th>Supplied By</th>
                                                                                                </tr>
                                                                                            </thead>
                                                                                            <tbody>
                                                                                                {
                                                                                                    items.map((val, index) => {
                                                                                                        return (
                                                                                                            <>
                                                                                                                <tr>
                                                                                                                    <td>
                                                                                                                        <div className="itm-content-parg">
                                                                                                                            <p className="txtweb-content">Camlock A, AL-6061, 1.000"-PLG x 1.000"-FNPT</p>
                                                                                                                        </div>
                                                                                                                    </td>
                                                                                                                    <td>
                                                                                                                        <div className="form-group-col">
                                                                                                                            <Form.Control type="number" onChange={(e) => handleInputChange('item', e, index)} className="input-tb-txt" name='quantity' value={items.quantity} placeholder="" />
                                                                                                                        </div>
                                                                                                                    </td>
                                                                                                                    <td>
                                                                                                                        <div className="form-group-col">
                                                                                                                            <Form.Control type="text" onChange={(e) => handleInputChange('item', e, index)} className="input-tb-txt" name='suppliedBy' value={items.suppliedBy} placeholder="" />
                                                                                                                        </div>
                                                                                                                    </td>
                                                                                                                </tr>
                                                                                                            </>
                                                                                                        )
                                                                                                    })
                                                                                                }

                                                                                            </tbody>
                                                                                        </Table>
                                                                                    </Accordion.Body>
                                                                                </Accordion.Item>
                                                                                <Accordion.Item className="item-accordian-lst" eventKey="5">
                                                                                    <Accordion.Header>Nipples</Accordion.Header>
                                                                                    <Accordion.Body className="p-0">
                                                                                        <Table responsive className="table-more-asts">
                                                                                            <thead className="thead-itms-wp space-table-head">
                                                                                                <tr>
                                                                                                    <th>Item Name</th>
                                                                                                    <th>Quantity <span className="small-th-head">(Requested)</span></th>
                                                                                                    <th>Supplied By</th>
                                                                                                </tr>
                                                                                            </thead>
                                                                                            <tbody>
                                                                                                {
                                                                                                    items.map((val, index) => {
                                                                                                        return (
                                                                                                            <>
                                                                                                                <tr>
                                                                                                                    <td>
                                                                                                                        <div className="itm-content-parg">
                                                                                                                            <p className="txtweb-content">Camlock A, AL-6061, 1.000"-PLG x 1.000"-FNPT</p>
                                                                                                                        </div>
                                                                                                                    </td>
                                                                                                                    <td>
                                                                                                                        <div className="form-group-col">
                                                                                                                            <Form.Control type="number" onChange={(e) => handleInputChange('item', e, index)} className="input-tb-txt" name='quantity' value={items.quantity} placeholder="" />
                                                                                                                        </div>
                                                                                                                    </td>
                                                                                                                    <td>
                                                                                                                        <div className="form-group-col">
                                                                                                                            <Form.Control type="text" onChange={(e) => handleInputChange('item', e, index)} className="input-tb-txt" name='suppliedBy' value={items.suppliedBy} placeholder="" />
                                                                                                                        </div>
                                                                                                                    </td>
                                                                                                                </tr>
                                                                                                            </>
                                                                                                        )
                                                                                                    })
                                                                                                }

                                                                                            </tbody>
                                                                                        </Table>
                                                                                    </Accordion.Body>
                                                                                </Accordion.Item>
                                                                                <Accordion.Item className="item-accordian-lst" eventKey="6">
                                                                                    <Accordion.Header>Reducers & Bushings</Accordion.Header>
                                                                                    <Accordion.Body className="p-0">
                                                                                        <Table responsive className="table-more-asts">
                                                                                            <thead className="thead-itms-wp space-table-head">
                                                                                                <tr>
                                                                                                    <th>Item Name</th>
                                                                                                    <th>Quantity <span className="small-th-head">(Requested)</span></th>
                                                                                                    <th>Supplied By</th>
                                                                                                </tr>
                                                                                            </thead>
                                                                                            <tbody>
                                                                                                {
                                                                                                    items.map((val, index) => {
                                                                                                        return (
                                                                                                            <>
                                                                                                                <tr>
                                                                                                                    <td>
                                                                                                                        <div className="itm-content-parg">
                                                                                                                            <p className="txtweb-content">Camlock A, AL-6061, 1.000"-PLG x 1.000"-FNPT</p>
                                                                                                                        </div>
                                                                                                                    </td>
                                                                                                                    <td>
                                                                                                                        <div className="form-group-col">
                                                                                                                            <Form.Control type="number" onChange={(e) => handleInputChange('item', e, index)} className="input-tb-txt" name='quantity' value={items.quantity} placeholder="" />
                                                                                                                        </div>
                                                                                                                    </td>
                                                                                                                    <td>
                                                                                                                        <div className="form-group-col">
                                                                                                                            <Form.Control type="text" onChange={(e) => handleInputChange('item', e, index)} className="input-tb-txt" name='suppliedBy' value={items.suppliedBy} placeholder="" />
                                                                                                                        </div>
                                                                                                                    </td>
                                                                                                                </tr>
                                                                                                            </>
                                                                                                        )
                                                                                                    })
                                                                                                }

                                                                                            </tbody>
                                                                                        </Table>
                                                                                    </Accordion.Body>
                                                                                </Accordion.Item>
                                                                                <Accordion.Item className="item-accordian-lst" eventKey="7">
                                                                                    <Accordion.Header>Tees</Accordion.Header>
                                                                                    <Accordion.Body className="p-0">
                                                                                        <Table responsive className="table-more-asts">
                                                                                            <thead className="thead-itms-wp space-table-head">
                                                                                                <tr>
                                                                                                    <th>Item Name</th>
                                                                                                    <th>Quantity <span className="small-th-head">(Requested)</span></th>
                                                                                                    <th>Supplied By</th>
                                                                                                </tr>
                                                                                            </thead>
                                                                                            <tbody>
                                                                                                {
                                                                                                    items.map((val, index) => {
                                                                                                        return (
                                                                                                            <>
                                                                                                                <tr>
                                                                                                                    <td>
                                                                                                                        <div className="itm-content-parg">
                                                                                                                            <p className="txtweb-content">Camlock A, AL-6061, 1.000"-PLG x 1.000"-FNPT</p>
                                                                                                                        </div>
                                                                                                                    </td>
                                                                                                                    <td>
                                                                                                                        <div className="form-group-col">
                                                                                                                            <Form.Control type="number" onChange={(e) => handleInputChange('item', e, index)} className="input-tb-txt" name='quantity' value={items.quantity} placeholder="" />
                                                                                                                        </div>
                                                                                                                    </td>
                                                                                                                    <td>
                                                                                                                        <div className="form-group-col">
                                                                                                                            <Form.Control type="text" onChange={(e) => handleInputChange('item', e, index)} className="input-tb-txt" name='suppliedBy' value={items.suppliedBy} placeholder="" />
                                                                                                                        </div>
                                                                                                                    </td>
                                                                                                                </tr>
                                                                                                            </>
                                                                                                        )
                                                                                                    })
                                                                                                }

                                                                                            </tbody>
                                                                                        </Table>
                                                                                    </Accordion.Body>
                                                                                </Accordion.Item>
                                                                            </Accordion>
                                                                        </Accordion.Body>
                                                                    </Accordion.Item>
                                                                    <Accordion.Item className="accordion-card-itm">
                                                                        <Accordion.Header className="heading-accordian-wp">Pressure Washer</Accordion.Header>
                                                                        <Accordion.Body className="p-0">
                                                                            Pressure Washer
                                                                        </Accordion.Body>
                                                                    </Accordion.Item>
                                                                    <Accordion.Item className="accordion-card-itm">
                                                                        <Accordion.Header className="heading-accordian-wp">Tools</Accordion.Header>
                                                                        <Accordion.Body className="p-0">
                                                                            Tools
                                                                        </Accordion.Body>
                                                                    </Accordion.Item>
                                                                    <Accordion.Item className="accordion-card-itm">
                                                                        <Accordion.Header className="heading-accordian-wp">Miscellaneous</Accordion.Header>
                                                                        <Accordion.Body className="p-0">
                                                                            Miscellaneous
                                                                        </Accordion.Body>
                                                                    </Accordion.Item>
                                                                </Accordion>
                                                            </div>




                                                            {/* <div className="filter-dropitems-assets">
                                                                <label className="label-txt-mange">Fitting Type</label>
                                                                <div className="select-dropfilter-menu" style={{ width: "250px" }}>
                                                                    <Select
                                                                        classNamePrefix="react-select"
                                                                        options={options}
                                                                        value={selectedFittingType}
                                                                        onChange={setSelectedFittingType}
                                                                        placeholder="All"
                                                                        isSearchable={false} // set true if you want search box
                                                                        styles={{
                                                                            control: (base) => ({
                                                                                ...base,
                                                                                borderRadius: "8px",
                                                                                borderColor: "#ccc",
                                                                                minHeight: "38px",
                                                                            }),
                                                                            menu: (base) => ({
                                                                                ...base,
                                                                                zIndex: 9999,
                                                                            }),
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div> */}
                                                            {/* <Table responsive className="table-more-asts">
                                                                <thead className="thead-itms-wp space-table-head">
                                                                    <tr>
                                                                        <th>Item Name</th>
                                                                        <th>Quantity <span className="small-th-head">(Requested)</span></th>
                                                                        <th>Supplied By</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {
                                                                        items.map((val, index) => {
                                                                            return (
                                                                                <>
                                                                                    <tr>
                                                                                        <td>
                                                                                            <div className="form-group-col">
                                                                                                <Select
                                                                                                    classNamePrefix="react-select"
                                                                                                    options={itemOptions}
                                                                                                    value={val.itemName}
                                                                                                    onChange={(selectedOption) =>
                                                                                                        handleSelectChange("item", selectedOption, index, "itemName")
                                                                                                    }
                                                                                                    placeholder="Select"
                                                                                                    isSearchable={false}
                                                                                                    menuPortalTarget={document.body}     // ✅ renders outside table
                                                                                                    menuPosition="fixed"                 // ✅ fixes alignment
                                                                                                    styles={{
                                                                                                        control: (base) => ({
                                                                                                            ...base,
                                                                                                            borderRadius: "8px",
                                                                                                            borderColor: "#ccc",
                                                                                                            minHeight: "38px",
                                                                                                        }),
                                                                                                        menuPortal: (base) => ({ ...base, zIndex: 9999 }), // ✅ ensure visibility
                                                                                                    }}
                                                                                                />
                                                                                            </div>
                                                                                        </td>
                                                                                        <td>
                                                                                            <div className="form-group-col">
                                                                                                <Form.Control type="number" onChange={(e) => handleInputChange('item', e, index)} className="input-tb-txt" name='quantity' value={items.quantity} placeholder="" />
                                                                                            </div>
                                                                                        </td>
                                                                                        <td>
                                                                                            <div className="d-flex align-items-center">
                                                                                                <div className="form-group-col">
                                                                                                    <Form.Control type="text" onChange={(e) => handleInputChange('item', e, index)} className="input-tb-txt" name='suppliedBy' value={items.suppliedBy} placeholder="" />
                                                                                                </div>
                                                                                                <div className="d-flex align-items-center button-wt-action">
                                                                                                    <button onClick={() => handleAddData('item', val.index)} type="button" className="btn icon-btn-action"><img src={plusIcon} alt="icon" /></button>
                                                                                                    {
                                                                                                        !index == 0 ?
                                                                                                            <button onClick={() => handleRemoveData('item', val.index)} type="button" className="btn icon-btn-action"><img src={minusIcon} alt="icon" /></button>
                                                                                                            :
                                                                                                            null

                                                                                                    }
                                                                                                </div>
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                </>
                                                                            )
                                                                        })
                                                                    }


                                                                </tbody>
                                                            </Table> */}
                                                            {/* <div className="total-qty-footer">
                                                                <div className="total-ft-wth">
                                                                    <span class="txt-label-ttl">Total QTY <span className="d-inline-block ms-3"></span>{
                                                                        items.reduce((sum, e) => sum + Number(e.quantity), 0)
                                                                    }</span>
                                                                </div>
                                                            </div> */}
                                                        </>
                                                        :
                                                        activeTab === 'custom' ?
                                                            <>
                                                                <Table responsive className="table-more-asts">
                                                                    <thead className="thead-itms-wp space-table-head">
                                                                        <tr>
                                                                            <th>Item Name</th>
                                                                            <th>Quantity <span className="small-th-head">(Requested)</span></th>
                                                                            <th>Supplied By</th>
                                                                            <th>Notes</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {customPackages.map((val, index) => (
                                                                            <tr key={val.index}>
                                                                                <td>
                                                                                    <Form.Control
                                                                                        type="text"
                                                                                        name="itemName"
                                                                                        value={val.itemName}
                                                                                        onChange={(e) => handleInputChange("custom", e, index)}
                                                                                    />
                                                                                </td>
                                                                                <td>
                                                                                    <Form.Control
                                                                                        type="number"
                                                                                        name="quantity"
                                                                                        value={val.quantity}
                                                                                        onChange={(e) => handleInputChange("custom", e, index)}
                                                                                    />
                                                                                </td>
                                                                                <td>
                                                                                    <Form.Control
                                                                                        type="text"
                                                                                        name="suppliedBy"
                                                                                        value={val.suppliedBy}
                                                                                        onChange={(e) => handleInputChange("custom", e, index)}
                                                                                    />
                                                                                </td>
                                                                                <td>
                                                                                    <Form.Control
                                                                                        type="text"
                                                                                        name="notes"
                                                                                        value={val.notes}
                                                                                        onChange={(e) => handleInputChange("custom", e, index)}
                                                                                    />
                                                                                </td>
                                                                                <td>
                                                                                    <button onClick={() => handleAddData("custom", index)}>+</button>
                                                                                    {index !== 0 && <button onClick={() => handleRemoveData("custom", index)}>-</button>}
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>

                                                                </Table>
                                                                <div className="total-qty-footer">
                                                                    <div className="total-ft-wth">
                                                                        <span class="txt-label-ttl">Total QTY <span className="d-inline-block ms-3"></span>{
                                                                            customPackages.reduce((sum, e) => sum + Number(e.quantity), 0)
                                                                        }</span>
                                                                    </div>
                                                                </div>
                                                            </>
                                                            :
                                                            activeTab === 'lap' ?
                                                                <>
                                                                    <Table responsive className="table-more-asts striped-table">
  <thead>
    <tr>
      <th>Item Name</th>
      <th>Quantity (Requested)</th>
      <th>Supplied By</th>
    </tr>
  </thead>
  <tbody>
    {labItems.map((item, index) => (
      <tr key={index}>
        <td>{item.itemName}</td>
        <td>
          <Form.Control
            type="number"
            className="input-tb-txt"
            value={item.quantity || ""}
            onChange={(e) =>
              setLabItems((prev) =>
                prev.map((itm, i) =>
                  i === index
                    ? { ...itm, quantity: Number(e.target.value) || null }
                    : itm
                )
              )
            }
          />
        </td>
        <td>
          <Form.Control
            type="text"
            className="input-tb-txt"
            value={item.suppliedBy || ""}
            onChange={(e) =>
              setLabItems((prev) =>
                prev.map((itm, i) =>
                  i === index ? { ...itm, suppliedBy: e.target.value } : itm
                )
              )
            }
          />
        </td>
      </tr>
    ))}
  </tbody>
</Table>
                                                                    <div className="total-qty-footer">
                                                                        <div className="total-ft-wth">
                                                                            <span class="txt-label-ttl">Total QTY <span className="d-inline-block ms-3"></span>5</span>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                                :
                                                                activeTab === 'hse' ?
                                                                    <>
                                                                        <Table responsive className="table-more-asts striped-table">
                                                                            <thead className="thead-itms-wp space-table-head">
                                                                                <tr>
                                                                                    <th>Item Name</th>
                                                                                    <th>Quantity <span className="small-th-head">(Requested)</span></th>
                                                                                    <th>Size <span className="small-th-head">(If Applicable)</span></th>
                                                                                    <th>Supplied By</th>
                                                                                </tr>
                                                                            </thead>

                                                                            <tbody>
                                                                                {hseItems.map((val, index) => (
                                                                                    <tr key={index}>
                                                                                        <td>
                                                                                            <span className="txt-conten-pargrap">{val.itemName}</span>
                                                                                        </td>
                                                                                        <td>
                                                                                            <div className="form-group-col">
                                                                                                <Form.Control
                                                                                                    type="number"
                                                                                                    className="input-tb-txt"
                                                                                                    name="quantity"
                                                                                                    value={val.quantity || ""}
                                                                                                    onChange={(e) => handleInputChange("hse", e, index)}
                                                                                                    placeholder=""
                                                                                                />
                                                                                            </div>
                                                                                        </td>
                                                                                        <td>
                                                                                            <div className="form-group-col">
                                                                                                <Form.Control
                                                                                                    type="text"
                                                                                                    className="input-tb-txt"
                                                                                                    name="size"
                                                                                                    value={val.size || ""}
                                                                                                    onChange={(e) => handleInputChange("hse", e, index)}
                                                                                                    placeholder=""
                                                                                                />
                                                                                            </div>
                                                                                        </td>
                                                                                        <td>
                                                                                            <div className="form-group-col">
                                                                                                <Form.Control
                                                                                                    type="text"
                                                                                                    className="input-tb-txt"
                                                                                                    name="suppliedBy"
                                                                                                    value={val.suppliedBy || ""}
                                                                                                    onChange={(e) => handleInputChange("hse", e, index)}
                                                                                                    placeholder=""
                                                                                                />
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </Table>

                                                                        <div className="total-qty-footer">
                                                                            <div className="total-ft-wth">
                                                                                <span className="txt-label-ttl">
                                                                                    Total QTY{" "}
                                                                                    <span className="d-inline-block ms-3">
                                                                                        {hseItems.reduce((sum, e) => sum + Number(e.quantity || 0), 0)}
                                                                                    </span>
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                    :
                                                                    <>
                                                                        <Table responsive className="table-more-asts striped-table">
                                                                            <thead className="thead-itms-wp space-table-head">
                                                                                <tr>
                                                                                    <th>Equipment Name</th>
                                                                                    <th>Asset Number</th>
                                                                                    <th>Quantity <span className="small-th-head">(Requested)</span></th>
                                                                                    <th>Supplied By</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td>
                                                                                        <span className="txt-conten-pargrap">Longshot Open Top Tank</span>
                                                                                    </td>
                                                                                    <td>
                                                                                        <span className="txt-conten-pargrap">LSSXX</span>
                                                                                    </td>
                                                                                    <td>
                                                                                        <div className="form-group-col">
                                                                                            <Form.Control type="number" className="input-tb-txt" placeholder="" />
                                                                                        </div>
                                                                                    </td>
                                                                                    <td>
                                                                                        <div className="form-group-col">
                                                                                            <Form.Control type="text" className="input-tb-txt" placeholder="" />
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>
                                                                                        <span className="txt-conten-pargrap">Adler Frac Tank</span>
                                                                                    </td>
                                                                                    <td>
                                                                                        <span className="txt-conten-pargrap">ADTXXXXMOT</span>
                                                                                    </td>
                                                                                    <td>
                                                                                        <div className="form-group-col">
                                                                                            <Form.Control type="number" className="input-tb-txt" placeholder="" />
                                                                                        </div>
                                                                                    </td>
                                                                                    <td>
                                                                                        <div className="form-group-col">
                                                                                            <Form.Control type="text" className="input-tb-txt" placeholder="" />
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>
                                                                                        <span className="txt-conten-pargrap">Blue Energy Premix Tank</span>
                                                                                    </td>
                                                                                    <td>
                                                                                        <span className="txt-conten-pargrap">BES-PM-XXX</span>
                                                                                    </td>
                                                                                    <td>
                                                                                        <div className="form-group-col">
                                                                                            <Form.Control type="number" className="input-tb-txt" placeholder="" />
                                                                                        </div>
                                                                                    </td>
                                                                                    <td>
                                                                                        <div className="form-group-col">
                                                                                            <Form.Control type="text" className="input-tb-txt" placeholder="" />
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>
                                                                                        <span className="txt-conten-pargrap">Container Pro Data Lab</span>
                                                                                    </td>
                                                                                    <td>
                                                                                        <span className="txt-conten-pargrap">DLSLAB-XXXXXX</span>
                                                                                    </td>
                                                                                    <td>
                                                                                        <div className="form-group-col">
                                                                                            <Form.Control type="number" className="input-tb-txt" placeholder="" />
                                                                                        </div>
                                                                                    </td>
                                                                                    <td>
                                                                                        <div className="form-group-col">
                                                                                            <Form.Control type="text" className="input-tb-txt" placeholder="" />
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>
                                                                                        <span className="txt-conten-pargrap">Doggett Trac Hoe John Deere</span>
                                                                                    </td>
                                                                                    <td>
                                                                                        <span className="txt-conten-pargrap">DOGJD-FXXXX</span>
                                                                                    </td>
                                                                                    <td>
                                                                                        <div className="form-group-col">
                                                                                            <Form.Control type="number" className="input-tb-txt" placeholder="" />
                                                                                        </div>
                                                                                    </td>
                                                                                    <td>
                                                                                        <div className="form-group-col">
                                                                                            <Form.Control type="text" className="input-tb-txt" placeholder="" />
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>
                                                                                        <span className="txt-conten-pargrap">Herc Trac Hoe John Deere</span>
                                                                                    </td>
                                                                                    <td>
                                                                                        <span className="txt-conten-pargrap">Serial Number</span>
                                                                                    </td>
                                                                                    <td>
                                                                                        <div className="form-group-col">
                                                                                            <Form.Control type="number" className="input-tb-txt" placeholder="" />
                                                                                        </div>
                                                                                    </td>
                                                                                    <td>
                                                                                        <div className="form-group-col">
                                                                                            <Form.Control type="text" className="input-tb-txt" placeholder="" />
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>
                                                                                        <span className="txt-conten-pargrap">Herc Trac Hoe Case</span>
                                                                                    </td>
                                                                                    <td>
                                                                                        <span className="txt-conten-pargrap">HERTZCASE-XXXXX</span>
                                                                                    </td>
                                                                                    <td>
                                                                                        <div className="form-group-col">
                                                                                            <Form.Control type="number" className="input-tb-txt" placeholder="" />
                                                                                        </div>
                                                                                    </td>
                                                                                    <td>
                                                                                        <div className="form-group-col">
                                                                                            <Form.Control type="text" className="input-tb-txt" placeholder="" />
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>
                                                                                        <span className="txt-conten-pargrap">Mobile Mini Data Lab</span>
                                                                                    </td>
                                                                                    <td>
                                                                                        <span className="txt-conten-pargrap">MMLAB-YWXXXX</span>
                                                                                    </td>
                                                                                    <td>
                                                                                        <div className="form-group-col">
                                                                                            <Form.Control type="number" className="input-tb-txt" placeholder="" />
                                                                                        </div>
                                                                                    </td>
                                                                                    <td>
                                                                                        <div className="form-group-col">
                                                                                            <Form.Control type="text" className="input-tb-txt" placeholder="" />
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>
                                                                                        <span className="txt-conten-pargrap">Rental Shale Bin-3 Sided Ramp</span>
                                                                                    </td>
                                                                                    <td>
                                                                                        <span className="txt-conten-pargrap">NDHWSB-XXX</span>
                                                                                    </td>
                                                                                    <td>
                                                                                        <div className="form-group-col">
                                                                                            <Form.Control type="number" className="input-tb-txt" placeholder="" />
                                                                                        </div>
                                                                                    </td>
                                                                                    <td>
                                                                                        <div className="form-group-col">
                                                                                            <Form.Control type="text" className="input-tb-txt" placeholder="" />
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>
                                                                                        <span className="txt-conten-pargrap">Wheel Loader</span>
                                                                                    </td>
                                                                                    <td>
                                                                                        <span className="txt-conten-pargrap">NDLOADER-XXX</span>
                                                                                    </td>
                                                                                    <td>
                                                                                        <div className="form-group-col">
                                                                                            <Form.Control type="number" className="input-tb-txt" placeholder="" />
                                                                                        </div>
                                                                                    </td>
                                                                                    <td>
                                                                                        <div className="form-group-col">
                                                                                            <Form.Control type="text" className="input-tb-txt" placeholder="" />
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>
                                                                                        <span className="txt-conten-pargrap">NPE Trac Hoe Hyundai 145LCR9</span>
                                                                                    </td>
                                                                                    <td>
                                                                                        <span className="txt-conten-pargrap">NPECASE-XXXXX</span>
                                                                                    </td>
                                                                                    <td>
                                                                                        <div className="form-group-col">
                                                                                            <Form.Control type="number" className="input-tb-txt" placeholder="" />
                                                                                        </div>
                                                                                    </td>
                                                                                    <td>
                                                                                        <div className="form-group-col">
                                                                                            <Form.Control type="text" className="input-tb-txt" placeholder="" />
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </Table>
                                                                        <div className="total-qty-footer">
                                                                            <div className="total-ft-wth">
                                                                                <span class="txt-label-ttl">Total QTY <span className="d-inline-block ms-3"></span>5</span>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                        }

                                    </div>
                                    <div className="d-flex justify-content-end mt-3 px-3">
                                        <button onClick={handleSave} type="submit" className="btn table-submit-btn">Save</button>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
        </>
    );
}

export default Home;