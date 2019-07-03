> 도서관에 책을 등록하는 프로그램 입니다. 기존에 JAVA로 만들어진 모듈을 nodejs로 변경 하였습니다. JAVA 소스의 경우 selenium을 설치하고 설정해야하는 부분이 많았는데 [puppeteer](https://github.com/GoogleChrome/puppeteer)를 이용하면 간단하게 최소한의 설정으로 처리가 가능하다.

<div markdown="0"><a href="https://github.com/lahuman/request-book-apply" class="btn btn-warning"> 기존 JAVA Source 바로가기</a></div>

## 프로그램 설계

부천 시립 도서관에서 한달에 요청 할 수 있는 도서는 다음과 같다.

* 상동, 심곡, 꿈빛, 책마루, 송내도서관 : 1인당 월 5권
* 원미, 북부, 한울빛, 꿈여울도서관 : 1인당 월 20권

이에 도서 목록을 다음과 같이 TXT 파일로 작성하연 자동으로 등록 하도록 한다.

#### 도서목록 파일 내용 샘플
<pre>
도서관코드|도서명
AA|즐거운하루
AB|자동책등록프로그램
</pre>

#### 도서관 코드

> 계정별로 대여가 가능한 도서관 코드는 정해져 있습니다. 확인하시고 요청 해야 합니다.
> 상동, 심곡, 꿈빛, 책마루, 송내, 동화도서관: 1인당 월 5권 으로 변경 되었습니다.


| 도서관코드 | 도서관명 | 비고 |
|:--------:|:-------:|:--------:|
| AA      | 상동   |  월5권   |
| AB      | 원미   | 월20권   |
| AC      | 삼곡   | 월5권  |
| AD      | 북부   | 월20권  |
| AE      | 꿈빛   | 월5권   |
| AF      | 책마루 | 월5권   |
| AG      | 한울빛 | 월20권  |
| AH      | 꿈여울 | 월20권   |
| AI      | 송내   | 월5권   |
| AK      | 도당   | 월20권  |


## 프로세스 순서도

![프로세스 순서도](https://lahuman.github.io/assets/project/bookapply/process_flowchart.png)


## Notice

* nodejs 필요
* _env 를 .env 로 파일명 변경
* .env 에 ID/PW 작성

## 실행 방법

```
# 모듈 설치
npm install

# 실행
npm run start
```


## License

희망 도서 자동 등록 프로그램은 open source 프로그램으로 MIT 라이선스를 따릅니다.

This Request book apply is free and open source software, distributed under the MIT License. So feel free to use this program on your project without linking back to me or including a disclaimer.
