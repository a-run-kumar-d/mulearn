import Pagination from "@/MuLearnComponents/Pagination/Pagination";
import THead from "@/MuLearnComponents/Table/THead";
import Table from "@/MuLearnComponents/Table/Table";
import TableTop from "@/MuLearnComponents/TableTop/TableTop";
import { useToast } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getdistrictdashboard } from "./apis";
import { columnsCampus, columnsStudent } from "./THeaders";
import { dashboardRoutes } from "@/MuLearnServices/urls";
import "./Organizations.css";
import "./DistricDashboard.scss";
import TableTopTab from "./TableTopTab";

function DistrictDashboard() {
    const [data, setData] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [perPage, setPerPage] = useState(5);
    const [columns, setColumns] = useState(columnsStudent);
    const [activeTab, setActiveTab] = useState("Student management");
    const [sort, setSort] = useState("");
    const [popupStatus, setPopupStatus] = useState(false);

    const [isCreate, setIsCreate] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const firstFetch = useRef(true);
    const navigate = useNavigate();

    const toast = useToast();

    useEffect(() => {
        if (firstFetch.current) {

            getdistrictdashboard(
                activeTab,
                setData,
                1,
                perPage,
                setTotalPages,
                "",
                ""
            );
        }
        firstFetch.current = false;
    }, []);

    const handleNextClick = () => {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        getdistrictdashboard(activeTab, setData, nextPage, perPage);
    };

    const handlePreviousClick = () => {
        const prevPage = currentPage - 1;
        setCurrentPage(prevPage);
        getdistrictdashboard(activeTab, setData, prevPage, perPage);
    };

    const handleSearch = (search: string) => {
        setCurrentPage(1);
        getdistrictdashboard(
            activeTab,
            setData,
            1,
            perPage,
            setTotalPages,
            search,
            ""
        );
    };

    const handlePerPageNumber = (selectedValue: number) => {
        setCurrentPage(1);
        setPerPage(selectedValue);
        getdistrictdashboard(
            activeTab,
            setData,
            1,
            selectedValue,
            setTotalPages,
            "",
            ""
        );
    };

    const handleTabClick = (tab: string) => {
        if (tab === "Student management") {
            setColumns(columnsStudent);
            getdistrictdashboard(
                tab,
                setData,
                1,
                perPage,
                setTotalPages,
                "",
                ""
            );
        } else if (tab === "Campus management") {
            setColumns(columnsCampus);
            getdistrictdashboard(
                tab,
                setData,
                1,
                perPage,
                setTotalPages,
                "",
                ""
            );
        } else {
            alert("Error to load Table Headers");
        }
        setCurrentPage(1);
        setActiveTab(tab);
        setPopupStatus(false);
    };

    const handleIconClick = (column: string) => {
        if (sort === column) {
            setSort(`-${column}`);
            getdistrictdashboard(
                activeTab,
                setData,
                1,
                perPage,
                setTotalPages,
                "",
                sort
            );
        } else {
            setSort(column);
            getdistrictdashboard(
                activeTab,
                setData,
                1,
                perPage,
                setTotalPages,
                "",
                sort
            );
        }

        //console.log(`Icon clicked for column: ${column}`);
    };

    const CSV = (tabname: string) => {
        if (
            activeTab === "Student management" &&
            tabname === "Student management"
        ) {
            return dashboardRoutes.districtStudentData;
        }
        if (
            activeTab === "Campus management" &&
            tabname === "Campus management"
        ) {
            return dashboardRoutes.districtCampusData;
        }
    };

    return (
        <>
            <TableTopTab active={activeTab} onTabClick={handleTabClick} />

            {data && (
                <>
                    <TableTop
                        onSearchText={handleSearch}
                        onPerPageNumber={handlePerPageNumber}
                        CSV={CSV(activeTab)}
                    />
                    <Table
                        rows={data}
                        page={currentPage}
                        perPage={perPage}
                        columnOrder={columns}
                        id={["code"]}
                    >
                        <THead
                            columnOrder={columns}
                            onIconClick={handleIconClick}
                        />
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            margin="10px 0"
                            handleNextClick={handleNextClick}
                            handlePreviousClick={handlePreviousClick}
                        />
                        {/*use <Blank/> when u don't need <THead /> or <Pagination inside <Table/> cause <Table /> needs atleast 2 children*/}
                    </Table>
                </>
            )}
        </>
    );
}

export default DistrictDashboard;
