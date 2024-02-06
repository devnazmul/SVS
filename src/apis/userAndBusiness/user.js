// ===========================================
// #00131
// ===========================================
import axios from "axios";

// GET APIS =====================================================
// V1 is for superadmin
// V3 is for business
export const getEmployeeId = async () => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  return await axios
    .get(`/v1.0/users/generate/employee-id`, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
export const checkEmployeeId = async (id) => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };

  return await axios
    .get(`/v1.0/users/validate/employee-id/${id}`, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
export const getAllUsersWithoutPaginationByRole = async (role) => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  const allRoles = Array.isArray(role) ? role.join(",") : role;
  return await axios
    .get(`/v1.0/users?role=${encodeURIComponent(allRoles)}`, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
export const getAllUsersWIthoutPagination = async () => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };

  return await axios
    .get(`/v1.0/users`, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
export const getAllUsersWIthoutPaginationV2 = async () => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };

  return await axios
    .get(`/v2.0/users`, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
export const getAllUsers = async ({
  perPage = 5,
  page = 1,
  start_date = "",
  end_date = "",
  search_key = "",
  order_by = "DESC",
  role = "",
  is_active = "",
}) => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  const allRoles = Array.isArray(role) ? role.join(",") : role;
  return await axios
    .get(
      `/v1.0/users?page=${page}&per_page=${perPage}&role=${encodeURIComponent(
        allRoles
      )}&order_by=${order_by}&is_active=${is_active}&start_date=${start_date}&end_date=${end_date}&search_key=${search_key}`,
      config
    )
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
export const exportAllEmployees = async ({
  perPage = 5,
  page = 1,
  start_date = "",
  end_date = "",
  search_key = "",
  order_by = "DESC",
  role = "",
  is_active = "",
  response_type = "",
  file_name = "",
  is_in_employee = "",
  designation_id = "",
  work_location_id = "",
  has_this_project = "",
  employment_status_id = "",
  immigration_status = "",
  sponsorship_status = "",
  sponsorship_certificate_number = "",
  sponsorship_current_certificate_status = "",
  start_joining_date = "",
  start_sponsorship_date_assigned = "",
  end_sponsorship_date_assigned = "",
  start_sponsorship_expiry_date = "",
  end_sponsorship_expiry_date = "",

  start_passport_expiry_date = "",
  end_passport_expiry_date = "",

  end_visa_issue_date = "",
  start_visa_expiry_date = "",
  end_visa_expiry_date = "",
  visa_expires_in_day = "",
  project_id = "",
  department_id = "",
  doesnt_have_payrun = "",
}) => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  const allRoles = Array.isArray(role) ? role.join(",") : role;
  return await axios
    .get(
      `/v1.0/users?page=${page}&per_page=${perPage}&role=${encodeURIComponent(
        allRoles
      )}&order_by=${order_by}&is_active=${is_active}&start_date=${start_date}&end_date=${end_date}&search_key=${search_key}&response_type=${response_type}&doesnt_have_payrun=${doesnt_have_payrun}&department_id=${department_id}&project_id=${project_id}&visa_expires_in_day=${visa_expires_in_day}&end_visa_expiry_date=${end_visa_expiry_date}&start_visa_expiry_date=${start_visa_expiry_date}7end_visa_issue_date=${end_visa_issue_date}&end_passport_expiry_date=${end_passport_expiry_date}&start_passport_expiry_date=${start_passport_expiry_date}&end_sponsorship_expiry_date=${end_sponsorship_expiry_date}&start_sponsorship_expiry_date=${start_sponsorship_expiry_date}&end_sponsorship_date_assigned=${end_sponsorship_date_assigned}&start_sponsorship_date_assigned=${start_sponsorship_date_assigned}&start_joining_date=${start_joining_date}&sponsorship_current_certificate_status=${sponsorship_current_certificate_status}&sponsorship_certificate_number=${sponsorship_certificate_number}&sponsorship_status=${sponsorship_status}&immigration_status${immigration_status}&employment_status_id=${employment_status_id}&has_this_project=${has_this_project}&work_location_id=${work_location_id}&designation_id=${designation_id}&is_in_employee=${is_in_employee}&file_name=${file_name}`,
      config
    )
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
export const getAllUsersWithoutPaginationByRole3 = async (role) => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  const allRoles = Array.isArray(role) ? role.join(",") : role;
  return await axios
    .get(`/v3.0/users?role=${encodeURIComponent(allRoles)}`, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
export const getAllUsersWIthoutPagination3 = async () => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };

  return await axios
    .get(`/v3.0/users`, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
export const getAllUsersWIthoutPaginationV3 = async () => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };

  return await axios
    .get(`/v3.0/users`, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
export const getAllUsers3 = async ({
  perPage = 5,
  page = 1,
  start_date = "",
  end_date = "",
  search_key = "",
  order_by = "DESC",
  role = "",
  is_active = "",
}) => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  const allRoles = Array.isArray(role) ? role.join(",") : role;
  return await axios
    .get(
      `/v3.0/users?page=${page}&per_page=${perPage}&role=${encodeURIComponent(
        allRoles
      )}&order_by=${order_by}&is_active=${is_active}&start_date=${start_date}&end_date=${end_date}&search_key=${search_key}`,
      config
    )
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

export const getSingleUsers = async (id) => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  return await axios
    .get(`/v1.0/users/${id}`, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
export const getAllBusiness = async ({
  start_date = "",
  end_date = "",
  search_key = "",
  country_code = "",
  address = "",
  city = "",
  start_lat = "",
  end_lat = "",
  start_long = "",
  end_long = "",
  page = 10,
  perPage = 1,
  order_by = "DESC",
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
      `/v1.0/businesses?page=${page}&per_page=${perPage}&search_key=${search_key}&start_date=${start_date}&end_date=${end_date}&country_code=${country_code}&address=${address}&city=${city}&start_lat=${start_lat}&end_lat=${end_lat}&start_long=${start_long}&end_long=${end_long}&order_by=${order_by}`,
      config
    )
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
export const getUserWithBusiness = async () => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  return await axios
    .get(`/v1.0/user-with-business`, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
export const getUsersLeaveDetails = async (id) => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  return await axios
    .get(`/v1.0/users/get-leave-details/${id}`, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
// POST APIS =====================================================
export const createUserWithBusiness = async (data) => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };

  return await axios
    .post(`/v1.0/auth/register-with-business`, data, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
export const createUser = async (data) => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  return await axios
    .post(`/v1.0/users`, data, config)
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
export const uploadUserProfile = async (data) => {
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
    .post(`/v1.0/user-image`, formData, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
export const uploadUserSingleFile = async (data) => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  const formData = new FormData();
  formData.append("file", data);

  return await axios
    .post(`/v1.0/users/single-file-upload`, formData, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

// PUT APIS =====================================================
export const updateSingleUser = async (data) => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  return await axios
    .put(`/v1.0/users`, data, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
export const toggleActivationOfUser = async (id) => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  return await axios
    .put(`/v1.0/users/toggle-active`, { id }, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
export const updateSingleUserWithBusiness = async (data) => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  return await axios
    .put(`/v1.0/businesses`, data, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
// PUT APIS ========================================================
export const toggleEmployeeActiveDeactive = async (id) => {
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
      `/v1.0/users/toggle-active`,
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
// DELETE APIS =====================================================
export const deleteSingleUser = async (ids) => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
      // password: pin,
    },
  };
  const allIds = Array.isArray(ids) ? ids.join(",") : ids;
  return await axios
    .delete(`/v1.0/users/${allIds}`, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
