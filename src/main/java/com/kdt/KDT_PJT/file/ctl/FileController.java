package com.kdt.KDT_PJT.file.ctl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class FileController {

//    private final FileService fileService;
//
//    public FileController(FileService fileService) {
//        this.fileService = fileService;
//    }
//
//    // 단일 업로드
//    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    public UploadResultDTO upload(@RequestPart("file") MultipartFile file,
//                                  @RequestParam(value = "userSn", required = false) Integer userSn,
//                                  @RequestParam(value = "coSn", required = false) Integer coSn) {
//        return fileService.save(file, userSn, coSn);
//    }
//
//    // 배치 업로드
//    @PostMapping(path = "/batch", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    public List<UploadResultDTO> uploadBatch(@RequestPart("files") List<MultipartFile> files,
//                                             @RequestParam(value = "userSn", required = false) Integer userSn,
//                                             @RequestParam(value = "coSn", required = false) Integer coSn) {
//        return fileService.saveBatch(files, userSn, coSn);
//    }
//
//    // 다운로드 (attachment)
//    @GetMapping("/{id}/download")
//    public ResponseEntity<Resource> download(@PathVariable("id") int fileSn) {
//        var dl = fileService.loadAsResource(fileSn);
//        String encoded = java.net.URLEncoder.encode(dl.getOriginalFileName(), StandardCharsets.UTF_8)
//                .replaceAll("\\+", "%20");
//        return ResponseEntity.ok()
//                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + encoded + "\"")
//                .contentType(MediaType.parseMediaType(dl.getContentType()))
//                .contentLength(dl.getContentLength())
//                .body(dl.getResource());
//    }
//
//    // 프리뷰 (inline)
//    @GetMapping("/{id}/preview")
//    public ResponseEntity<Resource> preview(@PathVariable("id") int fileSn) {
//        var dl = fileService.loadAsResource(fileSn);
//        String encoded = java.net.URLEncoder.encode(dl.getOriginalFileName(), StandardCharsets.UTF_8)
//                .replaceAll("\\+", "%20");
//        return ResponseEntity.ok()
//                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + encoded + "\"")
//                .contentType(MediaType.parseMediaType(dl.getContentType()))
//                .contentLength(dl.getContentLength())
//                .body(dl.getResource());
//    }
//
//    // 논리 삭제
//    @DeleteMapping("/{id}")
//    public void delete(@PathVariable("id") int fileSn) {
//        fileService.logicalDelete(fileSn);
//    }
}
