import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userData")) || {};

  return (
    <section className="bg-base-300 w-full">
      <div className="container min-h-screen px-6 py-12 mx-auto lg:flex lg:items-center:gap-12 w-full flex justify-center items-center  flex-col-reverse">
        <div className="wf-ull lg:w-1/2 text-center">
          {Object.keys(user).length > 0 ? (
            <>
              <h1 className="mt-3 text-2xl font-semibold text-primary md:text-3xl">
                Page not found
              </h1>

              <p className="mt-4 text-gray-500">
                Sorry, the page you are looking for doesn't exist.Here are some
                helpful links:
              </p>

              <div className="flex items-center mt-6 gap-x-3 justify-center">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center border-primary justify-center w-1/2 px-5 py-2 text-sm text-primary hover:scale-90 duration-200 transition-colors bg-white border rounded-lg gap-x-2 sm:w-auto "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5 rtl:rotate-180"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                    />
                  </svg>

                  <span>Go back</span>
                </button>

                <NavLink
                  to={`/`}
                  className="w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors  hover:scale-90 duration-200 bg-primary rounded-lg shrink-0 sm:w-auto hover:bg-primary-focus "
                >
                  Take me home
                </NavLink>
              </div>
            </>
          ) : (
            <>
              <h1 className="mt-3 text-2xl font-semibold text-gray-800 md:text-3xl">
                Unauthenticated
              </h1>
              <p className="mt-4 text-gray-500">
                Sorry, the page you are looking for you don't have permission to
                visit this page. Please Login first.:
              </p>

              <div className="flex items-center mt-6 gap-x-3 justify-center">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center border-primary justify-center w-1/2 px-5 py-2 text-sm text-primary hover:scale-90 duration-200 transition-colors bg-white border rounded-lg gap-x-2 sm:w-auto "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5 rtl:rotate-180"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                    />
                  </svg>

                  <span>Go back</span>
                </button>

                <NavLink
                  to={`/auth/login`}
                  className="w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors  hover:scale-90 duration-200 bg-primary rounded-lg shrink-0 sm:w-auto hover:bg-primary-focus "
                >
                  Login
                </NavLink>
              </div>
            </>
          )}
        </div>

        {Object.keys(user).length > 0 ? (
          <div className="relative mt-12 lg:mt-0 flex  justify-center items-center  w-full md:w-1/2">
            <svg
              width="404"
              height="164"
              viewBox="0 0 514 164"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="101"
                cy="22"
                r="20"
                stroke="#667085"
                strokeWidth="2"
              />
              <circle
                cx="101"
                cy="142"
                r="20"
                stroke="#667085"
                strokeWidth="2"
              />
              <circle
                cx="21"
                cy="102"
                r="20"
                stroke="#667085"
                strokeWidth="2"
              />
              <circle
                cx="141"
                cy="102"
                r="20"
                stroke="#667085"
                strokeWidth="2"
              />
              <circle
                cx="193"
                cy="82"
                r="20"
                stroke="#667085"
                strokeWidth="2"
              />
              <circle
                cx="313"
                cy="82"
                r="20"
                stroke="#667085"
                strokeWidth="2"
              />
              <circle
                cx="253"
                cy="22"
                r="20"
                stroke="#667085"
                strokeWidth="2"
              />
              <circle
                cx="253"
                cy="142"
                r="20"
                stroke="#667085"
                strokeWidth="2"
              />
              <path
                d="M1 102C1 90.9543 9.9543 82 21 82H141C152.046 82 161 90.9543 161 102C161 113.046 152.046 122 141 122H21C9.9543 122 1 113.046 1 102Z"
                stroke="#667085"
                http:strokeWidth="2" //localhost:5173/auth/login
              />
              <path
                d="M101 162C89.9543 162 81 153.046 81 142L81 22C81 10.9543 89.9543 2 101 2C112.046 2 121 10.9543 121 22L121 142C121 153.046 112.046 162 101 162Z"
                stroke="#667085"
                strokeWidth="2"
              />
              <path
                d="M7.14214 115.995C-0.668351 108.184 -0.668351 95.5211 7.14214 87.7106L86.7107 8.1421C94.5212 0.331614 107.184 0.331607 114.995 8.14209C122.805 15.9526 122.805 28.6159 114.995 36.4264L35.4264 115.995C27.6159 123.805 14.9526 123.805 7.14214 115.995Z"
                stroke="#667085"
                strokeWidth="2"
              />
              <circle
                cx="453"
                cy="22"
                r="20"
                stroke="#667085"
                strokeWidth="2"
              />
              <circle
                cx="453"
                cy="142"
                r="20"
                stroke="#667085"
                strokeWidth="2"
              />
              <circle
                cx="373"
                cy="102"
                r="20"
                stroke="#667085"
                strokeWidth="2"
              />
              <circle
                cx="493"
                cy="102"
                r="20"
                stroke="#667085"
                strokeWidth="2"
              />
              <path
                d="M353 102C353 90.9543 361.954 82 373 82H493C504.046 82 513 90.9543 513 102C513 113.046 504.046 122 493 122H373C361.954 122 353 113.046 353 102Z"
                stroke="#667085"
                strokeWidth="2"
              />
              <path
                d="M453 162C441.954 162 433 153.046 433 142L433 22C433 10.9543 441.954 2 453 2C464.046 2 473 10.9543 473 22L473 142C473 153.046 464.046 162 453 162Z"
                stroke="#667085"
                strokeWidth="2"
              />
              <path
                d="M359.142 115.995C351.332 108.184 351.332 95.5211 359.142 87.7106L438.711 8.1421C446.521 0.331614 459.184 0.331607 466.995 8.14209C474.805 15.9526 474.805 28.6159 466.995 36.4264L387.426 115.995C379.616 123.805 366.953 123.805 359.142 115.995Z"
                stroke="#667085"
                strokeWidth="2"
              />
              <circle
                cx="253"
                cy="82"
                r="80"
                stroke="#667085"
                strokeWidth="2"
              />
              <circle
                cx="253"
                cy="82"
                r="40"
                stroke="#667085"
                strokeWidth="2"
              />
              <line
                x1="8.74228e-08"
                y1="1"
                x2="513"
                y2="1.00004"
                stroke="#667085"
                strokeWidth="2"
              />
              <line
                x1="-8.74228e-08"
                y1="163"
                x2="513"
                y2="163"
                stroke="#667085"
                strokeWidth="2"
              />
            </svg>
          </div>
        ) : (
          <div className="relative mt-12 lg:mt-0 flex  justify-center items-center  w-full md:w-1/2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="300"
              viewBox="0 0 48 48"
            >
              <path d="M 24 4 C 19.599415 4 16 7.599415 16 12 L 16 16 L 12.5 16 C 10.032499 16 8 18.032499 8 20.5 L 8 39.5 C 8 41.967501 10.032499 44 12.5 44 L 35.5 44 C 37.967501 44 40 41.967501 40 39.5 L 40 20.5 C 40 18.032499 37.967501 16 35.5 16 L 32 16 L 32 12 C 32 7.599415 28.400585 4 24 4 z M 24 7 C 26.779415 7 29 9.220585 29 12 L 29 16 L 19 16 L 19 12 C 19 9.220585 21.220585 7 24 7 z M 12.5 19 L 35.5 19 C 36.346499 19 37 19.653501 37 20.5 L 37 39.5 C 37 40.346499 36.346499 41 35.5 41 L 12.5 41 C 11.653501 41 11 40.346499 11 39.5 L 11 20.5 C 11 19.653501 11.653501 19 12.5 19 z M 24 27 A 3 3 0 0 0 24 33 A 3 3 0 0 0 24 27 z"></path>
            </svg>
          </div>
        )}
      </div>
    </section>
  );
}
