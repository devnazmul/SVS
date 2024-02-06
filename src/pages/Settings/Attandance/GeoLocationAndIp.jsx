// =====================================
// #00141
// =====================================

import React, { useState } from "react";
import CustomField from "../../../components/InputFields/CustomField";

const GeoLocationAndIp = ({ formData, handleInputChange }) => {
  return (
    <div className="w-full mx-auto my-10 border-b border-primary-content lg:border-b-0 lg:rounded-xl lg:shadow-xl p-5 lg:shadow-primary-content lg:border lg:border-gray-300">
      <div className="w-full lg:w-1/2  -mt-1">
        <div className="label">
          <span className="label-text text-xl font-bold">
            Chose geolocation service
          </span>
        </div>

        <div className="flex items-start lg:items-center flex-col lg:flex-row justify-start w-full gap-5 -mt-1">
          {/* Google Map  */}
          <div className="form-control flex justify-start items-center">
            <label className="label cursor-pointer flex w-[150px] items-start justify-start gap-2">
              <input
                type="radio"
                name={`service_name`}
                value={"google_map"}
                className="toggle toggle-primary"
                onChange={handleInputChange}
                checked={formData?.service_name === "google_map"}
              />
              <span className="label-text">Google Map</span>
            </label>
          </div>

          {/* Mapbox  */}
          <div className="form-control flex justify-start items-center">
            <label className="label cursor-pointer flex w-[150px] items-start justify-start gap-2">
              <input
                type="radio"
                name={`service_name`}
                value={"map_box"}
                className="toggle toggle-primary"
                onChange={handleInputChange}
                checked={formData?.service_name === "map_box"}
              />
              <span className="label-text">Mapbox</span>
            </label>
          </div>

          {/* Ip Geolocation  */}
          <div className="form-control flex justify-start items-center">
            <label className="label cursor-pointer flex w-[150px] items-start justify-start gap-2">
              <input
                type="radio"
                name={`service_name`}
                value={"ip_geolocation"}
                className="toggle toggle-primary"
                onChange={handleInputChange}
                checked={formData?.service_name === "ip_geolocation"}
              />
              <span className="label-text">Ip Geolocation</span>
            </label>
          </div>
        </div>
      </div>
      <div
        className={`bg-primary-content w-full transition-all duration-300 rounded-xl overflow-hidden
           h-auto  p-5 pl-10 my-5 border-2 border-primary
          `}
      >
        <p>
          <span className="font-medium"> Note: </span>
          <span>
            {formData?.service_name === "google_map"
              ? " Google Map is a map and location service provider which is integrated with this app to get the Geolocation data of an employee when Punching In. Create an account to this website for the api key which is must need to get the location data. Otherwise you will get only the IP."
              : formData?.service_name === "map_box"
              ? "Mapbox is a map and location service provider which is integrated with this app to get the Geolocation data of an employee when Punching In. Create an account to this website for the api key which is must need to get the location data. Otherwise you will get only the IP."
              : "IP Geolocation is an IP API service provider which is integrated with this app to get the IP and Geolocation data of an employee when Punching In. Create an account to this website for the api key which is must need to get the location data. Otherwise you will get only the IP."}
          </span>
        </p>
      </div>
      <div>
        <CustomField
          disable={false}
          fieldClassName={"w-full"}
          label={"Api key"}
          id={"api_key"}
          name={"api_key"}
          onChange={handleInputChange}
          value={formData?.api_key}
          placeholder={"Api key"}
          type={"text"}
          wrapperClassName={"w-full"}
        />
      </div>
    </div>
  );
};

export default GeoLocationAndIp;
