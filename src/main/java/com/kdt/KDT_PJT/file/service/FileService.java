package com.kdt.KDT_PJT.file.service;

import com.kdt.KDT_PJT.cmmn.dao.CmmnDao;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Objects;

@Service
public class FileService {
    private final CmmnDao cmmnDao;
    private final FileStorageService storage;

    public FileService(CmmnDao cmmnDao, FileStorageService storage) {
        this.cmmnDao = cmmnDao;
        this.storage = storage;
    }

    public com.kdt.KDT_PJT.file.dto.UploadResultDTO save(MultipartFile file, Integer userSn, Integer coSn) {
        if (file == null || file.isEmpty()) throw new IllegalArgumentException("file is required");
        String original = Objects.requireNonNullElse(file.getOriginalFilename(), "file");
        String ext = extractExt2(original);
        String mime = detectMime2(file, ext);
        long size = file.getSize();

        // 물리 저장 (UUID 파일명은 FileStorageService.store 내부에서 생성)
        String stored = storage.store(file);

        // DB 저장 DTO 구성
        com.kdt.KDT_PJT.file.dto.FileDTO dto = new com.kdt.KDT_PJT.file.dto.FileDTO();
        dto.setOrgnlFileNm(original);
        dto.setStrgFileNm(stored);
        dto.setStrgFilePath(""); //com.kdt.KDT_PJT.file.util.StoragePaths.root().toString() //경로는 하위에 날짜형식 YYYY/MM/DD 이런거 나중에 추가하면 할듯
        dto.setDelYn((byte)0);
        dto.setStrgDt(java.time.LocalDateTime.now());
        dto.setUserSn(userSn);
        dto.setCoSn(coSn);
        dto.setFileSz(size);
        dto.setFileMimeType(mime);
        dto.setFileExtnNm(ext);

        cmmnDao.insert("com.kdt.mapper.file.FileMapper.insertTbFile", dto);

        return new com.kdt.KDT_PJT.file.dto.UploadResultDTO(dto.getFileSn(), original, stored, size);
    }

    public java.util.List<com.kdt.KDT_PJT.file.dto.UploadResultDTO> saveBatch(java.util.List<MultipartFile> files, Integer userSn, Integer coSn) {
        if (files == null || files.isEmpty()) throw new IllegalArgumentException("files is required");
        java.util.List<com.kdt.KDT_PJT.file.dto.UploadResultDTO> list = new java.util.ArrayList<>();
        for (MultipartFile f : files) {
            list.add(save(f, userSn, coSn));
        }
        return list;
    }

    private static String extractExt2(String filename) {
        int i = filename.lastIndexOf('.');
        if (i < 0 || i == filename.length() - 1) return null;
        return filename.substring(i + 1);
    }

    private static String detectMime2(MultipartFile file, String ext) {
        try {
            String probe = file.getContentType();
            if (probe != null && !probe.isBlank()) return probe;
            return ext != null ? java.nio.file.Files.probeContentType(java.nio.file.Path.of("dummy." + ext)) : org.springframework.http.MediaType.APPLICATION_OCTET_STREAM_VALUE;
        } catch (Exception e) {
            return org.springframework.http.MediaType.APPLICATION_OCTET_STREAM_VALUE;
        }
    }

    public com.kdt.KDT_PJT.file.dto.FileDTO getMeta(int fileSn) {
        return cmmnDao.selectOne("com.kdt.mapper.file.FileMapper.selectTbFileBySn", fileSn);
    }
}
