// ===========================================
// #00122
// ===========================================

import React, { Fragment, useState } from "react";
import { BiError } from "react-icons/bi";
import Pagination from "./Pagination";
import CustomPerPageSelector from "./CustomPerPageSelector";
import CustomDropDownForTable from "./CustomDropDownForTable";
import CustomLoading from "./CustomLoading";
import { checkPermissions } from "../utils/checkPermissions";

export default function Table({
  rows,
  cols,
  isLoading,
  actions,
  isFullActionList = true,
  itemsPerPage,
  totalItems,
  onChangePage,
  setPerPage,
  perPage,
  selectedIds,
  setSelectedIds,
  checkBoxes = false,
  minWidth = "900px",
  header = true,
}) {
  const [allChecked, setAllChecked] = useState(false);

  const permissions = localStorage.getItem("permissions");

  const handleTickAll = (e) => {
    const { name, value, checked } = e.target;
    if (checked) {
      setSelectedIds(rows.map((d) => parseInt(d.id)));
      setAllChecked(true);
    } else {
      setSelectedIds([]);
      setAllChecked(false);
    }
  };

  const handleTick = (e) => {
    const { name, value, checked } = e.target;
    if (checked) {
      setSelectedIds([...selectedIds, parseInt(value)]);
    } else {
      setSelectedIds(
        selectedIds.filter((single_id) => single_id !== parseInt(value))
      );
      setAllChecked(false);
    }
  };

  const htmlMode = document.documentElement.getAttribute("data-theme");

  return (
    <div className="md:shadow-lg overflow-x-auto scrollbar-thin scrollbar-track-base-100 scrollbar-thumb-primary-content top-0 w-full scrollbar-w-1 bg-base-200 md:bg-base-300">
      {/* FOR DESKTOP VIEW  */}
      <table
        // style={{ minWidth: `${minWidth}` }}
        className="hidden md:table gap-2 rounded-xl "
      >
        {header ? (
          <thead className="bg-base-200">
            <tr className="h-16 text-neutral border-b border-primary-content">
              {checkBoxes ? (
                <th
                  style={{
                    width: `1%`,
                  }}
                  className=" px-8"
                >
                  <label>
                    <input
                      checked={
                        allChecked ||
                        (selectedIds?.length === rows?.length &&
                          selectedIds?.length !== 0)
                      }
                      onClick={handleTickAll}
                      onChange={() => {}}
                      type="checkbox"
                      className={`checkbox checkbox-primary`}
                    />
                  </label>
                </th>
              ) : (
                ""
              )}
              <th
                style={{
                  width: `1%`,
                }}
                className="px-5"
              >
                <div className="flex flex-col items-start justify-start gap-2"></div>
              </th>
              {cols.map((th, i) => (
                <Fragment key={i}>
                  {th?.show ? (
                    <th
                      className={`px-5 ${
                        th?.isMainField ? "table-cell" : "hidden"
                      } md:table-cell`}
                      style={{
                        width: `${th?.minWidth}%`,
                        // textAlign: th?.alignCenter ? `center` : `left`,
                      }}
                    >
                      <div className="flex flex-col items-start justify-start gap-2 font-semibold">
                        {th?.name.slice(0, 1).toUpperCase() + th?.name.slice(1)}{" "}
                      </div>
                    </th>
                  ) : (
                    ""
                  )}
                </Fragment>
              ))}

              {actions.length > 0 ? (
                <th
                  style={{
                    minWidth: "1%",
                    paddingRight: "20px",
                  }}
                >
                  <div className="flex items-center justify-end">
                    <span>Actions</span>
                  </div>
                </th>
              ) : (
                ""
              )}
            </tr>
          </thead>
        ) : (
          ""
        )}

        <tbody className="">
          {!isLoading ? (
            rows && rows?.length > 0 ? (
              rows.map((data, i) => (
                <tr
                  key={i}
                  className="border-b border-primary-content bg-base-300 h-16 hover:bg-base-100 text-neutral group tableRowAdmin hover:overflow-hidden"
                >
                  {checkBoxes ? (
                    <td className="w-[50px] px-8">
                      <label>
                        <input
                          checked={allChecked || selectedIds.includes(data.id)}
                          value={data?.id}
                          onClick={handleTick}
                          onChange={() => {}}
                          type="checkbox"
                          className="checkbox checkbox-primary"
                        />
                      </label>
                    </td>
                  ) : (
                    ""
                  )}
                  <td
                    key={i}
                    style={{
                      minWidth: "1%",
                    }}
                    className="px-5"
                  >
                    <span>{i + 1}</span>
                  </td>

                  {cols.map((col, j) => (
                    <Fragment key={j}>
                      {col?.show ? (
                        <td
                          style={{
                            width: `${col?.minWidth}%`,
                            // textAlign: col?.alignCenter ? `center` : `left`,
                          }}
                          key={j}
                          className={`px-5 ${
                            col?.isMainField ? "table-cell" : "hidden"
                          } md:table-cell`}
                        >
                          {data[col?.attribute_name]}
                        </td>
                      ) : (
                        ""
                      )}
                    </Fragment>
                  ))}

                  {actions?.length > 0 ? (
                    <td
                      style={{
                        width: "1%",
                        paddingRight: "20px",
                      }}
                      className="text-right"
                    >
                      {!isFullActionList ? (
                        <CustomDropDownForTable
                          isDeleteDisabled={data?.is_system_default}
                          disabled={selectedIds.length > 1}
                          fullData={rows}
                          index={i}
                          isDataLoading={isLoading}
                          isShareDataLoading={isLoading}
                          data={data}
                          actions={actions}
                        />
                      ) : (
                        <div className="flex gap-5 justify-end items-center">
                          {actions
                            .filter((action) => {
                              return !action.disabledOn.some((disable) => {
                                const conditionValue =
                                  data[disable.attributeName];
                                return conditionValue === disable.value;
                              });
                            })
                            .slice(0, 3)
                            .map((action, index) => (
                              <React.Fragment key={index}>
                                {checkPermissions(
                                  action.permissions,
                                  permissions
                                ) ? (
                                  <button
                                    onClick={() => action.handler(data?.id)}
                                    data-tip={action.name}
                                    className={`tooltip ${
                                      action === actions[actions.length - 1]
                                        ? "tooltip-left"
                                        : "tooltip-top"
                                    } tooltip-primary`}
                                    key={index}
                                  >
                                    <action.Icon
                                      className={`text-xl ${
                                        action.name === "delete"
                                          ? " text-red-500"
                                          : "text-primary"
                                      }`}
                                    />
                                  </button>
                                ) : (
                                  ""
                                )}
                              </React.Fragment>
                            ))}

                          {actions.length > 3 ? (
                            <CustomDropDownForTable
                              isDeleteDisabled={data?.is_system_default}
                              disabled={selectedIds.length > 1}
                              fullData={rows}
                              index={i}
                              isDataLoading={isLoading}
                              isShareDataLoading={isLoading}
                              data={data}
                              actions={actions
                                .filter((action) => {
                                  return !action.disabledOn.some((disable) => {
                                    const conditionValue =
                                      data[disable.attributeName];
                                    return conditionValue === disable.value;
                                  });
                                })
                                .slice(3)}
                            />
                          ) : (
                            ""
                          )}
                        </div>
                      )}
                    </td>
                  ) : (
                    ""
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="text-center py-5 bg-base-300"
                  colSpan={cols?.length + 4}
                >
                  {/* FOR DEFAULT LIGHT THEME  */}
                  {/* {htmlMode === "default" ? ( */}
                  <div className="flex justify-center items-center flex-col">
                    <div className="w-[200px] flex flex-col gap-2 justify-center items-center">
                      <img
                        className="w-20"
                        src="/assets/nodatafound.svg"
                        alt="no data found"
                      />
                      <div>
                        <h4 className="font-medium text-lg">Nothing Found!</h4>
                        <p className="font-light">
                          Please add a new entity to see the content here. Thank
                          you!
                        </p>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            )
          ) : (
            <tr>
              <td className="text-center py-5" colSpan={cols?.length + 4}>
                <span className="loading loading-spinner text-primary loading-lg"></span>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* FOR MOBILE VIEW  */}
      <div className={`w-full block md:hidden `}>
        {!isLoading ? (
          rows?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-0 bg-base-200 ">
              {rows?.map((data, i) => (
                <div
                  key={i}
                  className="p-5 my-2 rounded-xl bg-base-300 border border-primary-content shadow-md shadow-primary-content relative flex flex-col items-center justify-center"
                >
                  <div className={`w-full flex justify-center pt-1 pb-5`}>
                    {actions?.length > 0 ? (
                      <td className="text-right p-0">
                        {!isFullActionList ? (
                          <CustomDropDownForTable
                            isDeleteDisabled={data?.is_system_default}
                            disabled={selectedIds.length > 1}
                            fullData={rows}
                            index={i}
                            isDataLoading={isLoading}
                            isShareDataLoading={isLoading}
                            data={data}
                            actions={actions}
                          />
                        ) : (
                          <div className="flex gap-2 justify-end items-center">
                            {actions
                              .filter((action) => {
                                return !action.disabledOn.some((disable) => {
                                  const conditionValue =
                                    data[disable.attributeName];
                                  return conditionValue === disable.value;
                                });
                              })
                              .map((action, index) => (
                                <>
                                  {checkPermissions(
                                    action.permissions,
                                    permissions
                                  ) ? (
                                    <button
                                      onClick={() => action.handler(data?.id)}
                                      data-tip={action.name}
                                      className={`tooltip tooltip-bottom tooltip-primary`}
                                      key={index}
                                    >
                                      {/* {console.log({
                                      permissions: checkPermissions(
                                        action.permissions,
                                        permissions
                                      ),
                                      name: action.name,

                                    })} */}
                                      <action.Icon
                                        className={`text-xl ${
                                          action.name === "delete"
                                            ? " text-red-500"
                                            : "text-primary"
                                        }`}
                                      />
                                    </button>
                                  ) : (
                                    ""
                                  )}
                                </>
                              ))}
                          </div>
                        )}
                      </td>
                    ) : (
                      ""
                    )}
                  </div>
                  {/* DATA  */}
                  <table className="table w-full ">
                    <tbody>
                      {/* <tr className={`px-5 w-auto border-y border-primary-content`}>
                    <td className="font-bold  text-primary border border-primary-content w-[40%] ">
                      Actions:
                    </td>

                  </tr> */}
                      {cols.map((col, j) => (
                        <>
                          {col?.show ? (
                            <>
                              {data[col?.attribute_name] ? (
                                <tr
                                  key={j}
                                  className={`px-5 border-y border-primary-content w-auto`}
                                >
                                  <td className="font-bold border border-primary-content text-primary w-[35%]">
                                    {col.name}:
                                  </td>
                                  <td
                                    className={`border border-primary-content w-[65%]`}
                                  >
                                    {data[col?.attribute_name]}
                                  </td>
                                </tr>
                              ) : (
                                ""
                              )}
                            </>
                          ) : (
                            ""
                          )}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center flex-col bg-base-200 p-5  rounded-xl">
              <div className="w-[200px] flex flex-col gap-2 justify-center items-center">
                <img
                  className="w-20"
                  src="/assets/nodatafound.svg"
                  alt="no data found"
                />
                <div className={`flex justify-center items-center flex-col`}>
                  <h4 className="font-medium text-lg text-center">
                    Nothing Found!
                  </h4>
                  <p className="font-light text-center">
                    Please add a new entity to see the content here. Thank you!
                  </p>
                </div>
              </div>
            </div>
          )
        ) : (
          <CustomLoading h={"h-[40vh]"} />
        )}
      </div>
    </div>
  );
}
