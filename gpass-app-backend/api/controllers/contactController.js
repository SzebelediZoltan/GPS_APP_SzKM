const nodemailer = require("nodemailer")

exports.sendContactMessage = async (req, res, next) => {
  try {
    const { name, email, message } = req.body

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Minden mező kötelező.",
      })
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    })

    await transporter.sendMail({
      from: `"GPASS Contact" <${process.env.MAIL_USER}>`,
      to: "gpass.geolocate@gmail.com",
      subject: `Új üzenet - ${name}`,
      replyTo: email,
      text: `
Név: ${name}
Email: ${email}

Üzenet:
${message}
      `,
      html: `
        <h2>Új üzenet érkezett</h2>
        <p><strong>Név:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Üzenet:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    })

    res.status(200).json({
      message: "Email elküldve.",
    })
  } catch (error) {
    next(error)
  }
}