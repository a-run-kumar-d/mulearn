import { PowerfulButton } from "@/MuLearnComponents/MuButtons/MuButton";
import Pagination from "@/MuLearnComponents/Pagination/Pagination";
import THead from "@/MuLearnComponents/Table/THead";
import Table from "@/MuLearnComponents/Table/Table";
import TableTop from "@/MuLearnComponents/TableTop/TableTop";
import { dashboardRoutes } from "@/MuLearnServices/urls";
import { useToast } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import styles from "../InterestGroup/InterestGroup.module.css";
import { getEvents, editEvent, deleteEvent } from "./EventsApis";
import { Blank } from "@/MuLearnComponents/Table/Blank";
import MuModal from "@/MuLearnComponents/MuModal/MuModal";
import EventsForm from './EventsForm';

export const Events = () => {
    const [data, setData] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [perPage, setPerPage] = useState(20);
    const [sort, setSort] = useState("");
    const firstFetch = useRef(true);
    const navigate = useNavigate();
    const toast = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [taskId, setTaskId] = useState<string | number | boolean>("");
    const TaskRef = useRef<any>(null);

    const columnOrder: ColOrder[] = [
        { column: "name", Label: "Name", isSortable: true },
        { column: "description", Label: "Description", isSortable: true },
        { column: "updated_by", Label: "Updated By", isSortable: true },
        { column: "updated_at", Label: "Updated On", isSortable: true },
        { column: "created_by", Label: "Created By", isSortable: true },
        { column: "created_at", Label: "Created On", isSortable: true }
    ];
    console.log(data);
    const handleNextClick = () => {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        getEvents(
            setData,
            nextPage,
            perPage,
            setIsLoading,
            setTotalPages,
            "",
            sort
        );
    };

    const handlePreviousClick = () => {
        const prevPage = currentPage - 1;
        setCurrentPage(prevPage);
        getEvents(
            setData,
            prevPage,
            perPage,
            setIsLoading,
            setTotalPages,
            "",
            sort
        );
    };

    useEffect(() => {
        if (firstFetch.current) {
            getEvents(setData, 1, perPage, setIsLoading, setTotalPages, "", "");
        }
        firstFetch.current = false;
    }, [data]);

    const handleSearch = (search: string) => {
        setCurrentPage(1);
        getEvents(setData, 1, perPage, setIsLoading, setTotalPages, search, "");
    };

    const handlePerPageNumber = (selectedValue: number) => {
        setCurrentPage(1);
        setPerPage(selectedValue);
        getEvents(
            setData,
            1,
            selectedValue,
            setIsLoading,
            setTotalPages,
            "",
            ""
        );
    };

    const handleIconClick = (column: string) => {
        if (sort === column) {
            setSort(`-${column}`);
            getEvents(
                setData,
                1,
                perPage,
                setIsLoading,
                setTotalPages,
                "",
                `-${column}`
            );
        } else {
            setSort(column);
            getEvents(
                setData,
                1,
                perPage,
                setIsLoading,
                setTotalPages,
                "",
                column
            );
        }

        //console.log(`Icon clicked for column: ${column}`);
    };

    const reloadTaskTypes = () => {
        getEvents(
            setData,
            1,
            perPage,
            setIsLoading,
            setTotalPages,
            "",
        );
    }
    const handleEdit = (id: string | number | boolean) => {
        setTaskId(id);
        setIsEditMode(true);
        setIsModalOpen(true);
        //navigate(`/dashboard/tasks/edit/${id}`);
    };

    const handleDelete = (id: string | undefined) => {
        deleteEvent(id, toast);
        setData(data.filter(item => item?.id !== id));
        setTimeout(() => { reloadTaskTypes() }, 500)
    };

    const handleCreate = () => {
        setIsEditMode(false);
        setIsModalOpen(true);
        //navigate("/dashboard/tasks/create");
    };

    return (
        <>
            <div
                className={styles.createBtnContainer}
                style={{
                    gap: "15px"
                }}
            >

                <PowerfulButton onClick={handleCreate}>
                    <AiOutlinePlusCircle />
                    Create
                </PowerfulButton>
            </div>


            <MuModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}

                title={isEditMode ? "Edit Task" : "Create Task"}
                type={"success"}
                onDone={() => TaskRef.current?.handleSubmitExternally()}
            >
                <EventsForm
                    ref={TaskRef}
                    id={isEditMode ? taskId.toString() : ""}
                    isEditMode={isEditMode}
                    reload={reloadTaskTypes}
                    closeModal={() => setIsModalOpen(false)}
                />
            </MuModal>

            {data && (
                <>
                    <TableTop
                        onSearchText={handleSearch}
                        onPerPageNumber={handlePerPageNumber}
                        CSV={dashboardRoutes.getTasksData + "csv/"}
                    />
                    <Table
                        rows={data}
                        isloading={isLoading}
                        page={currentPage}
                        perPage={perPage}
                        columnOrder={columnOrder}
                        id={["id"]}
                        onEditClick={handleEdit}
                        modalTypeContent="error"
                        onDeleteClick={handleDelete}
                        modalDeleteContent="Are you sure you want to delete ?"
                    >
                        <THead
                            columnOrder={columnOrder}
                            onIconClick={handleIconClick}
                        />
                        <div>
                            {!isLoading && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    margin="10px 0"
                                    handleNextClick={handleNextClick}
                                    handlePreviousClick={handlePreviousClick}
                                    onSearchText={handleSearch}
                                    onPerPageNumber={handlePerPageNumber}
                                    perPage={perPage}
                                    setPerPage={setPerPage}
                                />
                            )}
                        </div>
                        <Blank />
                    </Table>
                </>
            )}
        </>
    );
}

