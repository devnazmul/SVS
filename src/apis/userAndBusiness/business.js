import axios from "axios";
// GET APIS  =======================================================
export const getSingleBusiness = async (id) => {
  const jwt = localStorage.getItem("token");

  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };

  return await axios
    .get(`/v1.0/businesses/${id}`, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

// PUT APIS ========================================================
export const toggleBusinessActiveDeactive = async (id) => {
  const jwt = localStorage.getItem("token");

  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };

  return await axios
    .put(
      `/v1.0/businesses/toggle-active`,
      {
        id: id,
      },
      config
    )
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
export const uploadBusinessImage = async (data) => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  const formData = new FormData();
  formData.append("image", data);

  return await axios
    .post(`/v1.0/business-image`, formData, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
// DELETE APIS =====================================================
export const deleteMultipleBusiness = async (ids) => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
      //   password: pin,
    },
  };

  const allIds = Array.isArray(ids) ? ids.join(",") : ids;

  return await axios
    .delete(`/v1.0/businesses/${allIds}`, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
