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
            url: 'http://localhost:8080',  
            description: 'Local server'
        }
    ],
    paths: {
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
        '/api/auth/introspect': {
            post: {
                tags: ['Auths'],
                summary: 'Kiểm tra token hợp lệ (introspect)',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    token: { type: 'string', example: 'eyJhbGciOiJIUzI1...' }
                                },
                                required: ['token']
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Trả về trạng thái hợp lệ của token',
                    },
                    400: {
                        description: 'Dữ liệu không hợp lệ'
                    }
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
                            schema: {
                                type: "object",
                                properties: {
                                    token: {
                                        type: "string",
                                        description: "JWT refresh token",
                                        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                                    }
                                },
                                required: ["token"]
                            }
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
                            schema: {
                                type: "object",
                                properties: {
                                    email: {
                                        type: "string",
                                        format: "email",
                                        example: "example@gmail.com",
                                    }
                                },
                                required: ["email"]
                            }
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
        
         "/api/users/load": {
            get: {
                tags: ['Users'],
                summary: 'Lấy thông tin user hiện tại',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'Thông tin user',
                        content: {
                            'application/json': { schema: AuthSchema.UserInfoSRequest }
                        }
                    },
                    401: { description: 'Chưa đăng nhập hoặc token không hợp lệ' }
                }
            }
        },

        // Cập nhật thông tin user hiện tại
        "/api/users/update": {
            put: {
                tags: ['Users'],
                summary: 'Cập nhật thông tin user hiện tại',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': { schema: AuthSchema.UserUpdateRequest }
                    }
                },
                responses: {
                    200: {
                        description: 'Cập nhật thành công',
                        content: {
                            'application/json': { schema: AuthSchema.UserInfoSRequest }
                        }
                    },
                    400: { description: 'Dữ liệu không hợp lệ' },
                    401: { description: 'Chưa đăng nhập hoặc token không hợp lệ' }
                }
            }
        }
       
    },
    components: {
        schemas: {
            ...AuthSchema,
        },
    },
};

export default swaggerDocument;
