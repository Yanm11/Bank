const sanitizeUser = (user)=> {
    return {
        _id:user._id,
        name: user.name,
        email:user.email,
        phone:user.phone,
        balance:user.balance,
        address: user.address,
        isAdmin:user.isAdmin
    };
}

module.exports = sanitizeUser;