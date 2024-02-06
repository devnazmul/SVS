// Dashboard.js

import React, { useEffect, useState } from "react";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DashboardWidget from "../../components/Widgets/DashboardWidget";
import Headings from "../../components/Headings/Headings";
import { FiFilter, FiSave } from "react-icons/fi";
import DashboardWidgetWithContent from "../../components/Widgets/DashboardWidgetWithContent";
import { MdCancel } from "react-icons/md";
import {
  getAllDashboardData,
  updateDashboardWidgetOrder,
} from "../../apis/dashboard/dashboard";
import toast from "react-hot-toast";
import CustomToaster from "../../components/CustomToaster";
import CustomLoading from "../../components/CustomLoading";
import { OutsideClickHandler } from "../../components/OutsideClickHandler";
import { BsFillPencilFill } from "react-icons/bs";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const [isDragAble, setIsDragAble] = useState(false);
  const { user } = useAuth();
  const [dragAbleWidgets, setDragAbleWidgets] = useState([]);
  const [dropItems, setDropItems] = useState([]);

  // FILTERS
  const [filters, setFilters] = useState([
    { id: 1, name: "Today", value: "today" },
    { id: 2, name: "This Week", value: "this_week" },
    { id: 3, name: "Last Week", value: "last_week" },
    { id: 4, name: "Next Week", value: "next_week" },
    { id: 5, name: "This Month", value: "this_month" },
    { id: 6, name: "Last Month", value: "last_month" },
    { id: 7, name: "Next Month", value: "next_month" },
  ]);
  const [selectedFilter, setSelectedFilter] = useState("today");

  // CONVERT OBJ TO ARRAY HELPER FUNCTION
  function convertObjectToArray(inputObject) {
    const resultArray = [];

    for (const key in inputObject) {
      if (Object.hasOwnProperty.call(inputObject, key)) {
        const categoryData = inputObject[key];
        resultArray.push(categoryData);
      }
    }

    return resultArray;
  }

  // GET ALL DASHBOARD DATA
  const [isLoading, setIsLoading] = useState(true);
  const getAllData = () => {
    setIsLoading(true);
    getAllDashboardData()
      .then((res) => {
        setDragAbleWidgets(
          convertObjectToArray(res).filter(
            (widget) => widget?.widget_order === 0
          )
        );
        setDropItems(
          convertObjectToArray(res).filter(
            (widget) => widget?.widget_order !== 0
          )
        );
        console.log({ res: convertObjectToArray(res) });
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);

        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"error"}
            text={`ID: #00119 - ${error?.response?.data?.message}`}
            errors={error?.response?.data?.errors}
          />
        ));
      });
  };
  // GETTING ALL WIDGETS
  useEffect(() => {
    if (user?.business_id) {
      getAllData();
    } else {
      setIsLoading(false);
    }
  }, []);

  // UPDATE ORDER IN DROP
  const handleUpdateOrder = (data) => {
    updateDashboardWidgetOrder(data)
      .then((res) => {})
      .catch((error) => {
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"error"}
            text={`ID: #00119 - ${error?.response?.data?.message}`}
            errors={error?.response?.data?.errors}
          />
        ));
      });
  };

  // HANDLE DROP
  const handleWidgetDrop = (item, widget_order, left, top) => {
    setDragAbleWidgets(
      dragAbleWidgets.filter((item1) => item1?.id !== item?.id)
    );

    if (
      dropItems.filter((widget) => widget?.widget_order === widget_order)
        ?.length > 0
    ) {
      // IF DROP-ABLE ALREADY HAVE VALUE THEN SWAP
      handleUpdateOrder({
        widgets: [
          {
            id: item?.id,
            widget_name: item?.widget_name,
            widget_order: widget_order,
          },
        ],
      });
      let tempDropItems = dropItems.map((widget) => {
        if (widget?.widget_order === widget_order) {
          return { ...widget, widget_order: item?.widget_order };
        } else {
          return { ...widget };
        }
      });
      setDropItems(
        tempDropItems.map((widget) => {
          if (widget?.id === item?.id) {
            return { ...widget, widget_order: widget_order, top, left };
          } else {
            return widget;
          }
        })
      );
    } else {
      // IF DROP-ABLE HAVE NO VALUE THEN ADD THE ITEM
      if (dropItems.filter((widget) => widget?.id === item?.id)?.length > 0) {
        // IF SAME ITEM ON OTHER DROP-AREA THE REPLACE IT
        item.widget_order = widget_order;
        handleUpdateOrder({
          widgets: [
            {
              id: item?.id,
              widget_name: item?.widget_name,
              widget_order: widget_order,
            },
          ],
        });
        setDropItems([
          ...dropItems.filter((widget) => widget?.id !== item?.id),
          { ...item, widget_order, left, top },
        ]);
      } else {
        // IF IT IS A NEW ITEM AND NOT ALREADY PLACED ON ANY DROP_AREA
        handleUpdateOrder({
          widgets: [
            {
              id: item?.id,
              widget_name: item?.widget_name,
              widget_order: widget_order,
            },
          ],
        });
        setDropItems([...dropItems, { ...item, widget_order, left, top }]);
      }
    }
  };

  // HANDLE REMOVE WIDGET
  const handleRemoveWidget = (widget_name) => {
    let dropItem = dropItems.find((wid) => wid?.widget_name === widget_name);
    handleUpdateOrder({
      widgets: [
        {
          id: dropItem?.id,
          widget_name: dropItem?.widget_name,
          widget_order: 0,
        },
      ],
    });
    setDragAbleWidgets([...dragAbleWidgets, { ...dropItem, widget_order: 0 }]);
    setDropItems(dropItems.filter((wid) => wid?.widget_name !== widget_name));
  };

  useEffect(() => {
    console.log({ dropItems });
  }, [dropItems]);

  // HANDLE FILTER
  const [isFilterOn, setIsFilterOn] = useState(false);
  const toggleFilterOpt = () => {
    setIsFilterOn(!isFilterOn);
  };
  // CHANGE FILTER
  const handleChangeFilter = (filter) => {
    setSelectedFilter(filter);
    setIsFilterOn(false);
  };

  let count = 1;
  // DROP-ZONE COMPONENT
  const ColumnDropZone = ({ widget_order, isDragAble }) => {
    const [{ isOver }, drop] = useDrop({
      accept: "WIDGET",
      drop: (item, monitor) => {
        const delta = monitor.getDifferenceFromInitialOffset();
        const left = Math.round(item.x + delta.x);
        const top = Math.round(item.y + delta.y);
        count++;
        handleWidgetDrop(item, widget_order, left, top);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    });

    return (
      <div
        ref={isDragAble ? drop : null}
        className={`h-[200px] w-full ${
          isOver || isDragAble
            ? "border-4 rounded-xl border-primary-content border-dashed"
            : ""
        }`}
      >
        {/* Additional styling for drop zone if needed */}
        <>
          {
            <>
              {dropItems?.filter(
                (widget) => widget?.widget_order === widget_order
              )?.length > 0 ? (
                dropItems
                  ?.filter((widget) => widget?.widget_order === widget_order)
                  .map((widget, i) => (
                    <div key={i} className={`relative h-full`}>
                      {/* REMOVE FROM ACTIVE WIDGET  */}
                      {((isDragAble &&
                        widget.widget_order === dropItems?.length) ||
                        widget.widget_order === dropItems?.length + 1) && (
                        <button
                          className="absolute top-1 right-1"
                          onClick={() =>
                            handleRemoveWidget(widget?.widget_name)
                          }
                        >
                          <MdCancel className={`text-xl text-red-500`} />
                        </button>
                      )}
                      <DashboardWidgetWithContent
                        filter={selectedFilter}
                        item={widget}
                        key={widget.id}
                        id={widget.id}
                        content={widget.content}
                        widget_order={widget.widget_order}
                      />
                    </div>
                  ))
              ) : (
                <>
                  {isOver ? (
                    <div
                      className={`w-full h-full flex justify-center items-center`}
                    >
                      <Headings className={`text-primary`} level={3}>
                        Drop Here!
                      </Headings>
                    </div>
                  ) : (
                    ""
                  )}
                </>
              )}
            </>
          }
        </>
      </div>
    );
  };

  // HANDLE TOGGLE WIDGET SIDE BAR
  const [isWidgetBarOpened, setIsWidgetBarOpened] = useState(false);

  if (isLoading) {
    return <CustomLoading />;
  } else {
    return (
      <DndProvider backend={HTML5Backend}>
        <div className={`flex items-center justify-between mt-2 mb-5 `}>
          <div className={`flex items-center gap-3`}>
            <Headings level={1}>Dashboard</Headings>
            {!isDragAble ? (
              <button
                data-tip="Edit"
                onClick={() => setIsDragAble(true)}
                className={`tooltip tooltip-bottom tooltip-primary text-primary`}
              >
                <BsFillPencilFill className={`text-xl`} />
              </button>
            ) : (
              <button
                data-tip="Save"
                onClick={() => setIsDragAble(false)}
                className={`tooltip tooltip-bottom tooltip-primary text-primary`}
              >
                <FiSave className={`text-2xl`} />
              </button>
            )}
          </div>

          {!isDragAble && (
            <OutsideClickHandler
              onOutsideClick={() => setIsFilterOn(false)}
              className="relative w-1/3 md:w-20 lg:w-40"
            >
              <button
                className="btn btn-primary w-full relative"
                onClick={toggleFilterOpt}
              >
                <FiFilter className={`text-lg`} />{" "}
                <span className="block sm:hidden lg:block">Filter</span>
              </button>

              {isFilterOn ? (
                <div
                  className={`absolute right-0 gap-2 z-30 w-full top-full mt-2 bg-base-300 rounded-md border border-primary shadow-md shadow-primary-content px-2  py-2 flex flex-col`}
                >
                  {filters.map((filter, i) => (
                    <button
                      key={i}
                      onClick={() => handleChangeFilter(filter?.value)}
                      className={` btn-primary inline btn-outline rounded-md py-2 btn btn-sm  ${
                        selectedFilter === filter?.value
                          ? "btn-active"
                          : " hover:btn-primary"
                      } `}
                    >
                      {filter?.name}
                    </button>
                  ))}
                </div>
              ) : (
                ""
              )}
            </OutsideClickHandler>
          )}
        </div>

        {/* MAIN SECTION  */}
        {dropItems?.length !== 0 || isDragAble ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* DASHBOARD  */}
            {new Array(isDragAble ? dropItems?.length + 1 : dropItems?.length)
              .fill(0)
              .map((i, widget_order) => (
                <div key={widget_order} className="relative">
                  <ColumnDropZone
                    isDragAble={isDragAble}
                    widget_order={widget_order + 1}
                  />
                </div>
              ))}
          </div>
        ) : (
          <div
            className={`flex justify-center items-center h-[70vh] gap-3 flex-col`}
          >
            <h1 className={`text-2xl text-primary font-bold`}>
              No Widget Added Yet!
            </h1>
            <span className={``}>Please edit the page</span>
          </div>
        )}

        {/* AVAILABLE WIDGETS  */}
        {isDragAble && (
          <div className={` border-t border-primary-content pt-2 mt-10`}>
            <h1 className={`text-xl font-bold text-primary text-center my-5`}>
              Available Widgets
            </h1>
            <div
              className={`p-5 border-2 rounded-xl border-primary-content bg-base-300`}
            >
              {dragAbleWidgets?.length > 0 ? (
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-5`}
                >
                  {dragAbleWidgets.map((widget) => (
                    <DashboardWidget
                      isDragAble={isDragAble}
                      item={widget}
                      key={widget.id}
                      id={widget.id}
                      content={widget.content}
                      widget_order={widget.widget_order}
                    />
                  ))}
                </div>
              ) : (
                <div className={`flex w-full items-center justify-center`}>
                  No Widget Found!
                </div>
              )}
            </div>
          </div>
        )}
      </DndProvider>
    );
  }
};

export default Dashboard;
