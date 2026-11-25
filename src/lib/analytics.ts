/*
  조회수 (GoatCounter · https://www.goatcounter.com)

  - 사이트 코드: GoatCounter 가입 시 정한 이름. 대시보드 주소가
    https://ewhads.goatcounter.com 이면 코드는 "ewhads".
  - 비워두면 조회수 집계·표시가 모두 꺼지고, 화면도 조회수가 없던 때와 똑같습니다.
  - GoatCounter 설정(Settings)에서 "Allow adding visitor counts on your website"를
    켜야 글에 숫자가 보입니다. (기본값은 꺼짐)
  - GoatCounter가 응답을 최대 4시간 캐시하므로 숫자는 바로바로 오르지 않습니다.
  - 서비스가 중단되거나 막혀도 사이트는 정상 동작하고 조회수만 안 보입니다.
*/
export const GOATCOUNTER_CODE = "ewhads";

export const goatcounterBase = GOATCOUNTER_CODE
  ? `https://${GOATCOUNTER_CODE}.goatcounter.com`
  : "";
