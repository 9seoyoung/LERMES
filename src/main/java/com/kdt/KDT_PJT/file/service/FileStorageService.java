package com.kdt.KDT_PJT.file.service;

import com.kdt.KDT_PJT.cmmn.dao.CmmnDao;
import com.kdt.KDT_PJT.file.util.StoragePaths;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;

@Service
public class FileStorageService {
//    private final Path base;
//
//    public FileStorageService() {
//        this.base = StoragePaths.root();
//    }
//
//    public void ensureBaseDir() {
//        try {
//            Files.createDirectories(base);
//        } catch (IOException e) {
//            throw new FileAccessException("cannot create base dir: " + base, e);
//        }
//    }
//
//    public Path resolve(String strgFilePath, String strgFileNm) {
//        // 단일 폴더 정책: strgFilePath는 ""(빈문자열)
//        Path target = base.resolve(strgFileNm).normalize();
//        if (!target.startsWith(base)) throw new SecurityException("Path traversal");
//        return target;
//    }
//
//    public void copy(MultipartFile src, Path dest) {
//        try {
//            Files.copy(src.getInputStream(), dest);
//        } catch (IOException e) {
//            throw new FileAccessException("copy failed to: " + dest, e);
//        }
//    }
}