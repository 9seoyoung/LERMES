package com.kdt.KDT_PJT.file.service;

import com.kdt.KDT_PJT.file.util.StoragePaths;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Objects;
import java.util.UUID;

@Service
public class FileStorageService {
    private final Path base = StoragePaths.root();

    public void ensureBaseDir() {
        try {
            Files.createDirectories(base);
        } catch (IOException e) {
            throw new RuntimeException("cannot create base dir: " + base, e);
        }
    }

    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) throw new IllegalArgumentException("file is required");
        ensureBaseDir();
        String original = Objects.requireNonNullElse(file.getOriginalFilename(), "file");
        String ext = extractExt(original);
        String stored = genRandomName(ext);
        Path target = resolveFilename(stored);
        try {
            Files.copy(file.getInputStream(), target);
        } catch (IOException e) {
            throw new RuntimeException("copy failed to: " + target, e);
        }
        return stored;
    }

    public Path resolveFilename(String storedFileName) {
        Path target = base.resolve(storedFileName).normalize();
        if (!target.startsWith(base)) throw new SecurityException("Path traversal");
        return target;
    }

    public Resource loadAsResource(String storedFileName) {
        Path p = resolveFilename(storedFileName);
        if (!Files.exists(p)) throw new RuntimeException("file not found: " + storedFileName);
        return new FileSystemResource(p);
    }

    public String detectContentType(Path p) {
        try {
            String type = Files.probeContentType(p);
            return type != null ? type : MediaType.APPLICATION_OCTET_STREAM_VALUE;
        } catch (IOException e) {
            return MediaType.APPLICATION_OCTET_STREAM_VALUE;
        }
    }

    private static String genRandomName(String ext) {
        String base = UUID.randomUUID().toString().replace("-", "");
        return (ext == null || ext.isBlank()) ? base : base + "." + ext.toLowerCase();
    }

    private static String extractExt(String filename) {
        int i = filename.lastIndexOf('.');
        if (i < 0 || i == filename.length() - 1) return null;
        return filename.substring(i + 1);
    }
}