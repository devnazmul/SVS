// =====================================
// #00108
// =====================================

import React, { useEffect, useRef, useState } from "react";
import { getAllDepartmentsWithoutPerPageForOrg } from "../../apis/department/department";
import CustomToaster from "../../components/CustomToaster";
import toast from "react-hot-toast";
import Tree from "react-d3-tree";
import { createOrgStructureObj } from "../../utils/createOrgStructureObj";
import CustomLoading from "../../components/CustomLoading";
import { DEPARTMENT_VIEW } from "../../constant/permissions";
import CheckPermission from "../../CheckPermission";

export default function OrgStructure() {
  const [translate, setTranslate] = useState({
    x: 200,
    y: 200,
  });
  const [isLoading, setIsLoading] = useState(true);

  const [departments, setDepartments] = useState([]);
  useEffect(() => {
    setIsLoading(true);
    getAllDepartmentsWithoutPerPageForOrg()
      .then((res) => {
        setDepartments(res);
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
  }, []);

  const renderRectSvgNode = ({ nodeDatum, toggleNode }) => (
    <g>
      <circle radius={20} x="-10" onClick={toggleNode} />
      <text className="fill-primary" strokeWidth="0" x="20">
        {nodeDatum.name}
      </text>
      {nodeDatum.attributes?.department && (
        <text fill="black" x="20" dy="20" strokeWidth="1">
          Admin: {nodeDatum.attributes?.Admin}
          ["Total Employees"]: {nodeDatum.attributes["Total Employees"]}
        </text>
      )}
    </g>
  );

  if (isLoading) {
    return <CustomLoading />;
  } else {
    return (
      <CheckPermission permissionArray={[DEPARTMENT_VIEW]}>
        <div className="bg-base-300 rounded-xl shadow-md border border-primary-content flex justify-center items-center h-screen">
          <Tree
            data={{
              name: departments?.name,
              attributes: {
                Owner:
                  Object.keys(departments?.manager || {}).length > 0
                    ? `${departments?.manager?.first_Name} ${
                        departments?.manager?.middle_Name
                          ? departments?.manager?.middle_Name
                          : ""
                      } ${departments?.manager?.last_Name}`
                    : `No Admin Found`,
                ["Total Employees"]: departments?.total_users_counts,
              },
              children: createOrgStructureObj(departments?.children_recursive),
            }}
            collapsible={true}
            zoomable
            orientation="vertical"
            rootNodeClassName="node__root"
            branchNodeClassName="node__branch"
            leafNodeClassName="node__leaf"
            nodeSize={{
              x: 260,
              y: 150,
            }}
            // renderCustomNodeElement={renderRectSvgNode}
            centeringTransitionDuration={10}
            translate={translate}
          />
        </div>
      </CheckPermission>
    );
  }
}
