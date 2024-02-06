// =====================================
// #00137
// =====================================

import React, { useEffect, useState } from "react";
import Headings from "../../components/Headings/Headings";
import { FiCalendar } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import { BsFillPersonCheckFill } from "react-icons/bs";
import { FaRegFlag } from "react-icons/fa6";
import { getAllPayrun } from "../../apis/payrun/payrun";
import axios from "axios";

export default function Payrun() {
  // LOADINGS
  const [isPending, setIsPending] = useState(false);
  const [data, setData] = useState([]);

  const getAllPayrun = async () => {
    // GET DISH BY ID
    const jwt = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    };

    await axios
      .get(`/v1.0/payruns`, config)
      .then((res) => {
        console.log({ r: res.data });
        setData(res.data);
      })
      .catch((err) => {
        throw err;
      });
  };
  useEffect(() => {
    getAllPayrun();
  }, []);
  console.log(data);

  return (
    <div className="flex flex-col gap-y-5">
      {/* ======= HEADING AND FILTERING AREA =========  */}
      <div className="flex flex-col md:flex-row justify-between items-center relative gap-5">
        <div className="flex flex-col gap-2 w-full text-center md:text-left">
          <Headings level={1}>All Payrun Status</Headings>
          <h3>
            {/* Total {data?.total}{" "}
          {data?.total > 1 ? "Employment Statuses" : "Employment Status"}{" "}
          Found */}
          </h3>
        </div>

        <div className="flex flex-col justify-end md:flex-row gap-5 w-full">
          <div className="flex justify-end md:justify-start gap-5">
            <button
              // onClick={}
              className="btn btn-primary w-1/3 md:w-16 lg:w-32"
            >
              {/* <BiPlus />{" "} */}
              <span className="block sm:hidden lg:block">Settings</span>
            </button>
            <button
              // onClick={}
              className="btn btn-primary w-1/3 md:w-16 lg:w-40"
            >
              {/* <FiFilter />{" "} */}
              <span className="block sm:hidden lg:block">Default Payrun</span>
            </button>
          </div>
        </div>
      </div>

      {/* PAYSLIPS CONTAINER  */}
      <section>
        <div className="flex flex-row gap-x-5 rounded-xl shadow-md p-10 w-full">
          {/* PAYSLIPS DETAILS  */}
          <div className="w-2/5 flex flex-col gap-y-1">
            <div className="flex flex-row gap-x-3 items-center  justify-start">
              <h6 className="font-medium text-lg">01 - 31 Dec, 23 </h6>
              <span className="text-sm text-gray-500">
                Includes 5 employees
              </span>
            </div>

            <div className="">
              <span>Monthly - Hour based (include overtime)s</span>
              <span className="text-gray-500"> | </span>
              <span className="text-sky-500">Manual</span> <span>- </span>
              <span>Followed by Customized</span>
            </div>

            <div>
              {" "}
              <span className="text-gray-500">ID</span> : <span>MZ5FMI8J</span>
            </div>

            <button
              type="button "
              className="btn btn-primary w-2/6 capitalize text-sm"
            >
              Vew payslips
            </button>
          </div>

          {/* PAYSLIPS STATTUS  */}
          <div className="w-2/5 flex flex-col gap-y-1">
            <button type="button" className="btn btn-secondary w-1/4">
              Send
            </button>
            <div className="flex flex-row items-center justify-start gap-x-2">
              <span className="text-gray-500">
                <FiCalendar />
              </span>
              <span className="text-gray-500">Created at</span>
              <span>Yesterday</span>
            </div>

            <div className="flex flex-row items-center justify-start gap-x-2">
              <span>
                <BsFillPersonCheckFill />
              </span>
              <span>
                Sent to <span>1</span> employee
              </span>
            </div>

            <div className="flex flex-row items-center justify-start gap-x-2">
              <span>
                <FaRegFlag />
              </span>
              <p className="flex flex-row items-center justify-start gap-x-2">
                Payslip of <span>4</span> employees are conflicted
                <span className="text-sky-500">Manage</span>
              </p>
            </div>
          </div>

          {/* PAYSLIPS ACTIONS  */}
          <div className="w-[20%] flex flex-row gap-x-3">
            <button type="button" className="btn btn-circle text-4xl">
              <RiDeleteBinLine />
            </button>
            <button type="button" className="btn btn-outline">
              Send payslips
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
