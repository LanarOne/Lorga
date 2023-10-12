import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUser } from "../../Helpers/usersHelper";
import {
  CONFIRM_USER,
  GET_ADMIN_COLLECTIF_BY_USER_ID,
  GET_ART_COL_BY_ARTISTE_ID,
  GET_ARTISTE_BY_USERID,
  GET_COL_BY_ID,
  GET_USER_BY_ID,
  PUT_USER,
} from "../../constants/constants";
import { getRequest, putRequest } from "../../api/api";

export const getUserByID = createAsyncThunk(
  "user/getbyID",
  async ({ userId, token }, thunkAPI) => {
    let status;
    let error;
    try {
      let url = `${GET_USER_BY_ID}${userId}`;
      const response = await getRequest(url, token);
      status = response.status;
      error = response.error;
      if (status <= 201) {
        let { data } = response.result;
        return thunkAPI.fulfillWithValue({ data, status });
      }
      if (status >= 400) {
        return thunkAPI.rejectWithValue({ error, status });
      }
    } catch (e) {
      throw e;
    }
  }
);
export const isUserArtiste = createAsyncThunk(
  "user/isArtiste",
  async ({ userId, token }, thunkAPI) => {
    let error;
    let status;
    try {
      const url = `${GET_ARTISTE_BY_USERID}${userId}`;
      const response = await getRequest(url, token);
      status = response.status;
      error = response.error;
      if (status >= 400) {
        return thunkAPI.rejectWithValue({ error, status });
      }
      if (status <= 200) {
        let { data } = response.result;
        return thunkAPI.fulfillWithValue({ data, status });
      }
    } catch (e) {
      throw e;
    }
  }
);
export const isAdminCol = createAsyncThunk(
  "user/isAdminCol",
  async ({ userId, token }, thunkAPI) => {
    let error;
    let status;
    try {
      const url = `${GET_ADMIN_COLLECTIF_BY_USER_ID}${userId}`;
      const response = await getRequest(url, token);
      status = response.status;
      error = response.error;
      if (status <= 201) {
        let { data } = response.result;
        let { message } = response.result;
        return thunkAPI.fulfillWithValue({ data, message, status });
      }
      if (status >= 400) {
        let { message } = error;
        return thunkAPI.rejectWithValue({ message, status });
      }
    } catch (e) {
      throw e;
    }
  }
);

export const isArtisteAdmin = createAsyncThunk(
  "user/isArtisteAdmin",
  async ({ artisteId, token }, thunkAPI) => {
    let status;
    let error;
    try {
      const url = `${GET_ART_COL_BY_ARTISTE_ID}${artisteId}`;
      const response = await getRequest(url, token);
      console.log(response);
      status = response.status;
      error = response.error;
      if (status <= 201) {
        let { data } = response.result;
        return thunkAPI.fulfillWithValue({ data, status });
      }
      if (status >= 400) {
        let { message } = error;
        return thunkAPI.rejectWithValue({ message, status });
      }
    } catch (e) {
      throw e;
    }
  }
);
export const fetchUser = createAsyncThunk(
  "user/getUser",
  async ({ token }, thunkAPI) => {
    let error;
    let status;
    let url;
    try {
      const user = await getUser(token);
      thunkAPI.dispatch(setUserId(user.id));
      thunkAPI.dispatch(setUsername(user.username));
      thunkAPI.dispatch(setRoleId(user.roleId));
      url = `${GET_ARTISTE_BY_USERID}${user.id}`;
      const response = await getRequest(url, token);
      status = response.status;
      error = response.error;

      if (status <= 201) {
        const artiste = response.result.data;
        thunkAPI.dispatch(setArtisteId(artiste.id));
        thunkAPI.dispatch(setArtisteName(artiste.nom));
        url = `${GET_ART_COL_BY_ARTISTE_ID}${artiste.id}`;
        const responseCol = await getRequest(url, token);
        status = responseCol.status;
        if (status <= 201) {
          const collectifs = responseCol.result.data;
          collectifs.map(async (collectif) => {
            url = `${GET_COL_BY_ID}${collectif.collectifId}`;
            const response = await getRequest(url, token);
            thunkAPI.dispatch(
              addCollectif({
                id: collectif.collectifId,
                nom: response.result.data.nom,
              })
            );
          });
        }
        if (status === 404) {
          try {
            url = `${GET_ADMIN_COLLECTIF_BY_USER_ID}${user.id}`;
            const response = await getRequest(url, token);
            status = response.status;
            if (status <= 201) {
              const collectifs = response.result.data;
              collectifs.map(async (collectif) => {
                url = `${GET_COL_BY_ID}${collectif.collectifId}`;
                const response = await getRequest(url, token);
                thunkAPI.dispatch(
                  addCollectif({
                    id: collectif.collectifId,
                    nom: response.result.data.nom,
                  })
                );
              });
            }
            if (status >= 400) {
              let { message } = response.error;
              return thunkAPI.rejectWithValue({ message, status });
            }
          } catch (e) {
            throw e;
          }
        }
        if (status >= 400) {
          let { message } = response.error;
          return thunkAPI.rejectWithValue({ message, status });
        }
      }

      if (status >= 400) {
        if (status === 404) {
          try {
            url = `${GET_ADMIN_COLLECTIF_BY_USER_ID}${user.id}`;
            const response = await getRequest(url, token);
            status = response.status;
            if (status <= 201) {
              const collectifs = response.result.data;
              collectifs.map(async (collectif) => {
                url = `${GET_COL_BY_ID}${collectif.collectifId}`;
                const response = await getRequest(url, token);
                thunkAPI.dispatch(
                  addCollectif({
                    id: collectif.collectifId,
                    nom: response.result.data.nom,
                  })
                );
              });
            }

            if (status >= 400) {
              if (status === 404) {
                return;
              }
              let { message } = response.error;
              return thunkAPI.rejectWithValue({ message, status });
            }
          } catch (e) {
            throw e;
          }
        }
        return thunkAPI.rejectWithValue({ error, status });
      }
    } catch (e) {
      throw e;
    }
  }
);

