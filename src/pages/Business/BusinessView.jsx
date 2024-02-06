// =====================================
// #00120
// =====================================

import React, { useEffect } from "react";

import { useQuery } from "@tanstack/react-query";
import Headings from "../../components/Headings/Headings";
import { getSingleBusiness } from "../../apis/userAndBusiness/business";
import CheckPermission from "../../CheckPermission";
import { BUSINESS_VIEW } from "../../constant/permissions";

export default function BusinessView({ id }) {
  const { isPending, isError, data, refetch, isRefetching } = useQuery({
    queryKey: ["singleBusiness"],
    queryFn: () => getSingleBusiness(id),
    onError: (error) => {
      toast.custom((t) => (
        <CustomToaster
          t={t}
          type={"error"}
          text={`ID: #00119 - ${error?.response?.data?.message}`}
          errors={error?.response?.data?.errors}
        />
      ));
    },
  });

  useEffect(() => {
    refetch();
  }, [id]);

  return (
    <CheckPermission permissionArray={[BUSINESS_VIEW]}>
      <div className="">
        {isRefetching || isPending ? (
          <div className="flex h-full w-full  justify-center items-center">
            <span className="loading loading-spinner text-primary loading-lg"></span>
          </div>
        ) : (
          <div>
            <div className="w-full">
              <Headings className={`text-black`} level={1}>
                Business Details
              </Headings>

              <div className="w-full rounded-xl shadow-lg">
                <div className={`flex`}>
                  <div className="group">
                    <button className="bg-base-100 bg-opacity-0 group-hover:bg-opacity-50">
                      Change
                    </button>
                    <img src="" alt="" />
                  </div>
                  <div>
                    <h1>Profile Name</h1>
                    <span>Active</span>
                    <span>email@email.com</span>
                    <span>Role1,Role2,Role3</span>
                  </div>
                </div>
                <div className={`border-t md:border-l border-base-100`}>
                  <div>
                    <div></div>
                    <div></div>
                  </div>
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </CheckPermission>
  );
}
