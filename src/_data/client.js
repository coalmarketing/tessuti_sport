module.exports = {
  name: "Tessuti Sport",
  email: "info@tessuti.cz",
  ico: "19538685",
  phoneForTel: "+420731736631",
  phoneFormatted: "+420 731 736 631",
  address: {
    lineOne: "Třebovská 123",
    city: "Ústí nad Orlicí",
    zip: "56203",
    mapLink: "https://maps.app.goo.gl/GQmwqUWKd6JMZi8Y7",
  },
  socials: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
    youtube: "https://www.youtube.com/",
    tiktok: "https://www.tiktok.com/",
    whatsapp: "https://wa.me/",
  },
  //! Make sure you include the file protocol (e.g. https://) and that NO TRAILING SLASH is included
  domain: "https://www.senoweb.cz",
  // Passing the isProduction variable for use in HTML templates
  isProduction: process.env.ELEVENTY_ENV === "PROD",
};
