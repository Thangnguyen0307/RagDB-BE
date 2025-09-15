import { MailType } from '../constants/mail.constant.js';
import AuthSchema from '../schemas/auth.schema.js';
const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'RagDB API',
        version: '1.0.0',
    },
    servers: [
        {
            url: 'http://localhost:8080',       // Dev local
            description: 'Local Development',
        },
        {
            url: '/projects/ragdb',     // Prod qua Nginx
            description: 'Production - Techleaf',
        },
    ],
    paths: {
        // -------------------- Auth APIs ------------------- -
        '/api/auth/register': {
            post: {
                tags: ['Auths'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: AuthSchema.RegisterRequest,
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'Đăng ký thành công',
                    },
                    400: {
                        description: 'Sai dữ liệu đầu vào',
                    },
                },
            },
        },
        '/api/auth/login': {
            post: {
                tags: ['Auths'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: AuthSchema.LoginRequest,
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Đăng nhập thành công',
                    },
                    400: {
                        description: 'Dữ liệu không hợp lệ',
                    },
                }
            }
        },
        '/api/auth/reset-password': {
            put: {
                tags: ['Auths'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: AuthSchema.ResetPasswordRequest,
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Đặt lại mật khẩu thành công'
                    },
                    400: {
                        description: 'Dữ liệu không hợp lệ'
                    }
                }
            }
        },
        '/api/auth/update-password': {
            put: {
                tags: ['Auths'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: AuthSchema.UpdatePasswordRequest,
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Cập nhật mật khẩu thành công'
                    },
                    400: {
                        description: 'Dữ liệu không hợp lệ'
                    },
                }
            }
        },
        "/api/auth/refresh-token": {
            post: {
                tags: ["Auths"],
                summary: "Làm mới token",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: AuthSchema.RefreshTokenRequest,
                        }
                    }
                },
                responses: {
                    200: {
                        description: "Trả về access token mới",
                    },
                }
            }
        },
        "/api/auth/send-otp": {
            post: {
                tags: ["Auths"],
                summary: "Gửi OTP về email",
                description: "Gửi OTP theo loại mail (MailType).",
                parameters: [
                    {
                        name: "type",
                        in: "query",
                        required: true,
                        schema: {
                            type: "string",
                            enum: [MailType.RESET_PASSWORD, MailType.SIGN_UP],
                        },
                        description: "Loại OTP cần gửi",
                        example: "RESET_PASSWORD"
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: AuthSchema.SendOtpRequest
                        }
                    }
                },
                responses: {
                    200: {
                        description: "Gửi OTP thành công",
                    },
                    400: {
                        description: "Dữ liệu không hợp lệ hoặc type sai",
                    },
                    500: {
                        description: "Lỗi hệ thống",
                    }
                }
            }
        },
        "/api/auth/logout": {
            post: {
                tags: ["Auths"],
                summary: "Đăng xuất",
                description: "Thu hồi refresh token và đăng xuất người dùng.",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: AuthSchema.LogoutRequest
                        }
                    }
                },
                responses: {
                    200: {
                        description: "Đăng xuất thành công, refresh token đã bị thu hồi",
                    },
                    400: {
                        description: "Dữ liệu không hợp lệ hoặc thiếu refreshToken",
                    },
                    401: {
                        description: "Token không hợp lệ hoặc đã hết hạn",
                    },
                    500: {
                        description: "Lỗi hệ thống",
                    }
                }
            }
        },


        // -------------------- Users APIs ------------------- -
        '/api/users/load': {
            get: {
                tags: ['Users'],
                summary: 'Lấy thông tin user hiện tại',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'Thông tin user',
                        content: { 'application/json': { schema: AuthSchema.UserInfoRequest } }
                    },
                    401: { description: 'Chưa đăng nhập hoặc token không hợp lệ' }
                }
            }
        },
        '/api/users/update': {
            put: {
                tags: ['Users'],
                summary: 'Cập nhật thông tin user hiện tại',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: AuthSchema.UserUpdateRequest } }
                },
                responses: {
                    200: {
                        description: 'Cập nhật thành công',
                        content: { 'application/json': { schema: AuthSchema.UserInfoRequest } }
                    },
                    400: { description: 'Dữ liệu không hợp lệ' },
                    401: { description: 'Chưa đăng nhập hoặc token không hợp lệ' }
                }
            }
        },

        // -------------------- Upload APIs ------------------- -
        "/api/upload/singleFile": {
            post: {
                tags: ["Upload"],
                summary: "Upload file",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "multipart/form-data": {
                            schema: {
                                type: "object",
                                properties: {
                                    file: {
                                        type: "string",
                                        format: "binary"
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: { description: "Upload file thành công" },
                    400: { description: "Lỗi upload" }
                }
            }
        },
    },

    components: {
        schemas: {
            ...AuthSchema,
        },
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },

    },

};

export default swaggerDocument;
