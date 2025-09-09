export const toUserResponse = (user) => {
    return {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
    };
};
