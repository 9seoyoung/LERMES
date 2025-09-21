package com.kdt.KDT_PJT.file.ctl;

import com.kdt.KDT_PJT.file.dto.UploadResultDTO;
import com.kdt.KDT_PJT.file.service.FileService;
import com.kdt.KDT_PJT.file.service.FileStorageService;
import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.multipart.MultipartFile;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class FileController {

    private final FileStorageService storage;
    private final FileService fileService;

//    public FileController(FileStorageService storage, FileService fileService) {
//        this.storage = storage;
//        this.fileService = fileService;
//    } //@RequiredArgsConstructor로 대치

    // 단일 업로드: 파일을 user.home/LERMES/files 폴더에 저장하고 저장된 파일명을 반환
    // TODO me로 me.getCompanyId() 이런거 가져와서 파일에 사용자 소속 company 넣어버리기
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public UploadResultDTO upload(@AuthenticationPrincipal AuthCustomUserDetails me,
                                  @RequestPart("file") MultipartFile file,
                                  @RequestParam(value="formUuid", required=false) String formUuid) {
        Integer userSn = (me != null) ? Math.toIntExact(me.getId()) : null; //로그인한경우 usersn집어넣음
        Integer coSn   = (me != null && me.getCompanyId() != null) ? Math.toIntExact(me.getCompanyId()) : null; //회사넘버는 없을수도있는데 있으면 집어넣음
        return fileService.save(file, userSn, coSn, formUuid);
    }

    // 다중 업로드
    // TODO me로 me.getCompanyId() 이런거 가져와서 파일에 사용자 소속 company 넣어버리기
    @PostMapping(path = "/batch", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public List<UploadResultDTO> uploadBatch(@AuthenticationPrincipal AuthCustomUserDetails me,
                                             @RequestPart("files") List<MultipartFile> files,
                                             @RequestParam(value="formUuid", required=false) String formUuid) {
        Integer userSn = (me != null) ? Math.toIntExact(me.getId()) : null; //로그인한경우 usersn집어넣음
        Integer coSn   = (me != null && me.getCompanyId() != null) ? Math.toIntExact(me.getCompanyId()) : null; //회사넘버는 없을수도있는데 있으면 집어넣음
        return fileService.saveBatch(files, userSn, coSn, formUuid);
    }

    // 다운로드 (attachment)
    @GetMapping("/{storedFileName}/download")
    public ResponseEntity<Resource> download(@PathVariable String storedFileName,
                                             @RequestParam(value = "original", required = false) String original) {
        Resource r = storage.loadAsResource(storedFileName);
        Path p = storage.resolveFilename(storedFileName);
        String contentType = storage.detectContentType(p);
        String filename = original != null && !original.isBlank() ? original : storedFileName;
        String encoded = URLEncoder.encode(filename, StandardCharsets.UTF_8).replaceAll("\\+", "%20");
        long len;
        try {
            len = Files.size(p);
        } catch (Exception e) {
            len = -1L;
        }
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + encoded + "\"")
                .contentType(MediaType.parseMediaType(contentType))
                .contentLength(Math.max(0, len))
                .body(r);
    }

    // 파일 SN으로 원본 파일명 조회
    @GetMapping("/id/{fileSn}/name")
    public ResponseEntity<?> getOriginalName(@PathVariable int fileSn) {
        var meta = fileService.getMeta(fileSn);
        if (meta == null || (meta.getDelYn() != null && meta.getDelYn() == 1)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(java.util.Map.of(
                "fileSn", meta.getFileSn(),
                "originalFileName", meta.getOrgnlFileNm()
        ));
    }

    // 파일 SN으로 다운로드 (attachment)
    @GetMapping("/id/{fileSn}/download")
    public ResponseEntity<Resource> downloadById(@PathVariable int fileSn) {
        var meta = fileService.getMeta(fileSn);
        if (meta == null || (meta.getDelYn() != null && meta.getDelYn() == 1)) {
            return ResponseEntity.notFound().build();
        }
        String storedFileName = meta.getStrgFileNm();
        String original = meta.getOrgnlFileNm();

        Resource r = storage.loadAsResource(storedFileName);
        Path p = storage.resolveFilename(storedFileName);
        String contentType = storage.detectContentType(p);
        String filename = (original != null && !original.isBlank()) ? original : storedFileName;
        String encoded = URLEncoder.encode(filename, StandardCharsets.UTF_8).replaceAll("\\+", "%20");
        long len;
        try {
            len = Files.size(p);
        } catch (Exception e) {
            len = -1L;
        }
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + encoded + "\"")
                .contentType(MediaType.parseMediaType(contentType))
                .contentLength(Math.max(0, len))
                .body(r);
    }
}
