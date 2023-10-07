const { Router } = require("express");

const router = Router();
const getAllUser = (req, res, next) => {

    try {
        const users = fetchAllUserService();
        res.status(STATUS_CODES.OK).json(users);
        if (users.length === 0) {
            throw new NotFoundError('')
        }
    }

    catch (e) {

        throw new UnAuthnticatedError('')
    }

}
const addUser = () => {


}
const getUserById = () => {
    const { id } = req.params;
    try {
        const user=fetchUserById(id)
    } catch (error) {
        
    }
}
const deleteUser = () => {


};
module.exports = { getAllUser, getUserById }