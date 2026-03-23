const nodemailer = require("nodemailer")

// ====== Helper: HTML escape (XSS védelem) ======
const escapeHtml = (unsafe) => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

// ====== Email Template ======
const getContactEmailTemplate = (name, email, message) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Új üzenet - GPASS</title>
</head>

<body style="
  margin:0;
  padding:0;
  background-color:#f3f4f6;
  font-family:Arial, Helvetica, sans-serif;
">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">

        <table width="600" cellpadding="0" cellspacing="0"
          style="
            background:#ffffff;
            border-radius:12px;
            padding:32px;
            box-shadow:0 10px 25px rgba(0,0,0,0.08);
          "
        >

          <tr>
            <td align="center">
              <h1 style="
                margin:0;
                font-size:24px;
                color:#111827;
              ">
                📩 Új kapcsolatfelvételi üzenet
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding-top:24px; color:#374151; font-size:15px;">
              <strong>Név:</strong> ${escapeHtml(name)}<br/>
              <strong>Email:</strong> ${escapeHtml(email)}
            </td>
          </tr>

          <tr>
            <td style="
              margin-top:20px;
              padding-top:24px;
              font-size:15px;
              color:#1f2937;
              line-height:1.6;
            ">
              <strong>Üzenet:</strong>
              <div style="
                margin-top:12px;
                padding:16px;
                background:#f9fafb;
                border-radius:8px;
                border:1px solid #e5e7eb;
              ">
                ${escapeHtml(message).replace(/\n/g, "<br/>")}
              </div>
            </td>
          </tr>

          <tr>
            <td style="
              padding-top:32px;
              font-size:12px;
              color:#9ca3af;
              text-align:center;
            ">
              GPASS GPS rendszer – Automatikus értesítés
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`

// ====== Controller ======
exports.sendContactMessage = async (req, res, next) => {
  try {
    const { name, email, message } = req.body

    // Az env változók meglétét induláskor kellene ellenőrizni, nem kérésenként.
    // Ha hiányoznak, az első valódi küldési kísérletig nem derül ki a hiba.
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
      throw new Error("Email környezeti változók hiányoznak.")
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    })

    // Ellenőrizzük, hogy az SMTP szerver elérhető-e, mielőtt a kérés sikeres választ kapna.
    // Így a felhasználó azonnal értesül, ha az email küldés nem lehetséges.
    await transporter.verify()

    await transporter.sendMail({
      from: `"GPASS Contact" <${process.env.MAIL_USER}>`,
      to: "gpass.geolocate@gmail.com",
      subject: `📩 Új üzenet érkezett - ${name}`,
      replyTo: email,
      text: `
Név: ${name}
Email: ${email}

Üzenet:
${message}
      `,
      html: getContactEmailTemplate(name, email, message),
    })

    console.log("📨 Contact email elküldve:", email)

    res.status(200).json({
      message: "Email sikeresen elküldve.",
    })
  } catch (error) {
    console.error("❌ Email küldési hiba:", error.message)
    next(error)
  }
}