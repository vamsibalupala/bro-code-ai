package com.bro.app.recording;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bro.app.R;
import com.google.android.material.card.MaterialCardView;
import com.google.android.material.floatingactionbutton.FloatingActionButton;

import java.util.List;

/**
 * SavedRecordingsAdapter
 *
 * RecyclerView.Adapter for binding encrypted call recordings to card items.
 * Uses MaterialCardView with deep charcoal background (#1C1C1C) and displays
 * date, duration, call type, encryption tag, and an interactive play FAB.
 */
public class SavedRecordingsAdapter extends RecyclerView.Adapter<SavedRecordingsAdapter.RecordingViewHolder> {

    public interface OnRecordingInteractionListener {
        void onPlayRecording(SavedRecording recording, int position);
        void onDeleteRecording(SavedRecording recording, int position);
        void onExportRecording(SavedRecording recording);
    }

    private final Context context;
    private final List<SavedRecording> recordingsList;
    private final OnRecordingInteractionListener listener;
    private String currentlyPlayingId = null;

    public SavedRecordingsAdapter(Context context, List<SavedRecording> recordingsList,
                                  OnRecordingInteractionListener listener) {
        this.context = context;
        this.recordingsList = recordingsList;
        this.listener = listener;
    }

    public void setCurrentlyPlayingId(String id) {
        this.currentlyPlayingId = id;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public RecordingViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_saved_recording, parent, false);
        return new RecordingViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull RecordingViewHolder holder, int position) {
        SavedRecording item = recordingsList.get(position);

        holder.tvCallerName.setText(item.getPartnerName());
        holder.tvDate.setText(item.getFormattedDate());
        holder.tvDuration.setText(item.getFormattedDuration());
        holder.tvFileSize.setText(item.getFormattedSize());
        holder.tvCallType.setText(item.isVideo() ? "4K Video Call" : "HD Voice Call");

        boolean isPlaying = item.getId().equals(currentlyPlayingId);
        if (isPlaying) {
            holder.btnPlay.setImageResource(android.R.drawable.ic_media_pause);
            holder.cardRecording.setStrokeColor(0xFFA9003D); // Deep burgundy glow
            holder.cardRecording.setCardBackgroundColor(0xFF22181C);
        } else {
            holder.btnPlay.setImageResource(android.R.drawable.ic_media_play);
            holder.cardRecording.setStrokeColor(0xFF2E2E2E);
            holder.cardRecording.setCardBackgroundColor(0xFF1C1C1C);
        }

        holder.btnPlay.setOnClickListener(v -> {
            if (listener != null) {
                listener.onPlayRecording(item, holder.getAdapterPosition());
            }
        });

        holder.cardRecording.setOnClickListener(v -> {
            Toast.makeText(context, "Encrypted File: " + item.getFileName() + "\nKey: " + item.getEncryptionKeyFingerprint(), Toast.LENGTH_SHORT).show();
        });

        holder.cardRecording.setOnLongClickListener(v -> {
            if (listener != null) {
                listener.onExportRecording(item);
            }
            return true;
        });
    }

    @Override
    public int getItemCount() {
        return recordingsList != null ? recordingsList.size() : 0;
    }

    static class RecordingViewHolder extends RecyclerView.ViewHolder {
        MaterialCardView cardRecording;
        ImageView ivAvatar;
        ImageView ivE2eeBadge;
        TextView tvCallerName;
        TextView tvDate;
        TextView tvDuration;
        TextView tvCallType;
        TextView tvFileTag;
        TextView tvFileSize;
        FloatingActionButton btnPlay;

        public RecordingViewHolder(@NonNull View itemView) {
            super(itemView);
            cardRecording = itemView.findViewById(R.id.card_recording);
            ivAvatar = itemView.findViewById(R.id.iv_avatar);
            ivE2eeBadge = itemView.findViewById(R.id.iv_e2ee_badge);
            tvCallerName = itemView.findViewById(R.id.tv_caller_name);
            tvDate = itemView.findViewById(R.id.tv_date);
            tvDuration = itemView.findViewById(R.id.tv_duration);
            tvCallType = itemView.findViewById(R.id.tv_call_type);
            tvFileTag = itemView.findViewById(R.id.tv_file_tag);
            tvFileSize = itemView.findViewById(R.id.tv_file_size);
            btnPlay = itemView.findViewById(R.id.btn_play);
        }
    }
}
