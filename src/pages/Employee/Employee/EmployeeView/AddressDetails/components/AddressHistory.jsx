import { FiFilter, FiX } from "react-icons/fi";
import Headings from "../../../../../../components/Headings/Headings";
import NoDataFound from "../../../../../../components/NoDataFound";
import { useState } from "react";
import CustomDatePicker from "../../../../../../components/InputFields/CustomDatePicker";
import moment from "moment";
import CustomLoading from "../../../../../../components/CustomLoading";

export default function AddressHistory({
  addressHistories,
  setFilters,
  filters,
  handleSearch,
  isLoadingDepartments,
}) {
  // FILTER TOGGLE
  const [isFilterBarOpen, setIsFilterBarOpen] = useState(false);
  const toggleFilterBar = () => {
    if (isFilterBarOpen) {
      setFilters({ ...filters, start_date: "", end_date: "" });
      setTimeout(() => {
        handleSearch();
      }, 10);
      setIsFilterBarOpen(!isFilterBarOpen);
    } else {
      setIsFilterBarOpen(!isFilterBarOpen);
    }
  };
  return (
    <div className={` h-auto mt-5 `}>
      <div className="flex items-center justify-start gap-2">
        <h2 className="text-lg font-bold">Address History</h2>
        <button
          onClick={toggleFilterBar}
          data-tip={isFilterBarOpen ? "close" : "filter"}
          className={`tooltip tooltip-right tooltip-primary`}
        >
          {isFilterBarOpen ? (
            <FiX className="text-primary " />
          ) : (
            <FiFilter className={`text-primary`} />
          )}
        </button>
      </div>

      {isFilterBarOpen ? (
        <div
          className={`p-5 rounded-xl duration-300 border-primary-content shadow-md shadow-primary-content bg-base-300`}
        >
          <div className={`w-full flex justify-between items-center gap-5`}>
            <CustomDatePicker
              value={filters?.start_date}
              disable={false}
              // error={errors?.end_date}
              fieldClassName={"w-full"}
              format="dd-MM-yyyy"
              id={"start_date"}
              label={"Start Date"}
              name={"start_date"}
              onChange={(date) => {
                setFilters({ ...filters, start_date: date });
              }}
              placeholder={"Start Date"}
              type={"text"}
              wrapperClassName={"w-full md:w-1/2"}
              required={false}
            />
            <CustomDatePicker
              right
              value={filters?.end_date}
              disable={false}
              // error={errors?.end_date}
              fieldClassName={"w-full"}
              format="dd-MM-yyyy"
              id={"end_date"}
              label={"End Date"}
              name={"end_date"}
              onChange={(date) => {
                setFilters({ ...filters, end_date: date });
              }}
              placeholder={"End Date"}
              type={"text"}
              wrapperClassName={"w-full md:w-1/2"}
              required={false}
            />
          </div>
          <div>
            <button
              onClick={handleSearch}
              className={`btn btn-primary w-full mt-5`}
            >
              Search
            </button>
          </div>
        </div>
      ) : (
        ""
      )}

      <>
        {isLoadingDepartments ? (
          <>
            <CustomLoading />
          </>
        ) : (
          <>
            {" "}
            {addressHistories.length > 0 ? (
              addressHistories?.map((data, i) => (
                <div
                  key={i}
                  className="shadow shadow-primary-content px-5 pb-5 pt-1 rounded-xl border border-primary-content mt-5"
                >
                  <div>
                    <Headings level={3} className={`text-md text-primary mt-2`}>
                      {data?.from_date} to {data?.to_date}
                    </Headings>
                    <div className="flex flex-col gap-5 mt-5">
                      {/* ADDRESS & CITY  */}
                      <div className="flex flex-col md:flex-row justify-between items-start gap-5">
                        {/* ADDRESS */}
                        <div className="w-full md:w-1/2">
                          {/* LABEL */}
                          <label htmlFor="address_line_1" className="label">
                            <span className="label-text text-md font-bold">
                              Address{" "}
                            </span>
                          </label>
                          <p className="mx-1">{data?.address_line_1}</p>
                        </div>

                        {/* CITY */}
                        <div className="w-full md:w-1/2">
                          {/* LABEL */}
                          <label className="label">
                            <span className="label-text text-md font-bold">
                              City{" "}
                            </span>
                          </label>
                          <p className="mx-1">{data?.city}</p>
                        </div>
                      </div>

                      {/* COUNTRY & POSTCODE  */}
                      <div className="flex flex-col md:flex-row justify-between items-start gap-5">
                        {/* COUNTRY */}
                        <div className="w-full md:w-1/2">
                          {/* LABEL */}
                          <label className="label">
                            <span className="label-text text-md font-bold">
                              Country{" "}
                            </span>
                          </label>
                          <p className="mx-1">{data?.country}</p>
                        </div>

                        {/* POSTCODE */}
                        <div className="w-full md:w-1/2">
                          {/* LABEL */}
                          <label className="label">
                            <span className="label-text text-md font-bold">
                              Postcode{" "}
                            </span>
                          </label>
                          <p className="mx-1">{data?.postcode}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex w-full justify-center items-center">
                <NoDataFound
                  h="h-[400px]"
                  text={`No Address History Found!`}
                  backButton={false}
                />
              </div>
            )}
          </>
        )}
      </>
    </div>
  );
}
