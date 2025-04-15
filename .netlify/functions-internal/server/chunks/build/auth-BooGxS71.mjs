import { defineStore } from 'pinia';

const useAuthStore = defineStore("auth", {
  state: () => ({
    userName: "",
    userEmail: "",
    userGroup: ""
  }),
  actions: {
    // Call this after login to store user information
    setUserInfo(name, email, group) {
      this.userName = name;
      this.userEmail = email;
      this.userGroup = group;
      console.log("User info stored in auth store:", this.userName, this.userEmail, this.userGroup);
    },
    clearUserInfo() {
      this.userName = "";
      this.userEmail = "";
      this.userGroup = "";
    }
  }
});

export { useAuthStore as u };
