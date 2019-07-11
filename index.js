require('dotenv').config();
const isRaspberry = (process.env.IS_RASPBERRY && process.env.IS_RASPBERRY === 'yes' || false);
const puppeteer = isRaspberry?require('puppeteer-core'):require('puppeteer');

const LOGIN_URL = 'https://www.bcl.go.kr/site/member/login?menuid=019009';
const LOGOUT_URL = 'http://www.bcl.go.kr/passni/jsp/login/logout.jsp?menuid=019009';
const MAIN = 'http://www.bcl.go.kr/site/main/index019';
const BOOK_REQUEST = 'http://search.bcl.go.kr/new_dls/index.php?mod=wdDataSearch&act=hopeDataRequestForm';

const OPTION = isRaspberry?{
  executablePath: '/usr/bin/chromium-browser',
  headless: false,
  args: ['--window-size=1920,1080', '--disable-notifications', '--no-sandbox']
}:{
  headless: false,
  args: ['--window-size=1920,1080', '--disable-notifications', '--no-sandbox']
};



let tryLogin = 0;
let reLogin = false;
const ids = eval(process.env.USER_ID);
const pws = eval(process.env.PASSWORD);

const logoutFnc= async (page) => {
  await page.goto(MAIN)
  await page.waitForSelector('#header > div.header-top > div > ul > li:nth-child(1) > a');
  await page.click('#header > div.header-top > div > ul > li:nth-child(1) > a');
  await page.waitForSelector('#header > div.header-top > div > ul > li:nth-child(1) > a'); 
}

const loginFnc = async (page) => {
  await page.goto(LOGIN_URL);
  await page.waitForSelector('.id1101');
  await page.type('#userid', ids[tryLogin]);
  await page.type('#userpw', pws[tryLogin]);
  await page.click('#loginForm > ul > li:nth-child(1) > ul.login-con.m-top30 > li:nth-child(3) > ul > li:nth-child(3) > a');
  await page.waitFor(15000);
  await page.waitForSelector('#header > div.header-top > div > ul > li:nth-child(1) > a');
  const loginText = await page.$eval('#header > div.header-top > div > ul > li:nth-child(1) > a', el => el.innerText);
  if (loginText !== '로그아웃') {
    throw new Error('is wrong ID/PASS');
  }
  reLogin = false;
  ++tryLogin;
  console.log(`Login Try Count : ${tryLogin}`);
}

const main = async () => {
  const browser = await puppeteer.launch(OPTION);
  

  try{
    const page = await browser.newPage();
    await page.on('dialog', (dialog) => {
      console.log(dialog);
      if(dialog._message === '이번달 신청가능횟수를 초과 하셨습니다. 자세한 내용은 [희망자료신청 안내]에서 확인해 주세요.'){
        reLogin = true;
      }
      dialog.accept();
      if(ids.length == tryLogin){
        throw new Error('Does not have enough account!');
      }
    });
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36'
    );

    await loginFnc(page);

    const bookInfos = require('fs').readFileSync('./booklist.txt', 'utf-8')
                                .split('\n')
                                .filter(Boolean);
    bookInfos.shift() //remove first row
    for (const info of bookInfos) {
      const detailInfo = info.split('|');
      console.log(`Register BOOK : ${detailInfo[1]}`);
      await page.goto(BOOK_REQUEST);
      await page.waitFor(5000);
      while(reLogin){
        await logoutFnc(page);
        await loginFnc(page);
        await page.goto(BOOK_REQUEST);
        await page.waitFor(5000);
      }
      await page.select('[name=manageCode]', detailInfo[0]);
      await page.type('#title', detailInfo[1]); 
      await page.click('#apiSearch');
      await page.waitFor(1000);

      const pages = await browser.pages();
      const popup = pages[pages.length - 1];
      await popup.on('dialog', (dialog) => {
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
