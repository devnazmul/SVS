import axios from "axios";

// GET APIS =====================================================
export const getAllPermissions = async () => {
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
    .get(`/v1.0/initial-permissions`, config)
    .then((res) => {
      console.log({ res });
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
