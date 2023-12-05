function WelcomeEmailTemplate(organizationName, teamName , link) {
      return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to WorkZen</title>
          <style>
            /* Add your custom CSS styles here */
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              box-sizing: border-box;
            }
            .logo {
              text-align: center;
              margin-bottom: 20px;
            }
            .logo img {
              max-width: 100%;
              height: auto;
            }
            .ButtonStyle {
              display: inline-block;
              padding: 10px 20px;
              text-align: center;
              background: #4CAF50;
              border-radius: 5px;
              text-decoration: none;
              color: #fff !important;
            }
            .ButtonStyle:hover {
              background: #45a049;
            }
            a {
              text-decoration: none;
              color: #45a049;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">
              <img src="https://res.cloudinary.com/dqpirrbuh/image/upload/v1701794893/34680609_8188960_wgdyxg.jpg" alt="Your Logo">
            </div>
            <h2>Welcome to ${organizationName}</h2>
            <p>Hello,</p>
            <p>Thank you for joining ${organizationName}. We're excited to have you on board!</p>
            <p>You are now a member of the team "${teamName}". Get ready to collaborate and achieve great things together!</p>
            <p><a href=${link} class="ButtonStyle">Visit WorkZen</a></p>
            <p>If you have any questions or need assistance, feel free to reach out. Welcome to the team!</p>
          </div>
        </body>
        </html>
      `;
    }
    
module.exports = WelcomeEmailTemplate;
    