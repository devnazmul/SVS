// ===========================================
// #00122
// ===========================================

import React, { Fragment, useState } from "react";
import { BiError } from "react-icons/bi";
import Pagination from "./Pagination";
import CustomPerPageSelector from "./CustomPerPageSelector";
import CustomDropDownForTable from "./CustomDropDownForTable";
import { RiEdit2Fill } from "react-icons/ri";

export default function TableWithEditingField({
  rows,
  cols,
  isLoading,
  actions,
  isFullActionList = true,
  itemsPerPage,
  totalItems,
  setPageNo,
  setPerPage,
  perPage,
  selectedIds,
  setSelectedIds,
  checkBoxes = false,
  minWidth = "900px",
  header = true,
}) {
  const [allChecked, setAllChecked] = useState(false);

  const [isEditEnabled, setIsEditEnabled] = useState({
    id: null,
    state: false,
  });

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

  const [formData, setFormData] = useState();
  const onFormDataChange = (e) => {
    const [name, value] = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSave = () => {};
  const htmlMode = document.documentElement.getAttribute("data-theme");

  return (
    <div className="shadow-lg overflow-x-auto scrollbar-thin scrollbar-track-base-100 scrollbar-thumb-primary-content top-0 w-full scrollbar-w-1 bg-base-300">
      <table
        // style={{ minWidth: `${minWidth}` }}
        className="table gap-2 rounded-xl "
      >
        {header && (
          <thead className="bg-base-200">
            <tr className="h-16 text-neutral border-b border-primary-content">
              {checkBoxes && (
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
                  {th?.show && (
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
                  )}
                </Fragment>
              ))}

              {actions.length > 0 ? (
                <th
                  style={{
                    minWidth: "1%",
                  }}
                >
                  <div className="flex items-center justify-center">
                    <span>Actions</span>
                  </div>
                </th>
              ) : (
                ""
              )}
            </tr>
          </thead>
        )}

        <tbody className="">
          {!isLoading ? (
            rows.length > 0 ? (
              rows.map((data, i) => (
                <tr
                  key={i}
                  className="border-b border-primary-content bg-base-300 h-16 hover:bg-base-100 text-neutral group tableRowAdmin hover:overflow-hidden"
                >
                  {checkBoxes && (
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
                      {col?.show && (
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
                          {isEditEnabled.state &&
                          isEditEnabled.id === data?.id &&
                          col?.isEditable ? (
                            <input
                              type="text"
                              defaultValue={data[col?.attribute_name]}
                              onChange={onFormDataChange}
                            />
                          ) : (
                            data[col?.attribute_name]
                          )}
                        </td>
                      )}
                    </Fragment>
                  ))}

                  {actions?.length > 0 ? (
                    <td
                      style={{
                        width: "1%",
                      }}
                      className="text-center"
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
                        <div className="flex gap-5 justify-center">
                          {isEditEnabled.id !== data?.id ? (
                            <>
                              {!isEditEnabled.state ? (
                                <button
                                  onClick={() =>
                                    setIsEditEnabled({
                                      id: data?.id,
                                      state: true,
                                    })
                                  }
                                  data-tip={"edit"}
                                  className={`tooltip tooltip-bottom tooltip-primary`}
                                >
                                  <RiEdit2Fill
                                    className={`text-xl text-primary`}
                                  />
                                </button>
                              ) : (
                                ""
                              )}
                              {actions.map((action, index) => (
                                <button
                                  onClick={() => action.handler(data?.id)}
                                  data-tip={action.name}
                                  className={`tooltip tooltip-bottom tooltip-primary`}
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
                              ))}
                            </>
                          ) : (
                            <button
                              onClick={handleSave}
                              data-tip={"save"}
                              className={`tooltip tooltip-bottom tooltip-primary`}
                            >
                              <RiEdit2Fill className={`text-xl text-primary`} />
                            </button>
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

      {totalItems !== 0 && (
        <div
          // style={{ minWidth: minWidth }}
          className=" my-2 flex-col flex justify-center bg-base-300 items-center"
        >
          <Pagination
            forcePage={filters?.page}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            setPageNo={setPageNo}
          />
        </div>
      )}
    </div>
  );
}
