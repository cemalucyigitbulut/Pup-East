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
  fs.writeFileSync("DoctorsNearEast.txt", data);
  console.log("Data written to file for NearEast");

  // Click on the "Next page" button
  // await page.click(".pager > .next > a")

  await browser.close();
};


//puppeteer session başlat
const getDoctors2 = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  //yeni sayfa aç
  const sayfa = await browser.newPage();

  // şu https://cypruscentralhospital.com/doktorlarimiz/ sayfayı aç
  await sayfa.goto("https://cypruscentralhospital.com/doktorlarimiz/", {
    waitUntil: "domcontentloaded",
  });
  

  const docCont = await sayfa.evaluate(async () => {
    const docName = document.querySelectorAll(".mkdf-team-info");
    // şu arraya async yazma anasını sikiyor
    return Array.from(docName).map((kimlik) => {
      const isim = kimlik.querySelector(".mkdf-team-name.entry-title").innerText.replace(/\n/g, "");
      const brans = kimlik.querySelector(".mkdf-team-position").innerText.replace(/\n/g, "").replace(/(<([^>]+)>)/gi, "");
      const numara = "+90 (392) 366 50 85 "
      const email = "info@cypruscentralhospital.com"
      return {isim,brans,numara,email};
    });
  });
 
  const data = docCont.map((item) => `${item.isim} - ${item.brans} - ${item.numara} - ${item.email}`).join("\n");
  fs.writeFileSync("DoctorsCyprusCentral.txt", data);
  console.log("Data written to file for CentralHospital");

  await browser.close();
};

//puppeteer session başlat
const getDoctors3 = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const data = [];

  try {
    const sayfa = await browser.newPage();

    await sayfa.goto("https://www.kttb.org/doktorlarimiz/", {
      waitUntil: "domcontentloaded",
    });

    let hasNextPage = true;
    while (hasNextPage) {
      const docCont = await sayfa.evaluate(() => {
        const docName = document.querySelectorAll(".tablepress-31 > tbody > tr");
        return Array.from(docName).map((kimlik) => {
          const isim = kimlik.querySelector(".column-1")?.innerText?.replace(/\n/g, "") || "info is not specified";
          const brans = kimlik.querySelector(".column-2")?.innerText?.replace(/\n/g, "").replace(/(<([^>]+)>)/gi, "") || "info is not specified";
          const numara = kimlik.querySelector(".column-3")?.innerText?.replace(/\n/g, "").replace(/(<([^>]+)>)/gi, "") || "info is not specified";
          const bölge = kimlik.querySelector(".column-4")?.innerText?.replace(/\n/g, "").replace(/(<([^>]+)>)/gi, "") || "info is not specified";
          return {isim, brans, numara, bölge};
        });
      });

      data.push(...docCont);

      const nextPage = await sayfa.$(".tablepress-31_paginate > .tablepress-31_next");
      if (nextPage !== null) {
        await nextPage.click();
        await sayfa.waitForNavigation();
      } else {
        hasNextPage = false;
      }
    }

    const dataStr = data.map((item) => `${item.isim} - ${item.brans} - ${item.numara} - ${item.bölge}`).join("\n");
    fs.writeFileSync("DoctorsAll.txt", dataStr);
    console.log("Data written to file for All Cyprus");
    } catch (error) {
    console.error(error);
    } finally {
    await browser.close();
    }
};



const getDoctors4 = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

    const sayfa = await browser.newPage();

    await sayfa.goto("https://www.kttb.org/doktorlarimiz/", {
      waitUntil: "domcontentloaded",
    });

      const docCont = await sayfa.evaluate(() => {
        const docName = document.querySelectorAll(".tablepress-31 > tbody > tr");
        });

        console.log(docCont);
        await browser.close();

};



// getDoctors();
// getDoctors2();
// getDoctors3();
getDoctors4();