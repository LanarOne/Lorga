import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUser } from "../../Helpers/usersHelper";
import {
  GET_ADMIN_COLLECTIF_BY_USER_ID,
  GET_ART_COL_BY_ARTISTE_ID,
  GET_ARTISTE_BY_USERID,
  GET_COL_BY_ID,
} from "../../constants/constants";
import { getRequest } from "../../api/api";

export const fetchUser = createAsyncThunk(
  "user/getUser",
  async ({ token }, thunkAPI) => {
    // if (!token) {
    //   thunkAPI.dispatch(setUserId(null));
    //   thunkAPI.dispatch(setUsername(null));
    //   thunkAPI.dispatch(setRoleId(null));
    // }
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
        }
      })
      .addCase(fetchUser.rejected, (state, action) => {
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
