import axios from "axios";

export const getAllAddressHistoriesWithoutPerPageByEmployee = async (id) => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };

  return await axios
    .get(`/v1.0/histories/user-address-details?user_id=${id}`, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

export const getAllAddressHistoriesWithoutPerPageByEmployee2 = async ({
  user_id = "",
  start_date = "",
  end_date = "",
}) => {
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
      `/v1.0/histories/user-address-details?user_id=${user_id}&start_date=${start_date}&end_date=${end_date}`,
      config
    )
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
