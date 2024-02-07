import axios from "axios";

// GET APIS =====================================================
export const getAllCourseTitleWithoutPerPagePublic = async ({
  business_id = "",
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
    .get(`/v1.0/client/course-titles?business_id=${business_id}`, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
export const getAllCourseTitleWithoutPerPage = async () => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };

  return await axios
    .get(`/v1.0/course-titles`, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
export const getAllCourseTitle = async ({
  perPage = 10,
  page = 1,
  start_date = "",
  end_date = "",
  search_key = "",
  order_by = "DESC",
}) => {
  // GET EMPLPYEE BY ID
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
      `/v1.0/course-titles?page=${page}&per_page=${perPage}&start_date=${start_date}&end_date=${end_date}&search_key=${search_key}&order_by=${order_by}`,
      config
    )
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
export const getSingleCourseTitle = async (id) => {
  // GET EMPLPYEE BY ID
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };

  return await axios
    .get(`/v1.0/course-titles/${id}`, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
// POST APIS =====================================================
export const createCourseTitle = async (data) => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  return await axios
    .post(`/v1.0/course-titles`, data, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
// PUT APIS =====================================================
export const updateSingleCourseTitle = async (data) => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  return await axios
    .post(`/v1.0/course-titles-update`, data, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
export const toggleCourseTitleActiveDeactive = async (id) => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  return await axios
    .post(`/v1.0/course-titles/toggle-active`, { id: id }, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
// DELETE APIS =====================================================
export const deleteCourseTitle = async (ids) => {
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
    .post(`/v1.0/course-titles/${allIds}`, {}, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
