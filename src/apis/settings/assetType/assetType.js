import axios from "axios";

// GET APIS =====================================================
export const getAllAssetTypesWithoutPerPage = async () => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };

  return await axios
    .get(`/v1.0/asset-types`, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
export const getAllAssetTypes = async ({
  perPage = 10,
  page = 1,
  start_date = "",
  end_date = "",
  search_key = "",
  order_by = "DESC",
}) => {
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
      `/v1.0/asset-types?page=${page}&per_page=${perPage}&start_date=${start_date}&end_date=${end_date}&search_key=${search_key}&order_by=${order_by}`,
      config
    )
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
export const getSingleAssetType = async (id) => {
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
    .get(`/v1.0/asset-types/${id}`, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
// POST APIS =====================================================
export const createAssetType = async (data) => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  return await axios
    .post(`/v1.0/asset-types`, data, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
// PUT APIS =====================================================
export const toggleAssetTypeActiveDeactive = async (id) => {
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
      `/v1.0/designations/toggle-active`,
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
export const updateSingleAssetType = async (data) => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  return await axios
    .put(`/v1.0/asset-types`, data, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

// DELETE APIS =====================================================
export const deleteAssetType = async (ids) => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
      //   pin: pin,
    },
  };
  const allIds = Array.isArray(ids) ? ids.join(",") : ids;
  return await axios
    .delete(`/v1.0/asset-types/${allIds}`, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
