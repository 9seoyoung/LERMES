package com.kdt.KDT_PJT.cerfifi.enums;

/*
Enum 사용법
CertifiType.EDU
CertifiType.EDU.name()          ->	"EDU" (String)
CertifiType.EDU.getFrontName()  ->  "교육진행확인서"
*/
public enum CertifiType {
    EDU("교육진행확인서"),
    COMPLETE("수료증");

    private final String frontName;

    CertifiType(String frontName){
        this.frontName = frontName;
    }

    public String getFrontName() {
        return frontName;
    }

    /**
     * 프론트엔드에서 받은 표시 이름(frontName)을 기반으로 해당하는 Enum 상수를 찾습니다.
     * @param frontName 프론트에서 받은 문자열 (예: "교육진행확인서")
     * @return 해당하는 CertifiType Enum 상수
     * @throws IllegalArgumentException 일치하는 상수가 없을 경우
     */
    public static CertifiType fromFrontName(String frontName) {
        if (frontName == null || frontName.trim().isEmpty()) {
            throw new IllegalArgumentException("증명서 유형 이름은 필수입니다.");
        }

        // Enum 상수 전체를 반복하며 frontName과 일치하는 것을 찾습니다.
        for (CertifiType type : CertifiType.values()) {
            if (type.frontName.equals(frontName)) {
                return type;
            }
        }

        // 일치하는 상수가 없을 경우 예외 발생
        throw new IllegalArgumentException("유효하지 않은 증명서 유형 이름입니다: " + frontName);
    }



}
