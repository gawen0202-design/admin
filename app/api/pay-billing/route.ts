export const runtime = "edge"; // Cloudflare Pages 배포용 설정
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. 필수 값 및 UI에서 넘어온 값 추출
    const { 
      encBill, 
      price, 
      goodName, 
      recvphone, 
      cardinst = "00", // 기본값 일시불('00')
      feedbackurl = ""  // 결과를 통보받을 서버 주소 (필요 시)
    } = body;

    // 2. 세금 자동 계산 (금액의 1/11은 부가세, 나머지는 공급가액)
    // 페이앱 필수 파라메터: amount_taxable, amount_taxfree, amount_vat
    const priceNum = Number(price);
    const vat = Math.floor(priceNum / 11);
    const taxable = priceNum - vat;

    // 3. 페이앱 billPay API 호출을 위한 데이터 조립 (문서 가이드 준수)
    const postData = new URLSearchParams({
      cmd: "billPay",                         // [필수] 등록결제 결제 명령어
      userid: "jungbbo",                      // [필수] 판매자 아이디
      linkkey: "ZRa+LcdUO2KXI9nhAr3E4e1DPJnCCRVaOgT+oqg6zaM=", // 연동 키
      encBill: encBill,                       // [필수] 등록결제 연동키 (UI에서 입력)
      goodname: goodName,                     // [필수] 상품명 (UI에서 입력)
      price: priceNum.toString(),             // [필수] 총 결제 금액 (UI에서 입력)
      recvphone: recvphone,                   // [필수] 구매자 휴대폰 번호 (UI에서 입력)
      
      // 세금 관련 [필수]
      amount_taxable: taxable.toString(),     // 공급가액
      amount_taxfree: "0",                    // 면세금액 (0원 고정)
      amount_vat: vat.toString(),             // 부가세
      
      // 통보 및 재시도 설정
      feedbackurl: feedbackurl,               // 결제완료 후 결과 리턴받을 URL
      checkretry: "n",                        // feedbackurl 응답 실패 시 10회 재시도 설정
      
      // 결제 옵션
      cardinst: priceNum >= 50000 ? cardinst : "00", // 5만원 미만은 강제 일시불 처리
      memo: "관리자 수동 결제",                
    });

    // 4. 페이앱 서버로 결제 요청 전송
    const response = await fetch("https://api.payapp.kr/oapi/apiLoad.html", {
      method: "POST",
      body: postData,
    });

    const responseText = await response.text();
    const output = Object.fromEntries(new URLSearchParams(responseText));

    // 5. 결과 응답 처리
    if (output.state === "1") {
      // 결제 성공
      return NextResponse.json({
        success: true,
        mul_no: output.mul_no, // 결제요청번호
        csturl: output.CSTURL, // 결제 영수증 URL
        price: output.price,   // 결제 금액
      });
    } else {
      // 결제 실패 (에러 메시지 반환)
      return NextResponse.json({
        success: false,
        message: output.errorMessage || "결제 요청에 실패했습니다.",
      }, { status: 400 });
    }
  } catch (error) {
    console.error("Billing Pay Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "서버 내부 통신 오류가 발생했습니다." 
    }, { status: 500 });
  }

}
