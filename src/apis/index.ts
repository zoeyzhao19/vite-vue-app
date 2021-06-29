class ApiCollections {}

let instance;
export default (() => {
  if (instance) return instance;
  instance = new ApiCollections();
  return instance;
})();
