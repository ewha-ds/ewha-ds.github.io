/**
 * 제목 길이에 따라 큰 제목의 크기 단계를 정한다.
 * 디자인은 "AGENTIC AI" 같은 짧은 영문 제목 기준이라, 긴 한글 제목은 줄여야 한다.
 * 한글·한자 등 전각 문자는 1, 영문·숫자·공백·기호는 0.6으로 센다.
 */
export function titleSize(title: string): "short" | "long" | "xlong" {
  let width = 0;
  for (const ch of title) {
    width += /[ᄀ-ᇿ㄰-㆏가-힯一-鿿]/.test(ch) ? 1 : 0.6;
  }
  if (width > 22) return "xlong";
  if (width > 12) return "long";
  return "short";
}
