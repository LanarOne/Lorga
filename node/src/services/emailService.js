import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "nathan.lanar@gmail.com",
    clientId:
      "834394867983-q9ri5hc9bmrivi4880jslb4smm4d1dp5.apps.googleusercontent.com",
    clientSecret: "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",
    refreshToken:
      "1//04OYgoXfR8IM3CgYIARAAGAQSNwF-L9IrgQupSEOhgIKTmyj8KYhr-DmCmwTW62lXeAopExzIGwuo0NPPZqlKy1RvI3nJLl3wuS0",
  },
});

const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"LorgaProject"<nathan.simon@3wa.io>`,
    to,
    subject,
    html,
  });
};
export default sendEmail;
