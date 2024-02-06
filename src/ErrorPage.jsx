// ===========================================
// #00102
// ===========================================

import { useRouteError } from "react-router-dom";
import Headings from "./components/Headings/Headings";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error.statusText || error.message);
  return (
    <div
      id="error-page"
      className=" w-full h-screen flex justify-center items-center flex-col"
    >
      <div className="flex gap-5 justify-center md:justify-between items-center flex-col  w-[80%]">
        <div>
          <Headings level={1} className={`text-primary`}>
            Something is wrong!
          </Headings>
          {/* <p className="text-xl"></p> */}
        </div>
        <div className="w-[250px] md:w-[350px]">
          <img src="/assets/ServersideError.svg" alt="" />
        </div>
      </div>
    </div>
  );
}
