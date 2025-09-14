package com.kdt.KDT_PJT.file.svc;

import com.kdt.KDT_PJT.cmmn.dao.CmmnDao;
import com.kdt.KDT_PJT.file.service.FileStorageService;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
public class FileService {
    private final CmmnDao Dao;
    private final FileStorageService storage;
//    public FileService(FileDao fileDao, FileStorageService storage) {
//        this.fileDao = fileDao;
//        this.storage = storage;
//    }
//
//    @Transactional
//    public UploadResultDTO save(MultipartFile file, Integer userSn, Integer coSn) {
//        if (file == null || file.isEmpty()) throw new IllegalArgumentException("file is required");
//        // 원본명/확장자/MIME/크기
//        String original = Objects.requireNonNullElse(file.getOriginalFilename(), "file");
//        String ext = extractExt(original);
//        String mime = detectMime(file, ext);
//        long size = file.getSize();
//
//        // 저장 파일명 = UUID + 확장자
//        String strgFileNm = genRandomName(ext);
//        String strgFilePath = StoragePaths.singleFolderPath(); // "" 반환(단일 폴더)
//
//        // 1) 물리 저장
//        Path abs = storage.resolve(strgFilePath, strgFileNm);
//        storage.ensureBaseDir();
//        storage.copy(file, abs);
//
//        // 2) DB 저장
//        FileDTO dto = new FileDTO();
//        dto.setOrgnlFileNm(original);
//        dto.setStrgFileNm(strgFileNm);
//        dto.setStrgFilePath(strgFilePath);
//        dto.setDelYn((byte)0);
//        dto.setStrgDt(LocalDateTime.now());
//        dto.setUserSn(userSn);
//        dto.setCoSn(coSn);
//        dto.setFileSz(size);
//        dto.setFileMimeType(mime);
//        dto.setFileExtnNm(ext);
//        fileDao.insertTbFile(dto);
//
//        return UploadResultDTO.from(dto);
//    }
//
//    @Transactional
//    public List<UploadResultDTO> saveBatch(List<MultipartFile> files, Integer userSn, Integer coSn) {
//        if (files == null || files.isEmpty()) throw new IllegalArgumentException("files is required");
//        List<UploadResultDTO> results = new ArrayList<>();
//        for (MultipartFile f : files) {
//            results.add(save(f, userSn, coSn));
//        }
//        return results;
//    }
//
//    public static class DownloadPayload {
//        private final Resource resource;
//        private final String originalFileName;
//        private final String contentType;
//        private final long contentLength;
//        public DownloadPayload(Resource r, String name, String type, long len) {
//            this.resource = r; this.originalFileName = name; this.contentType = type; this.contentLength = len;
//        }
//        public Resource getResource() { return resource; }
//        public String getOriginalFileName() { return originalFileName; }
//        public String getContentType() { return contentType; }
//        public long getContentLength() { return contentLength; }
//    }
//
//    public DownloadPayload loadAsResource(int fileSn) {
//        FileDTO meta = fileDao.selectTbFileBySn(fileSn);
//        if (meta == null || meta.getDelYn() == 1) throw new FileNotFoundException("file not found: " + fileSn);
//        Path abs = storage.resolve(meta.getStrgFilePath(), meta.getStrgFileNm());
//        if (!Files.exists(abs)) throw new FileNotFoundException("physical file missing: " + abs);
//        Resource r = new FileSystemResource(abs);
//        String ctype = meta.getFileMimeType() != null ? meta.getFileMimeType() : MediaType.APPLICATION_OCTET_STREAM_VALUE;
//        long len = meta.getFileSz() != null ? meta.getFileSz() : r.contentLength();
//        return new DownloadPayload(r, meta.getOrgnlFileNm(), ctype, len);
//    }
//
//    @Transactional
//    public void logicalDelete(int fileSn) {
//        int updated = fileDao.updateTbFileDelYn(fileSn, (byte)1);
//        if (updated == 0) throw new FileNotFoundException("file not found to delete: " + fileSn);
//        // 물리 파일은 즉시 삭제하지 않고 보관(배치에서 정리)
//    }
//
//    private static String genRandomName(String ext) {
//        String base = UUID.randomUUID().toString().replace("-", "");
//        return (ext == null || ext.isBlank()) ? base : base + "." + ext.toLowerCase();
//    }
//
//    private static String extractExt(String filename) {
//        int i = filename.lastIndexOf('.');
//        if (i < 0 || i == filename.length() - 1) return null;
//        return filename.substring(i + 1);
//    }
//
//    private static String detectMime(MultipartFile file, String ext) {
//        try {
//            String probe = file.getContentType();
//            if (probe != null && !probe.isBlank()) return probe;
//            // fallback: 파일명 기반(안전성은 낮지만 대체용)
//            return ext != null ? Files.probeContentType(Path.of("dummy." + ext)) : MediaType.APPLICATION_OCTET_STREAM_VALUE;
//        } catch (Exception e) {
//            return MediaType.APPLICATION_OCTET_STREAM_VALUE;
//        }
//    }
}
