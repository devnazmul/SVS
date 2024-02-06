import axios from "axios";

// GET APIS =====================================================
export const getLeaveSetting = async () => {
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
    .get(`/v1.0/setting-leave`, config)
    .then((res) => {
      return res.data?.length > 0 ? res.data[0] : {};
    })
    .catch((err) => {
      throw err;
    });
};

// POST APIS =====================================================
export const updateLeaveSetting = async (data) => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  return await axios
    .post(`/v1.0/setting-leave`, data, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
