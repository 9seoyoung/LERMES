package com.kdt.KDT_PJT.file.util;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;

public final class StoragePaths {
    private StoragePaths() {}

    /** 물리 루트: user.home/lermes */
    public static Path root() {
        String home = System.getProperty("user.home");
        return Paths.get(home, "lermes").toAbsolutePath().normalize();
    }

    /** STRG_FILE_PATH 생성 (회사/개인) */
    public static String buildStrgPath(Integer coSn, Integer userSn, LocalDate d) {
        String yyyy = "%04d".formatted(d.getYear());
        String mm   = "%02d".formatted(d.getMonthValue());
        String dd   = "%02d".formatted(d.getDayOfMonth());
        if (coSn != null)   return String.join("/", "co", String.valueOf(coSn), yyyy, mm, dd);
        if (userSn != null) return String.join("/", "user", String.valueOf(userSn), yyyy, mm, dd);
        throw new IllegalArgumentException("CO_SN 또는 USER_SN 중 하나는 필수");
    }

    /** 실제 파일 절대경로 = root/STRG_FILE_PATH/STRG_FILE_NM */
    public static Path resolveAbsolute(String strgFilePath, String strgFileNm) {
        Path base = root();
        Path target = base.resolve(strgFilePath).resolve(strgFileNm).normalize();
        if (!target.startsWith(base)) throw new SecurityException("Path traversal");
        return target;
    }
}
