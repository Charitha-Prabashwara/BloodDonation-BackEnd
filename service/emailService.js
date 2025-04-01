
const nodemailer = require('nodemailer');

function createTransporter() {
    const transporter = nodemailer.createTransport({
        service: process.env.SMTP_HOST,
        secure: process.env.SMTP_PORT == 465,
        auth: {
          user: process.env.SMTP_AUTH_USER,
          pass: process.env.SMTP_AUTH_PASSWORD
        }
      });
    return transporter;
}



exports.sendVerifyEmail = async(receiverAddress, first_name,verifyToken) =>{

  // Create a transporter object using Gmail SMTP
  let transporter = createTransporter();
  await transporter.verify();
  
  // Email options
  let mailOptions = {
    from: process.env.SMTP_AUTH_USER,          // Sender address
    to: receiverAddress,     // List of recipients
    subject: process.env.APP_NAME +" : "+"Account Verification",    // Subject line
    html: `
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
            <td align="center">
                <table width="600px" border="0" cellspacing="0" cellpadding="0" style="background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); text-align: center;">
                <tr>
                        <td style="font-size: 24px; font-weight: bold; color: #333333; padding-bottom: 20px;">
                            Dear ${first_name}
                        </td>
                    </tr>    
                <tr>
                        <td style="font-size: 24px; font-weight: bold; color: #333333; padding-bottom: 20px;">
                            Verify Your Email Address
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 16px; color: #555555; padding-bottom: 20px;">
                            Thank you for signing up! Please click the button below to verify your email address.
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <a href="http://localhost:8000/api/v1/user/verify?token=${verifyToken}" 
                               style="display: inline-block; padding: 12px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; font-size: 18px; border-radius: 5px;">
                               Verify Email
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 14px; color: #777777; padding-top: 20px;">
                            If you didn't request this, you can ignore this email.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
  `,
  };
  
  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
     throw new Error(error.message);
    }
    return info;
  });

};

exports.sendForgotPasswordEmail = async(receiverAddress,resetToken) =>{

    // Create a transporter object using Gmail SMTP
    let transporter = createTransporter();
    await transporter.verify();
    
    // Email options
    let mailOptions = {
      from: process.env.SMTP_AUTH_USER,          // Sender address
      to: receiverAddress,     // List of recipients
      subject: process.env.APP_NAME +" : "+"Forgot Password",    // Subject line
      html: `
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
        <td align="center">
            <table width="600px" border="0" cellspacing="0" cellpadding="0" style="background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); text-align: center;">
                <tr>
                    <td style="font-size: 24px; font-weight: bold; color: #333333; padding-bottom: 20px;">
                        Password Reset Request
                    </td>
                </tr>    
                <tr>
                    <td style="font-size: 16px; color: #555555; padding-bottom: 20px;">
                        We received a request to reset your password. Click the button below to proceed.
                    </td>
                </tr>
                <tr>
                    <td>
                        <a href="http://localhost:8000/api/v1/user/reset-password?token=${resetToken}" 
                           style="display: inline-block; padding: 12px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; font-size: 18px; border-radius: 5px;">
                           Reset Password
                        </a>
                    </td>
                </tr>
                <tr>
                    <td style="font-size: 14px; color: #777777; padding-top: 20px;">
                        If you didn't request this, you can safely ignore this email.
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
    `,
    };
    
    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
       throw new Error(error.message);
      }
      return info;
    });
  
  };