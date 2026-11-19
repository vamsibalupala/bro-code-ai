package com.bro.app.recording;

import java.io.File;
import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

/**
 * SavedRecording
 *
 * Model representing an end-to-end encrypted call recording file stored on the device.
 * Container: .brorec (AES-256-GCM cipher payload with hardware-backed key derivation).
 */
public class SavedRecording implements Serializable {
    private String id;
    private String fileName;
    private String partnerName;
    private String partnerAvatar;
    private long timestamp;
    private int durationSeconds;
    private long fileSizeBytes;
    private boolean isVideo;
    private String filePath;
    private String encryptionKeyFingerprint;

    public SavedRecording(String id, String fileName, String partnerName, String partnerAvatar,
                          long timestamp, int durationSeconds, long fileSizeBytes,
                          boolean isVideo, String filePath, String encryptionKeyFingerprint) {
        this.id = id;
        this.fileName = fileName;
        this.partnerName = partnerName;
        this.partnerAvatar = partnerAvatar;
        this.timestamp = timestamp;
        this.durationSeconds = durationSeconds;
        this.fileSizeBytes = fileSizeBytes;
        this.isVideo = isVideo;
        this.filePath = filePath;
        this.encryptionKeyFingerprint = encryptionKeyFingerprint;
    }

    public String getId() {
        return id;
    }

    public String getFileName() {
        return fileName;
    }

    public String getPartnerName() {
        return partnerName;
    }

    public String getPartnerAvatar() {
        return partnerAvatar;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public int getDurationSeconds() {
        return durationSeconds;
    }

    public long getFileSizeBytes() {
        return fileSizeBytes;
    }

    public boolean isVideo() {
        return isVideo;
    }

    public String getFilePath() {
        return filePath;
    }

    public String getEncryptionKeyFingerprint() {
        return encryptionKeyFingerprint;
    }

    /**
     * Formats timestamp into readable date, e.g. "Nov 12, 2:45 PM"
     */
    public String getFormattedDate() {
        SimpleDateFormat sdf = new SimpleDateFormat("MMM d, h:mm a", Locale.getDefault());
        return sdf.format(new Date(timestamp));
    }

    /**
     * Formats total seconds into MM:SS, e.g. "04:12"
     */
    public String getFormattedDuration() {
        int m = durationSeconds / 60;
        int s = durationSeconds % 60;
        return String.format(Locale.US, "%02d:%02d", m, s);
    }

    /**
     * Formats byte size into human readable string, e.g. "3.8 MB"
     */
    public String getFormattedSize() {
        if (fileSizeBytes <= 0) return "0 KB";
        if (fileSizeBytes < 1024 * 1024) {
            return String.format(Locale.US, "%.1f KB", fileSizeBytes / 1024.0);
        }
        return String.format(Locale.US, "%.1f MB", fileSizeBytes / (1024.0 * 1024.0));
    }
}
