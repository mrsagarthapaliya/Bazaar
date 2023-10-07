const fetchAllUserService = () => {
    return userModel.findAll()
}
const fetchUserById = (id) => {
return userModel.find({id})
}