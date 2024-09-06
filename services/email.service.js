const fs = require("fs");
const ejs = require("ejs");
const juice = require("juice");
const nodemailer = require("nodemailer");
require("dotenv").config();

class EmailService {
  #transport = null;
  constructor() {
    this.#transport = nodemailer.createTransport({
      service: "gmail",
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASS,
      },
      secure: process.env.MAIL_PORT === 465,
    });
    
    this.#transport
      .verify()
      .then(() => console.log("Connected to email service"))
      .catch(() => console.log("Unable to connect to email service. Config is wrong"));    
  }
  async sendEmail(to, subject, html) {
    const msg = {
      from: config.email.smtp.auth.user,
      to,
      subject,
      html,
    };
    await this.#transport.sendMail(msg);
  }
  async sendEjsMail({ template: templateName, templateVars, ...restOfOptions }) {
    const templatePath = `templates/${templateName}.html`;
    const options = {
      from: process.env.MAIL_USERNAME,
      ...restOfOptions,
    };
    if (templateName && fs.existsSync(templatePath)) {
      const template = fs.readFileSync(templatePath, "utf-8");
      let html;
      if (templateVars) html = await ejs.render(template, templateVars);
      else html = await ejs.render(template);
      const htmlWithStylesInlined = juice(html);
      options.html = htmlWithStylesInlined;
    }
    return await this.#transport.sendMail(options);
  };
}

let emailService = new EmailService();

module.exports = emailService;
