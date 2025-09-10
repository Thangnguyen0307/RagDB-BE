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
                                    accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1...' }
                                },
                                refreshToken: ['token']
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
                                    accessToken: {
                                        type: "string",
                                        description: "JWT refresh token",
                                        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                                    }
                                },
                                refreshToken: ["token"]
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

    },
    components: {
        schemas: {
            ...AuthSchema,
        },
    },
};

export default swaggerDocument;
