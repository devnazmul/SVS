import axios from "axios";

//GET ALL NOTIFICATION
export const getAllPayrun = async () => {
     // GET DISH BY ID
     const jwt = localStorage.getItem("token");
     const config = {
          headers: {
               "Content-Type": "application/json",
               Accept: "application/json",
               Authorization: `Bearer ${jwt}`,
          },
     };

     return await axios
          .get(
               `/v1.0/payruns`,
               config
          )
          .then((res) => {
               return res.data;
          })
          .catch((err) => {
               throw err;
          });
};
