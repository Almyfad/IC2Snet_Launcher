import React, { useState, useEffect } from 'react';
import './style.css'
import { online } from './../../firebase-config'
import MaterialTable from "material-table";
import { forwardRef } from 'react';
import moment from 'moment'

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};



const Online = () => {

    const [data, setData] = useState([]);



    useEffect(() => {
        const unsubscribe=online.stream(data => setData(data))
        return () => unsubscribe();
    }, []);

    return (
        <div className="datatable">
            <MaterialTable
                icons={tableIcons}
                columns={[
                    { title: "status", field: "online", render: rowData => <span className={"circle" + rowData.online}></span> },
                    { title: "user", field: "username" },
                    { title: "platform", field: "platform" },
                    { title: "hostname", field: "hostname" },
                    { title: "Version", field: "getVersion" },
                    { title: "connectedAd", field: "connectedAd", render: rowData => rowData.connectedAd ? moment(rowData.connectedAd.toDate()).format('DD/MM/YY hh:mm') : "" },
                    { title: "disconectedAt", field: "disconectedAt", render: rowData => rowData.disconectedAt ? moment(rowData.disconectedAt.toDate()).format('DD/MM/YY hh:mm') : "" },
                ]}
                data={data}
                title="Device Liste"
                options={{ paging: true, pageSize: 10, }}
            />
        </div>
    )
}


export default Online;