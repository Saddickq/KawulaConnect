const createAuthSlice = (set) => ({
  userInfo: undefined,
  setUserInfo: (userInfo) => set({ userInfo }),
});
export default createAuthSlice;
