import React from "react";
import ReactHtmlParser from "react-html-parser";

function HTMLRenderer({ htmlString }) {
  // Use dangerouslySetInnerHTML to render the HTML
  return <div>{ReactHtmlParser(htmlString)}</div>;
}

export default HTMLRenderer;
