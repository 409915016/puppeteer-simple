const puppeteer = require('puppeteer')
var program = require('commander');
program
  .option('-u, --user [user]', 'Add username')
  .option('-p, --password [password]', 'Add password')
  .parse(process.argv);

var {
  timeout
} = require('../tools/tools.js');
var delay = 1000

new Promise((resolve, reject)=>{
  if(!(program.user && program.password)) {
    return reject('require username or password')
  } else {
    resolve()
  }

}).then(()=>{
  puppeteer.launch({
    headless: false
  }).then(async browser => {
    var page = await browser.newPage()
    page.setViewport({
      width: 375,
      height: 667,
    })
  
    try {
      await page.goto('http://www.infzm.com/wap/#/', {
        waitUntil: "load"
      })
      await timeout(delay)
  
      var ArticleList = await page.evaluate(() => {
        var list = [...document.querySelectorAll('.contents .contents__item .infzm-content-item__text')]
  
        return list.map((el, index) => {
          return {
            no: index + 1,
            title: el.innerText
          }
        })
      })
  
      console.log('ArticleList:', ArticleList);
      //infzm-header__avatar
      await page.click('.van-icon-user');
      await timeout(500)
  
      await page.click('.user_info__content');
      await timeout(1000)
  
      await page.click('.passport-login__header ul li:nth-child(2)');
      await timeout(500)
  
      await page.type('input[placeholder="手机号/邮箱"]', program.user, {
        delay: 50
      });
  
      await page.type('input[placeholder="密码"]', program.password);
      await timeout(500)
      await page.click('.login-form__confirm');
  
  
      // await page.screenshot({
      //   path: './data/infzm/index.png',
      //   type: 'png',
      // });
    } catch (e) {
      console.log('sf err:', e);
    }
  
  })
})