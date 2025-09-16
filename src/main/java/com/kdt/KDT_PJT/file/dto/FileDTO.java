package com.kdt.KDT_PJT.file.dto;

import java.time.LocalDateTime;

public class FileDTO {
    private Integer fileSn;            // FILE_SN
    private String orgnlFileNm;        // ORGNL_FILE_NM
    private String strgFileNm;         // STRG_FILE_NM
    private String strgFilePath;       // STRG_FILE_PATH
    private Byte delYn;                // DEL_YN (0/1)
    private LocalDateTime strgDt;      // STRG_DT
    private Integer userSn;            // USER_SN
    private Integer coSn;              // CO_SN
    private Long fileSz;               // FILE_SZ
    private String fileMimeType;       // FILE_MIME_TYPE
    private String fileExtnNm;         // FILE_EXTN_NM

    public Integer getFileSn() { return fileSn; }
    public void setFileSn(Integer fileSn) { this.fileSn = fileSn; }
    public String getOrgnlFileNm() { return orgnlFileNm; }
    public void setOrgnlFileNm(String orgnlFileNm) { this.orgnlFileNm = orgnlFileNm; }
    public String getStrgFileNm() { return strgFileNm; }
    public void setStrgFileNm(String strgFileNm) { this.strgFileNm = strgFileNm; }
    public String getStrgFilePath() { return strgFilePath; }
    public void setStrgFilePath(String strgFilePath) { this.strgFilePath = strgFilePath; }
    public Byte getDelYn() { return delYn; }
    public void setDelYn(Byte delYn) { this.delYn = delYn; }
    public LocalDateTime getStrgDt() { return strgDt; }
    public void setStrgDt(LocalDateTime strgDt) { this.strgDt = strgDt; }
    public Integer getUserSn() { return userSn; }
    public void setUserSn(Integer userSn) { this.userSn = userSn; }
    public Integer getCoSn() { return coSn; }
    public void setCoSn(Integer coSn) { this.coSn = coSn; }
    public Long getFileSz() { return fileSz; }
    public void setFileSz(Long fileSz) { this.fileSz = fileSz; }
    public String getFileMimeType() { return fileMimeType; }
    public void setFileMimeType(String fileMimeType) { this.fileMimeType = fileMimeType; }
    public String getFileExtnNm() { return fileExtnNm; }
    public void setFileExtnNm(String fileExtnNm) { this.fileExtnNm = fileExtnNm; }
}