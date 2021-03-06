import { createStore } from "vuex";
import { darkModeKey } from "@/config.js";
import createPersistedState from "vuex-persistedstate";
import services from "../services/service";
import SecureLS from "secure-ls";
var ls = new SecureLS({ isCompression: false });

export default createStore({
  state: {
    user: null,
    isFullScreen: false,
    isAsideMobileExpanded: false,
    isAsideLgActive: false,
    darkMode: false,
    isFieldFocusRegistered: false,
    clients: [],
    history: [],
    customers:[]
  },
  getters: {
    _isAuthenticated: (state) => state.user !== null,
    _getCurrentUser(state) {
      const user = state.user;
      delete user?.password;
      return user;
    },
    _getCurrentUserId(state) {
	const user = state.user;
	return user.id;
   },
    _customers(state) {
	const customers = state.customers;
	customers.map(customer=>{
		delete customer?.transactions;
		delete customer?.email;
		delete customer?.iban
	})
	
	 return customers || []}
  },
  mutations: {
    /* A fit-them-all commit */
    basic(state, payload) {
      state[payload.key] = payload.value;
    },

    setUser(state, user) {
      state.user = user;
    },
    setCustomers(state, customers) {
	state.customers = customers;
   },
    logoutUser(state) {
      state.user = null;
    },
    setLikes(state, bookmarkIds) {
      state.user.likes = bookmarkIds;
    },
    setBookmarks(state, bookmarkIds) {
      state.user.bookmarks = bookmarkIds;
    },
  },
  actions: {
    getAllCustomers() {
      return services.fetchCustomers();
    },
    asideMobileToggle({ commit, state }, payload = null) {
      const isShow = payload !== null ? payload : !state.isAsideMobileExpanded;

      document.getElementById("app").classList[isShow ? "add" : "remove"]("ml-60", "lg:ml-0");

      document.documentElement.classList[isShow ? "add" : "remove"]("m-clipped");

      commit("basic", {
        key: "isAsideMobileExpanded",
        value: isShow,
      });
    },

    asideLgToggle({ commit, state }, payload = null) {
      commit("basic", { key: "isAsideLgActive", value: payload !== null ? payload : !state.isAsideLgActive });
    },

    fullScreenToggle({ commit, state }, value) {
      commit("basic", { key: "isFullScreen", value });

      document.documentElement.classList[value ? "add" : "remove"]("full-screen");
    },

    SetThemeMode({ commit, state }) {
    
      const  value = state.darkMode;
      document.documentElement.classList[value ? "add" : "remove"]("dark");
      localStorage.setItem(darkModeKey, value ? "1" : "0");
      commit("basic", {
        key: "darkMode",
        value,
      });
    },

    darkMode({ commit, state }) {
    
      const  value = !state.darkMode;
   
      document.documentElement.classList[value ? "add" : "remove"]("dark");

      localStorage.setItem(darkModeKey, value ? "1" : "0");
      

      commit("basic", {
        key: "darkMode",
        value,
      });
    },
  } ,
  plugins: [
	createPersistedState({
	  storage: {
	    getItem: (key) => ls.get(key),
	    setItem: (key, value) => ls.set(key, value),
	    removeItem: (key) => ls.remove(key),
	  },
	}),
   ],
});
