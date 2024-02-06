// ===========================================
// #00119
// ===========================================

import React from "react";
import ReactPaginate from "react-paginate";
import { BsArrowLeftShort, BsArrowRightShort } from "react-icons/bs";
export default function Pagination({
  itemsPerPage,
  totalItems,
  onChangePage,
  forcePage = null,
}) {
  const pageCount = Math.ceil(totalItems / itemsPerPage);
  const handlePageClick = (event) => {
    onChangePage(event.selected + 1);
  };
  return (
    <>
      {totalItems > itemsPerPage && (
        <ReactPaginate
          className={`flex items-center w-full justify-center px-5`}
          pageLinkClassName={`btn btn-sm  h-8 w-8 rounded-full hover:bg-transparent hover:text-primary hover:border-primary hover:border`}
          disabledClassName={`btn btn-sm h-8 w-8 rounded-full`}
          breakClassName={`btn btn-sm h-8 w-8 rounded-full text-primary hover:bg-transparent font-bold`}
          activeLinkClassName={`btn btn-sm h-8 w-8 hover:btn-primary-content rounded-full bg-primary hover:border hover:border-primary hover:text-primary text-xm text-base-300`}
          previousClassName={`btn btn-sm h-8 w-8 hover:btn-primary-content rounded-full bg-transparent`}
          nextClassName={`btn btn-sm h-8 w-8 hover:btn-primary-content rounded-full bg-transparent`}
          breakLabel="..."
          onPageChange={handlePageClick}
          pageRangeDisplayed={2}
          previousLabel={
            <div
              className={`capitalize text-sm text-gray-500 duration-200 hover:text-primary-focus`}
            >
              <BsArrowLeftShort className="text-2xl text-primary" />
              {/* Previous */}
            </div>
          }
          nextLabel={
            <div
              className={`capitalize text-sm text-gray-500 duration-200 hover:text-primary-focus`}
            >
              <BsArrowRightShort className="text-2xl text-primary" />
              {/* Next */}
            </div>
          }
          pageCount={pageCount}
          renderOnZeroPageCount={null}
          forcePage={forcePage - 1}
        />
      )}
    </>
  );
}
