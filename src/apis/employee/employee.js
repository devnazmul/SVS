// ===========================================
// #00131
// ===========================================
import axios from "axios";
import { saveAs } from "file-saver";
// GET APIS =====================================================
export const getAllUsers = async ({
  perPage = 5,
  page = 1,
  start_date = "",
  end_date = "",
  search_key = "",
  order_by = "DESC",
  role = "",
  is_in_employee = 1,
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
      `/v3.0/users?page=${page}&per_page=${perPage}&is_in_employee=${is_in_employee}&role=${encodeURIComponent(
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

export const allEmployees = async ({
  perPage = 20,
  page = 1,
  start_date = "",
  end_date = "",
  search_key = "",
  order_by = "DESC",
  is_in_employee = "",
  role = "",

  is_active = "",
  response_type = "",
  file_name = "",
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
      )}&order_by=${order_by}&is_active=${is_active}&start_date=${start_date}&end_date=${end_date}&search_key=${search_key}&response_type=${response_type}&doesnt_have_payrun=${doesnt_have_payrun}&department_id=${department_id}&project_id=${project_id}&visa_expires_in_day=${visa_expires_in_day}&end_visa_expiry_date=${end_visa_expiry_date}&start_visa_expiry_date=${start_visa_expiry_date}&end_visa_issue_date=${end_visa_issue_date}&end_passport_expiry_date=${end_passport_expiry_date}&start_passport_expiry_date=${start_passport_expiry_date}&end_sponsorship_expiry_date=${end_sponsorship_expiry_date}&start_sponsorship_expiry_date=${start_sponsorship_expiry_date}&end_sponsorship_date_assigned=${end_sponsorship_date_assigned}&start_sponsorship_date_assigned=${start_sponsorship_date_assigned}&start_joining_date=${start_joining_date}&sponsorship_current_certificate_status=${sponsorship_current_certificate_status}&sponsorship_certificate_number=${sponsorship_certificate_number}&sponsorship_status=${sponsorship_status}&immigration_status${immigration_status}&employment_status_id=${employment_status_id}&has_this_project=${has_this_project}&work_location_id=${work_location_id}&designation_id=${designation_id}&is_in_employee=${is_in_employee}&file_name=${file_name}`,
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
      )}&order_by=${order_by}&is_active=${is_active}&start_date=${start_date}&end_date=${end_date}&search_key=${search_key}&response_type=${response_type}&doesnt_have_payrun=${doesnt_have_payrun}&department_id=${department_id}&project_id=${project_id}&visa_expires_in_day=${visa_expires_in_day}&end_visa_expiry_date=${end_visa_expiry_date}&start_visa_expiry_date=${start_visa_expiry_date}&end_visa_issue_date=${end_visa_issue_date}&end_passport_expiry_date=${end_passport_expiry_date}&start_passport_expiry_date=${start_passport_expiry_date}&end_sponsorship_expiry_date=${end_sponsorship_expiry_date}&start_sponsorship_expiry_date=${start_sponsorship_expiry_date}&end_sponsorship_date_assigned=${end_sponsorship_date_assigned}&start_sponsorship_date_assigned=${start_sponsorship_date_assigned}&start_joining_date=${start_joining_date}&sponsorship_current_certificate_status=${sponsorship_current_certificate_status}&sponsorship_certificate_number=${sponsorship_certificate_number}&sponsorship_status=${sponsorship_status}&immigration_status${immigration_status}&employment_status_id=${employment_status_id}&has_this_project=${has_this_project}&work_location_id=${work_location_id}&designation_id=${designation_id}&is_in_employee=${is_in_employee}&file_name=${file_name}`,
      config
    )
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

export const exportAllEmployeesURLUtil = ({
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

  const allRoles = Array.isArray(role) ? role.join(",") : role;

  return {
    url: `${
      import.meta.env.VITE_BASE_URL
    }/v1.0/users?page=${page}&per_page=${perPage}&role=${encodeURIComponent(
      allRoles
    )}&order_by=${order_by}&is_active=${is_active}&start_date=${start_date}&end_date=${end_date}&search_key=${search_key}&response_type=${response_type}&doesnt_have_payrun=${doesnt_have_payrun}&department_id=${department_id}&project_id=${project_id}&visa_expires_in_day=${visa_expires_in_day}&end_visa_expiry_date=${end_visa_expiry_date}&start_visa_expiry_date=${start_visa_expiry_date}&end_visa_issue_date=${end_visa_issue_date}&end_passport_expiry_date=${end_passport_expiry_date}&start_passport_expiry_date=${start_passport_expiry_date}&end_sponsorship_expiry_date=${end_sponsorship_expiry_date}&start_sponsorship_expiry_date=${start_sponsorship_expiry_date}&end_sponsorship_date_assigned=${end_sponsorship_date_assigned}&start_sponsorship_date_assigned=${start_sponsorship_date_assigned}&start_joining_date=${start_joining_date}&sponsorship_current_certificate_status=${sponsorship_current_certificate_status}&sponsorship_certificate_number=${sponsorship_certificate_number}&sponsorship_status=${sponsorship_status}&immigration_status${immigration_status}&employment_status_id=${employment_status_id}&has_this_project=${has_this_project}&work_location_id=${work_location_id}&designation_id=${designation_id}&is_in_employee=${is_in_employee}&file_name=${file_name}`,
    jwt: `Bearer ${jwt}`,
  };
};

export const getAllUserSocialMedia = async ({
  user_id = "",
  perPage = 5,
  page = 1,
  start_date = "",
  end_date = "",
  search_key = "",
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
      `/v1.0/user-social-sites?page=${page}&per_page=${perPage}&order_by=${order_by}&start_date=${start_date}&end_date=${end_date}&search_key=${search_key}&user_id=${user_id}`,
      config
    )
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
export const getSingleUserSocialMedia = async (id) => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  return await axios
    .get(`/v1.0/user-social-sites/${id}`, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
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
export const getSingleEmployee = async (id) => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  return await axios
    .get(`/v2.0/users/${id}`, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
export const getEmployeeActivityLog = async ({
  // IF NOT PASS user_id THEN GIVE OWN DATA
  page = 1,
  perPage = 5,
  start_date = "",
  end_date = "",
  search_key = "",
  order_by = "DESC",
  user_id = "",
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
      `/v1.0/users/get/user-activity?page=${page}&per_page=${perPage}&start_date=${start_date}&end_date=${end_date}&search_key=${search_key}&order_by=${order_by}&user_id=${user_id}`,
      config
    )
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
// POST APIS =====================================================
export const createEmployee = async (data) => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  return await axios
    .post(`/v2.0/users`, data, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
export const createUserSocialLink = async (data) => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  return await axios
    .post(`/v1.0/user-social-sites`, data, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

export const uploadEmployeeProfile = async (data) => {
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

// PUT APIS =====================================================
export const updateEmployee = async (data) => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  return await axios
    .put(`/v2.0/users`, data, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
export const updateEmployeeContact = async (data) => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  return await axios
    .put(`/v1.0/users/update-emergency-contact`, data, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
export const updateEmployeeAddress = async (data) => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  return await axios
    .put(`/v1.0/users/update-address`, data, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
export const updateUserSocialLink = async (data) => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  return await axios
    .put(`/v1.0/user-social-sites`, data, config)
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
