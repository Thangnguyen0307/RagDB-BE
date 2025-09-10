export const toUserResponse = (user) => {
    return {
        id: user.userId,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
    };
};
