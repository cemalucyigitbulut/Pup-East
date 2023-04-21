import puppeteer, { launch } from "puppeteer";
import fs from "fs";

//puppeteer session başlat
const getDoctors = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  //yeni sayfa aç
  const sayfa = await browser.newPage();

  // şu https://neareasthospital.com/doctors/?lang=en sayfayı aç
  await sayfa.goto("https://neareasthospital.com/doctors/?lang=en", {
    waitUntil: "domcontentloaded",
  });

  const docCont = await sayfa.evaluate(async () => {
    const docName = document.querySelectorAll(".card-staff__content");
    // şu arraya async yazma anasını sikiyor
    return Array.from(docName).map((kimlik) => {
      const isim = kimlik.querySelector(".card-staff__title").innerText.replace(/\n/g, "");
      const brans = kimlik.querySelector(".card-staff__duty").innerText.replace(/\n/g, "").replace(/(<([^>]+)>)/gi, "");
      const numara = kimlik.querySelector('.list.is-unstyled.is-horizontal.card-staff__list a').getAttribute('href');
      return {isim,brans,numara};
    });
  });
 
  const data = docCont.map((item) => `${item.isim} - ${item.brans} - ${item.numara}`).join("\n");
  fs.writeFileSync("doctors.txt", data);
  console.log("Data written to file");

  // Click on the "Next page" button
  // await page.click(".pager > .next > a")

  await browser.close();
};

getDoctors();
