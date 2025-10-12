package com.kdt.KDT_PJT.interview.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewRecordDetailResponseDTO {

    private Integer itvSn;          //매칭되는 면담에 대한 일련번호
    private String itvRecordTtl;    // 면담 기록 제목
    private String itvRecordCn;     // 면담 기록 내용
    private String formUuid;        // 폼 UUID (첨부파일 매칭용)
    private Integer itvPicSn;       // 면담 담당자 일련번호
    private Integer itvTrprSn;      // 면담 대상자 일련번호
    private Integer cohortSn;       // 기수 일련번호
    private Integer viewCnt;        // 조회수
    private Integer coSn;           // 회사 일련번호
    private Integer delYn;          // 삭제 여부
    private String date;            // 프론트 입력 받기용 (날짜)
    private String time;            // 프론트 입력 받기용 (시간)

    @JsonIgnore
    private LocalDateTime itvDt;    //DB에서 꺼내온 면담일시
    @JsonIgnore
    private Integer itvRecordSn;    //면담 기록 일련번호
}