export const updateRoleId = createAsyncThunk(
  "user/updateRoleID",
  async ({ userId, body, token }, thunkAPI) => {
    let error;
    let status;
    try {
      let url = `${PUT_USER}${userId}`;
      const response = await putRequest(url, body, token);
      status = response.status;
      error = response.error;
      if (status === 200) {
        let { data } = response.result;
        let { message } = response.result;
        return thunkAPI.fulfillWithValue({ data, message, status });
      }
      if (status >= 400) {
        let { message } = error;
        return thunkAPI.rejectWithValue({ message, status });
      }
    } catch (e) {
      throw e;
    }
  }
);

export const emailConfirmation = createAsyncThunk(
  "user/emailconfirmation",
  async ({ confirmationToken }, thunkAPI) => {
    let error;
    let status;
    try {
      let body = {};
      const url = `${CONFIRM_USER}${confirmationToken}`;
      const response = await putRequest(url, body);
      console.log(response);
      status = response.status;
      error = response.error;
      if (status === 200) {
        return thunkAPI.fulfillWithValue(response);
      }
      if (status >= 400 || error) {
        return thunkAPI.rejectWithValue({ error, status });
      }
    } catch (e) {
      throw e;
    }
  }
);
export const userSlice = createSlice({
  name: "user",
  initialState: {
    userId: null,
    username: "",
    roleId: null,
    artisteId: null,
    artisteName: "",
    collectifs: [],
    loadingUser: false,
    errorUser: null,
  },
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setRoleId: (state, action) => {
      state.roleId = action.payload;
    },
    setArtisteId: (state, action) => {
      state.artisteId = action.payload || null;
    },
    setArtisteName: (state, action) => {
      state.artisteName = action.payload || null;
    },
    addCollectif: (state, action) => {
      const { id, nom } = action.payload;
      const existingEntries = state.collectifs.some(
        (collectif) => collectif.id === id
      );
      if (!existingEntries) {
        state.collectifs.push({ id, nom });
      }
    },
    clearUser: (state) => {
      state.userId = null;
      state.username = "";
      state.artisteId = null;
      state.artisteName = "";
      state.collectifs = [];
      state.loadingUser = false;
      state.errorUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        if (!state.loadingUser) {
          state.loadingUser = true;
        }
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        if (state.loadingUser) {
          state.loadingUser = false;
          state.data = action.payload;
        }
      })
      .addCase(fetchUser.rejected, (state, action) => {
        if (state.loadingUser) {
          state.loadingUser = false;
          state.errorUser = action.payload;
        }
      });
    builder
      .addCase(getUserByID.pending, (state) => {
        if (!state.loadingUser) {
          state.loadingUser = true;
        }
      })
      .addCase(getUserByID.fulfilled, (state, action) => {
        if (state.loadingUser) {
          state.loadingUser = false;
          state.data = action.payload;
        }
      })
      .addCase(getUserByID.rejected, (state, action) => {
        if (state.loadingUser) {
          state.loadingUser = false;
          state.errorUser = action.payload;
        }
      });
    builder
      .addCase(isUserArtiste.pending, (state) => {
        if (!state.loadingUser) {
          state.loadingUser = true;
        }
      })
      .addCase(isUserArtiste.fulfilled, (state, action) => {
        if (state.loadingUser) {
          state.loadingUser = false;
          state.data = action.payload;
        }
      })
      .addCase(isUserArtiste.rejected, (state, action) => {
        if (state.loadingUser) {
          state.loadingUser = false;
          state.errorUser = action.payload;
        }
      });
    builder
      .addCase(isArtisteAdmin.pending, (state) => {
        if (!state.loadingUser) {
          state.loadingUser = true;
        }
      })
      .addCase(isArtisteAdmin.fulfilled, (state, action) => {
        if (state.loadingUser) {
          state.loadingUser = false;
          state.data = action.payload;
        }
      })
      .addCase(isArtisteAdmin.rejected, (state, action) => {
        if (state.loadingUser) {
          state.loadingUser = false;
          state.errorUser = action.payload;
        }
      });
    builder
      .addCase(isAdminCol.pending, (state) => {
        if (!state.loadingUser) {
          state.loadingUser = true;
        }
      })
      .addCase(isAdminCol.fulfilled, (state, action) => {
        if (state.loadingUser) {
          state.loadingUser = false;
          state.data = action.payload;
        }
      })
      .addCase(isAdminCol.rejected, (state, action) => {
        if (state.loadingUser) {
          state.loadingUser = false;
          state.errorUser = action.payload;
        }
      });
  },
});
export const {
  setUserId,
  setUsername,
  setRoleId,
  setArtisteId,
  setArtisteName,
  addCollectif,
  clearUser,
} = userSlice.actions;

export default userSlice.reducer;
