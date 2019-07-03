require('dotenv').config();
const puppeteer = require("puppeteer");

const LOGIN_URL = "https://www.bcl.go.kr/site/member/login?menuid=019009";
const BOOK_REQUEST = 'http://search.bcl.go.kr/new_dls/index.php?mod=wdDataSearch&act=hopeDataRequestForm';

const main = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--window-size=1920,1080", "--disable-notifications", "--no-sandbox"]
  });

  try{
    const page = await browser.newPage();
    await page.on("dialog", (dialog) => {
      console.log(dialog);
      dialog.accept();
    });
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36"
    );
    await page.goto(LOGIN_URL);
    await page.waitForSelector(".id1101");

    await page.type('#userid', process.env.USER_ID);
    await page.type('#userpw', process.env.PASSWORD);
    await page.click('#loginForm > ul > li:nth-child(1) > ul.login-con.m-top30 > li:nth-child(3) > ul > li:nth-child(3) > a');

    await page.waitFor(15000);

    await page.waitForSelector('#header > div.header-top > div > ul > li:nth-child(1) > a');
    const loginText = await page.$eval('#header > div.header-top > div > ul > li:nth-child(1) > a', el => el.innerText);

    if(loginText !== '로그아웃'){
      throw new Error('is wrong ID/PASS');
    }

    const bookInfos = require('fs').readFileSync('./booklist.txt', 'utf-8')
                                .split('\n')
                                .filter(Boolean);
    bookInfos.shift() //remove first row
    for (const info of bookInfos) {
      const detailInfo = info.split('|');
      await page.goto(BOOK_REQUEST);
      await page.waitFor(2000);
      await page.select('[name=manageCode]', detailInfo[0]);
      await page.type('#title', detailInfo[1]); 
      await page.click('#apiSearch');
      await page.waitFor(1000);

      const pages = await browser.pages();
      const popup = pages[pages.length - 1];
      await popup.on("dialog", (dialog) => {
        dialog.accept();
      });

      await popup.waitForSelector('#result_box');
      await page.waitFor(2000);
      await popup.click('body > div > div > div:nth-child(3) > div.btn_basket > a > img');


      await page.click('#agree');

      await page.click('[type=submit]');
    }
    



  }catch(err){
    console.error(err);
  }finally{
    await browser.close();
  }
  

}

main();