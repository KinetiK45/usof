import React from "react";
import './Pages.css';
function Pages({currentPage, totalPages, setCurrentPage, onChange}) {

    const prevPage = async () => {
        if (currentPage < 2)
            return;
        setCurrentPage(currentPage - 1);
        onChange(currentPage - 1);
    }

    const nextPage = async () => {
        if (currentPage === totalPages)
            return;
        setCurrentPage(currentPage + 1);
        onChange(currentPage + 1);
    }

    const lastPage = () => {
        setCurrentPage(totalPages);
        onChange(totalPages);
    }

    const firstPage = () => {
        setCurrentPage(1);
        onChange(1);
    }

    return (
        <div className={'pages-block'}>
            <h2>Сторінка:</h2>
            <div className={'buttons'}>
                {currentPage > 2 &&
                    <button onClick={firstPage}>1 ...</button>
                }
                {currentPage > 1 &&
                    <button onClick={prevPage}>{currentPage - 1}</button>
                }
                <button className={'current-page'}>{currentPage}</button>
                {currentPage < totalPages &&
                    <button onClick={nextPage}>{currentPage + 1}</button>
                }
                {currentPage < totalPages - 1 &&
                    <button onClick={lastPage}>... {totalPages}</button>
                }
            </div>
        </div>
    );
}

export default Pages;


