import axios from "axios";

// GET APIS =====================================================
export const getAllRecruitmentProcessesWithoutPerPage = async () => {
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
    .get(`/v1.0/recruitment-processes`, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
export const getAllRecruitmentProcessesWithoutPerPageForOrg = async () => {
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
    .get(`/v1.0/recruitment-processes`, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
export const getAllRecruitmentProcesses = async ({
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
      `/v1.0/recruitment-processes?page=${page}&per_page=${perPage}&start_date=${start_date}&end_date=${end_date}&search_key=${search_key}&order_by=${order_by}`,
      config
    )
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
export const getSingleRecruitmentProcess = async (id) => {
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
    .get(`/v1.0/recruitment-processes/${id}`, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
// POST APIS =====================================================
export const createRecruitmentProcess = async (data) => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  return await axios
    .post(`/v1.0/recruitment-processes`, data, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
// PUT APIS =====================================================
// export const toggleRecruitmentActiveDeactive = async (id) => {
//   const jwt = localStorage.getItem("token");

//   const config = {
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json",
//       Authorization: `Bearer ${jwt}`,
//     },
//   };

//   return await axios
//     .put(
//       `/v1.0/businesses/toggle-active`,
//       {
//         id: id,
//       },
//       config
//     )
//     .then((res) => {
//       return res.data;
//     })
//     .catch((err) => {
//       throw err;
//     });
// };
export const updateSingleRecruitmentProcess = async (data) => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  return await axios
    .put(`/v1.0/recruitment-processes`, data, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
// DELETE APIS =====================================================
export const deleteRecruitmentProcess = async (ids) => {
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
    .delete(`/v1.0/recruitment-processes/${allIds}`, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
