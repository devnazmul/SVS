// ===========================================
// #00124
// ===========================================

import axios from "axios";

// GET APIS =====================================================
export const getUserByToken = async () => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  return await axios
    .get(`/v1.0/user`, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

// POST APIS =====================================================
export const login = async (data) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  return await axios
    .post(`/v1.0/login`, data, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
export const logout = async () => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };

  return await axios
    .post(`/v1.0/logout`, "string", config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

export const forgotpassword = async (data) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  return await axios
    .post(`/forgetpassword`, data, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

export const resetPasswordWithToken = async (token, data) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  return await axios
    .patch(`/forgetpassword/reset/${token}`, data, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

export const checkIsEmailExistOrNot = async (data) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  return await axios
    .post(`/auth/check/email`, data, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

export const updateProfile = async (data) => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  return await axios
    .put(`/v1.0/update-user-info`, data, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
// PATCH APIS =====================================================
export const changePassword = async (data) => {
  const jwt = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  return await axios
    .patch(`/auth/changepassword`, data, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
