package com.kdt.KDT_PJT.user.Dto;


import com.kdt.KDT_PJT.auth.entity.User;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private Long userSn;
    private String userNm;
    private String userPswd;
    private String userEmlAddr;
    private Boolean userActvtnYn;
    private Long userAuthrtSn;
    private String userTelno;
    private Long ogdpCoSn;
    private Long ogdpCohortSn;

//
//    public User toEntity() {
//        return new User(userSn, userNm, userPswd,userEmlAddr,userActvtnYn, userAuthrtSn, userTelno, ogdpCoSn, ogdpCohortSn);
//    }
}
