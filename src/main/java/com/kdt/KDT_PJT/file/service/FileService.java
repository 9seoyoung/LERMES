package com.kdt.KDT_PJT.file.service;

import com.kdt.KDT_PJT.cmmn.dao.CmmnDao;
import com.kdt.KDT_PJT.file.dto.FileDTO;
import com.kdt.KDT_PJT.file.dto.UploadResultDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileService {
    private final CmmnDao cmmnDao;
    private final FileStorageService storage;

    public UploadResultDTO save(MultipartFile file, Integer userSn, Integer coSn, String formUuid) {
        if (file == null || file.isEmpty()) throw new IllegalArgumentException("file is required");
        String original = Objects.requireNonNullElse(file.getOriginalFilename(), "file");
        String ext = extractExt2(original);
        String mime = detectMime2(file, ext);
        long size = file.getSize();

        // 물리 저장 (UUID 파일명은 FileStorageService.store 내부에서 생성)
        String stored = storage.store(file);

        // formUuid 없으면 서버가 생성
        if (formUuid == null || formUuid.isBlank()) {
            formUuid = UUID.randomUUID().toString().replace("-", "");
        }

        // DB 저장 DTO 구성
        FileDTO dto = new com.kdt.KDT_PJT.file.dto.FileDTO();
        dto.setOrgnlFileNm(original);
        dto.setStrgFileNm(stored);
        dto.setStrgFilePath(""); //StoragePaths.root().toString() //경로는 하위에 날짜형식 YYYY/MM/DD 이런거 나중에 추가하면 할듯
        dto.setDelYn((byte)0);
        dto.setStrgDt(java.time.LocalDateTime.now());
        dto.setUserSn(userSn);
        dto.setCoSn(coSn);
        dto.setFileSz(size);
        dto.setFileMimeType(mime);
        dto.setFileExtnNm(ext);
        dto.setFormUuid(formUuid);

        cmmnDao.insert("com.kdt.mapper.file.FileMapper.insertTbFile", dto);

        return new UploadResultDTO(dto.getFileSn(), original, stored, size);
    }

    public List<UploadResultDTO> saveBatch(List<MultipartFile> files, Integer userSn, Integer coSn, String formUuid) {
        if (files == null || files.isEmpty()) throw new IllegalArgumentException("files is required");
        // formUuid 없으면 서버가 생성
        if (formUuid == null || formUuid.isBlank()) {
            formUuid = UUID.randomUUID().toString().replace("-", "");
        }
        List<UploadResultDTO> list = new ArrayList<>();
        for (MultipartFile f : files) {
            list.add(save(f, userSn, coSn, formUuid));
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
            return ext != null ? Files.probeContentType(Path.of("dummy." + ext)) : MediaType.APPLICATION_OCTET_STREAM_VALUE;
        } catch (Exception e) {
            return MediaType.APPLICATION_OCTET_STREAM_VALUE;
        }
    }

    public FileDTO getMeta(int fileSn) {
        return cmmnDao.selectOne("com.kdt.mapper.file.FileMapper.selectTbFileBySn", fileSn);
    }
}
