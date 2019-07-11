// TEST용 js
require('dotenv').config();
let cnt = 0;

const increase = (i) => ++cnt;

const main = async () => {
    //증가값 확인
    increase(cnt);
    increase(cnt);
    increase(cnt);

    console.log(cnt);
    // id get test
    const ids = eval(process.env.USER_ID);
    console.log(ids[1]);

    // while with await
}

main();