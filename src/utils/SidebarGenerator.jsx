import React from "react";
import ParentSidebarMenuItem from "../components/ParentSidebarMenuItem";
import SidebarMenuItem from "../components/SidebarMenuItem";
import { useNav } from "../context/AuthContext";

export default function SidebarGenerator({ links, isNested }) {
  return links.map((lnk, i) => {
    const { title, link, Icon, show, childrens, isScrollable } = lnk;

    if (childrens?.length > 0) {
      return (
        <>
          {show && (
            <ParentSidebarMenuItem
              total={links.length}
              key={i}
              show={show}
              link={link}
              i={i}
              title={title}
              Icon={Icon}
              childrens={childrens}
              isNested={isNested}
              isScrollable={isScrollable}
            />
          )}
        </>
      );
    } else {
      return (
        <>
          {show && (
            <SidebarMenuItem
              isLast={links?.length === i + 1}
              key={i}
              show={show}
              link={link}
              i={i}
              title={title}
              Icon={Icon}
              childrens={childrens}
              isNested={isNested}
            />
          )}
        </>
      );
    }
  });
}
