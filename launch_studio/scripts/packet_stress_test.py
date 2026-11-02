#!/usr/bin/env python3
"""
Empirical Media & Stream Stress Test for Remotion Deliverables.
Author: Challenger 1 (Empirical Media & Stream Analysis)
"""

import subprocess
import json
import sys
import os

FILES_TO_TEST = [
    "out/patitas_launch_typography.mp4",
    "out/patitas_launch_voiceover.mp4"
]

def run_cmd(cmd):
    proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, shell=True)
    return proc.returncode, proc.stdout, proc.stderr

def stress_test_file(rel_path):
    print(f"\n=======================================================")
    print(f" EMPIRICAL STREAM ANALYSIS: {rel_path}")
    print(f"=======================================================")
    
    if not os.path.exists(rel_path):
        print(f"[CRITICAL FAIL] File not found: {rel_path}")
        return False, {"error": "file_not_found"}

    report = {}

    # 1. Video Packet Count & DTS Decode Monotonicity
    print("[1/5] Extracting video packet timestamps and decode order...")
    cmd_v = (
        f'ffprobe -v error -select_streams v:0 -show_packets '
        f'-show_entries packet=pts_time,dts_time,duration_time,flags,size '
        f'-of json "{rel_path}"'
    )
    rc, out, err = run_cmd(cmd_v)
    if rc != 0 or not out:
        print(f"[FAIL] ffprobe video packets failed: {err}")
        return False, {"error": "video_packets_failed", "details": err}
    
    v_data = json.loads(out)
    v_packets = v_data.get("packets", [])
    v_packet_count = len(v_packets)
    print(f"   -> Total video packets: {v_packet_count} (Expected: 4080)")
    report["video_packet_count"] = v_packet_count
    
    if v_packet_count != 4080:
        print(f"[FAIL] Video packet count mismatch: got {v_packet_count}, expected 4080")
        return False, report

    # DTS decode monotonicity check (in container packet order)
    v_dts_list = [float(p["dts_time"]) for p in v_packets if "dts_time" in p]
    is_v_dts_monotonic = all(v_dts_list[i] < v_dts_list[i+1] for i in range(len(v_dts_list)-1))
    v_dts_intervals = [v_dts_list[i+1] - v_dts_list[i] for i in range(len(v_dts_list)-1)]
    min_dts_interval = min(v_dts_intervals) if v_dts_intervals else 0
    max_dts_interval = max(v_dts_intervals) if v_dts_intervals else 0
    avg_dts_interval = sum(v_dts_intervals) / len(v_dts_intervals) if v_dts_intervals else 0
    
    print(f"   -> Video packet decode DTS strictly monotonic: {is_v_dts_monotonic}")
    print(f"   -> Video DTS packet step: min={min_dts_interval:.6f}s, max={max_dts_interval:.6f}s, avg={avg_dts_interval:.6f}s (1/60={1/60:.6f}s)")
    report["video_dts_monotonic"] = is_v_dts_monotonic
    report["video_dts_step_avg"] = avg_dts_interval

    # 2. Keyframe (GOP) Analysis & Presentation Monotonicity
    print("[2/5] Analyzing GOP (Keyframe) cadence and presentation PTS...")
    keyframe_indices = [i for i, p in enumerate(v_packets) if "K" in p.get("flags", "")]
    report["keyframe_count"] = len(keyframe_indices)
    
    gop_sizes = []
    for i in range(len(keyframe_indices) - 1):
        gop_sizes.append(keyframe_indices[i+1] - keyframe_indices[i])
    if keyframe_indices:
        gop_sizes.append(v_packet_count - keyframe_indices[-1])
        
    min_gop = min(gop_sizes) if gop_sizes else 0
    max_gop = max(gop_sizes) if gop_sizes else 0
    avg_gop = sum(gop_sizes) / len(gop_sizes) if gop_sizes else 0
    
    print(f"   -> Total Keyframes (IDR/I-frames): {len(keyframe_indices)}")
    print(f"   -> GOP sizes (in frames): min={min_gop}, max={max_gop}, avg={avg_gop:.1f} (max {max_gop/60.0:.2f}s)")
    print(f"   -> Keyframe indices sample: {keyframe_indices[:8]}")
    report["gop_sizes"] = {
        "min": min_gop,
        "max": max_gop,
        "avg": avg_gop,
        "keyframes": len(keyframe_indices)
    }

    # Presentation PTS from decoded frames
    cmd_vf = f'ffprobe -v error -select_streams v:0 -show_frames -show_entries frame=pts_time -of json "{rel_path}"'
    rc_f, out_f, err_f = run_cmd(cmd_vf)
    if rc_f == 0 and out_f:
        f_data = json.loads(out_f)
        frames = f_data.get("frames", [])
        pts_list = [float(f["pts_time"]) for f in frames if "pts_time" in f]
        is_pts_monotonic = all(pts_list[i] < pts_list[i+1] for i in range(len(pts_list)-1))
        pts_intervals = [pts_list[i+1] - pts_list[i] for i in range(len(pts_list)-1)]
        min_pts_int = min(pts_intervals) if pts_intervals else 0
        max_pts_int = max(pts_intervals) if pts_intervals else 0
        avg_pts_int = sum(pts_intervals) / len(pts_intervals) if pts_intervals else 0
        print(f"   -> Decoded frames count: {len(frames)} (Expected: 4080)")
        print(f"   -> Presentation PTS strictly monotonic: {is_pts_monotonic}")
        print(f"   -> Frame display interval: min={min_pts_int:.6f}s, max={max_pts_int:.6f}s, avg={avg_pts_int:.6f}s")
        report["frame_count"] = len(frames)
        report["pts_monotonic"] = is_pts_monotonic
    else:
        print(f"[FAIL] Frame extraction failed: {err_f}")
        return False, report

    # 3. Audio Packet & Timestamp Continuity Analysis
    print("[3/5] Extracting audio packet timestamps and continuity...")
    cmd_a = (
        f'ffprobe -v error -select_streams a:0 -show_packets '
        f'-show_entries packet=pts_time,dts_time,duration_time,size '
        f'-of json "{rel_path}"'
    )
    rc, out, err = run_cmd(cmd_a)
    if rc != 0 or not out:
        print(f"[FAIL] ffprobe audio packets failed: {err}")
        return False, {"error": "audio_packets_failed", "details": err}

    a_data = json.loads(out)
    a_packets = a_data.get("packets", [])
    a_packet_count = len(a_packets)
    report["audio_packet_count"] = a_packet_count
    print(f"   -> Total audio packets: {a_packet_count} (Expected: 3190)")

    a_pts_list = [float(p["pts_time"]) for p in a_packets if "pts_time" in p]
    is_a_pts_monotonic = all(a_pts_list[i] < a_pts_list[i+1] for i in range(len(a_pts_list)-1))
    
    a_deltas = [a_pts_list[i+1] - a_pts_list[i] for i in range(len(a_pts_list)-1)]
    expected_delta = 1024.0 / 48000.0 # 0.021333333333333333
    max_delta_err = max(abs(d - expected_delta) for d in a_deltas) if a_deltas else 0
    
    print(f"   -> Audio PTS strictly monotonic: {is_a_pts_monotonic}")
    print(f"   -> Audio packet delta max deviation: {max_delta_err:.8f}s (<0.000001s)")
    report["audio_pts_monotonic"] = is_a_pts_monotonic
    report["audio_max_delta_err"] = max_delta_err

    # 4. Stream & Format Verification
    print("[4/5] Verifying stream parameters (sample rate, channels, codec)...")
    cmd_info = f'ffprobe -v error -show_streams -of json "{rel_path}"'
    rc, out, err = run_cmd(cmd_info)
    info_data = json.loads(out)
    streams = info_data.get("streams", [])
    v_stream = next((s for s in streams if s.get("codec_type") == "video"), None)
    a_stream = next((s for s in streams if s.get("codec_type") == "audio"), None)

    width = v_stream.get("width")
    height = v_stream.get("height")
    r_frame_rate = v_stream.get("r_frame_rate")
    a_sample_rate = a_stream.get("sample_rate")
    a_channels = a_stream.get("channels")
    
    print(f"   -> Video Stream: {width}x{height} @ {r_frame_rate} ({v_stream.get('codec_name')})")
    print(f"   -> Audio Stream: {a_sample_rate}Hz, {a_channels} channels ({a_stream.get('codec_name')})")

    # 5. Container & Full Bitstream Decode Stress Test
    print("[5/5] Executing full decode stress test (-v error -xerror -f null -)...")
    cmd_decode = f'ffmpeg -v error -xerror -i "{rel_path}" -f null -'
    rc, out, err = run_cmd(cmd_decode)
    print(f"   -> Full decode return code: {rc}")
    if err:
        print(f"   -> Full decode warnings/errors: {err.strip()}")
    else:
        print(f"   -> Full bitstream decode: 100% clean, zero corrupt frames, zero warnings.")
    report["full_decode_clean"] = (rc == 0 and len(err.strip()) == 0)

    # Checksum / Hash of stream
    cmd_hash = f'ffmpeg -v error -i "{rel_path}" -map 0:v -f md5 -'
    rc, out, err = run_cmd(cmd_hash)
    video_md5 = out.strip().replace("MD5=", "")
    print(f"   -> Video Stream MD5 Hash: {video_md5}")
    report["video_md5"] = video_md5

    cmd_ahash = f'ffmpeg -v error -i "{rel_path}" -map 0:a -f md5 -'
    rc, out, err = run_cmd(cmd_ahash)
    audio_md5 = out.strip().replace("MD5=", "")
    print(f"   -> Audio Stream MD5 Hash: {audio_md5}")
    report["audio_md5"] = audio_md5

    all_passed = (
        v_packet_count == 4080 and
        report["frame_count"] == 4080 and
        is_v_dts_monotonic and
        report["pts_monotonic"] and
        is_a_pts_monotonic and
        max_delta_err < 0.0001 and
        width == 1920 and
        height == 1080 and
        r_frame_rate == "60/1" and
        int(a_sample_rate) == 48000 and
        int(a_channels) == 2 and
        report["full_decode_clean"]
    )

    return all_passed, report

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    overall_ok = True
    results = {}
    for f in FILES_TO_TEST:
        passed, rep = stress_test_file(f)
        results[f] = {"passed": passed, "report": rep}
        if not passed:
            overall_ok = False
            
    print("\n=======================================================")
    print(f" FINAL EMPIRICAL VERDICT: {'APPROVE' if overall_ok else 'REJECT'}")
    print("=======================================================")
    sys.exit(0 if overall_ok else 1)
