// ===========================================
// #00123
// ===========================================

import axios from "axios";
import { getQueryFromArrayOfObject } from "../../utils/searchQuery";

// GET APIS =====================================================
export const getAllClients = async ({
  perPage = 5,
  pageNo = 1,
  start_date = "",
  end_date = "",
  search_key = "",

  order_by = "DESC",
  properties = [],
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
      `/v1.0/clients/${perPage}?page=${pageNo}&order_by=${order_by}&start_date=${start_date}&end_date=${end_date}&search_key=${search_key}${getQueryFromArrayOfObject(
        properties,
        "property_ids[]"
      )}`,

      config
    )
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

// export const getAllLandlordsWithoutPagination = async ({

//   perPage = 100000000000000,
//   pageNo = 1,
//   start_date = "",
//   end_date = "",
//   search_key = "",

//   order_by = "DESC",
//   total_due = "",
//   total_over_due = "",
//   properties = [],
// }) => {
//   // GET DISH BY ID
//   const jwt = localStorage.getItem("token");
//   const config = {
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json",
//       Authorization: `Bearer ${jwt}`,
//     },
//   };

//   return await axios
//     .get(
//       `/v1.0/landlords/100000000000000?page=${pageNo}&order_by=${order_by}&start_date=${start_date}&end_date=${end_date}&search_key=${search_key}&total_due=${total_due}&total_over_due=${total_over_due}${getQueryFromArrayOfObject(
//         properties,
//         "property_ids[]"
//       )}`,

//       config
//     )
//     .then((res) => {
//       return res.data;
//     })
//     .catch((err) => {
//       throw err;
//     });
// };

export const getSingleClient = async (id) => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  return await axios
    .get(`/v1.0/clients/get/single/${id}`, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
// POST APIS =====================================================
export const createClient = async (data) => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  return await axios
    .post(`/v1.0/clients`, data, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

// PUT APIS =====================================================
export const updateSingleClient = async (data) => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  return await axios
    .put(`/v1.0/clients`, data, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

// DELETE APIS =====================================================
export const deleteSingleClient = async (id, pin) => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
      pin: pin,
    },
  };
  return await axios
    .delete(`/v1.0/clients/${id}`, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
