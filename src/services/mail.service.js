import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import { env } from '../config/environment.js';

const resend = new Resend(process.env.RESEND_API_KEY);

const getTemplate = (type, data) => {
    try {
        const filePath = path.resolve('src/templates', `${type}.html`);
        const source = fs.readFileSync(filePath, 'utf8');
        const template = handlebars.compile(source);
        return template(data);
    } catch (error) {
        console.error('Error loading email template:', error);
        throw { status: 500, message: 'Lỗi khi tải mẫu email' };
    }
};

export const mailService = {
    async sendMail({ to, subject, template, content }) {
        const html = getTemplate(template, content);

        const { data, error } = await resend.emails.send({
            from: env.FROM,
            to,
            subject,
            html,
        });

        if (error) {
            console.log('Error sending email:', error);
            throw { status: 500, message: 'Lỗi gửi email' };
        }
        console.log('Email sent successfully:', data);
        return data;
    },
};
