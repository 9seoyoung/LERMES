// src/services/fileService.js
import axios from "axios";

const API_BASE = "http://localhost:940/api/files";

export const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true, // 세션/쿠키 쓰면 유지
});

// ---- URL builder (미리보기/다운로드 링크 만들 때 재사용)
export const buildPreviewUrl = (storedFileName, originalName = "") =>
    `${API_BASE}/${encodeURIComponent(storedFileName)}/preview?original=${encodeURIComponent(originalName)}`;

export const buildDownloadUrl = (storedFileName, originalName = "") =>
    `${API_BASE}/${encodeURIComponent(storedFileName)}/download?original=${encodeURIComponent(originalName)}`;

// ---- 업로드 (단일/다중 공용)
export async function uploadFiles(files, { onProgress, path } = {}) {
    // path: 서버가 STRG_FILE_PATH로 받도록 선택(없으면 루트)
    const form = new FormData();
    files.forEach((f) => form.append("files", f));
    if (path) form.append("path", path);

    const { data } = await api.post("/batch", form, {
        onUploadProgress: (e) => {
            if (onProgress && e.total) onProgress(Math.round((e.loaded * 100) / e.total));
        },
    });
    // 서버: List<UploadResultDTO> 반환 가정
    return data;
}

export const uploadFile = (file, opts) => uploadFiles([file], opts).then((arr) => arr?.[0]);

// ---- 다운로드 (XHR로 받아 파일 저장)
export async function downloadByStoredName(storedFileName, originalName = "") {
    const { data, headers } = await api.get(
        `/${encodeURIComponent(storedFileName)}/download`,
        {
            params: { original: originalName },
            responseType: "blob",
        }
    );

    // 파일명 결정 (Content-Disposition 우선)
    let filename = originalName || "download";
    const cd = headers["content-disposition"];
    if (cd) {
        const m = /filename\*=UTF-8''([^;]+)|filename="([^"]+)"/i.exec(cd);
        if (m) filename = decodeURIComponent(m[1] || m[2]);
    }

    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

// ---- 미리보기(새 탭 오픈이 편함)
export function openPreview(storedFileName, originalName = "") {
    window.open(buildPreviewUrl(storedFileName, originalName), "_blank", "noopener");
}

export function openDownload(storedFileName, originalName = "") {
    window.open(buildDownloadUrl(storedFileName, originalName), "_blank", "noopener");
}

// ---- 삭제/목록 (서버 규약에 맞춰 조정)
export async function deleteById(fileSn) {
    const { data } = await api.delete(`/` + fileSn);
    return data;
}

export async function listFiles(params = {}) {
    const { data } = await api.get("/", { params });
    return data; // 예: 페이지네이션 응답
}