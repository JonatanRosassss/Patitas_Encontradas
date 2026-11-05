#!/usr/bin/env python3
"""
Procedural Fast Modern Tech Track & Haptic SFX Generator
Inspired by:
- 'Bring Any Agent Into Any Team Chat' (rhythmic, bouncy, snappy modern tech groove)
- 'google_gemini' (fluid sparkles, radiant sweeps, ambient futuristic depth)

Sample Rate: 48000 Hz, 16-bit PCM Stereo
Duration: 32.00s exact (1,920 frames @ 60fps)
BPM: 126 BPM (Beat = 0.4762s, Bar = 1.9048s)
"""

import math
import os
import struct
import wave

SAMPLE_RATE = 48000
CHANNELS = 2
BITS_PER_SAMPLE = 16
MAX_AMP = 32767
TOTAL_DURATION = 32.0
TOTAL_SAMPLES = int(SAMPLE_RATE * TOTAL_DURATION)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUDIO_DIR = os.path.join(BASE_DIR, "public", "audio")
FAST_BGM_PATH = os.path.join(AUDIO_DIR, "bgm", "fast_modern_groove.wav")
SFX_DIR = os.path.join(AUDIO_DIR, "sfx")

os.makedirs(os.path.join(AUDIO_DIR, "bgm"), exist_ok=True)
os.makedirs(SFX_DIR, exist_ok=True)


def clamp(val, low=-1.0, high=1.0):
    return max(low, min(high, val))


def write_wav(file_path, samples_stereo):
    num_frames = len(samples_stereo)
    with wave.open(file_path, "wb") as wf:
        wf.setnchannels(CHANNELS)
        wf.setsampwidth(BITS_PER_SAMPLE // 8)
        wf.setframerate(SAMPLE_RATE)

        chunk_size = 4096
        for i in range(0, num_frames, chunk_size):
            chunk = samples_stereo[i : i + chunk_size]
            byte_data = bytearray()
            for l, r in chunk:
                l_int = int(clamp(l) * (MAX_AMP - 1))
                r_int = int(clamp(r) * (MAX_AMP - 1))
                byte_data.extend(struct.pack("<hh", l_int, r_int))
            wf.writeframes(byte_data)


# -----------------------------------------------------------------------------
# 1. INDIVIDUAL HIGH-PRECISION SFX
# -----------------------------------------------------------------------------

def gen_touch_tap():
    """Tactile haptic tap: soft sub-bass thump + crisp glass transient."""
    duration = 0.18
    num_samples = int(SAMPLE_RATE * duration)
    samples = []
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        # Glass click
        click = math.sin(2 * math.pi * 2400 * t) * math.exp(-60 * t) * 0.4
        # Mechanical pop
        pop = math.sin(2 * math.pi * (800 - 600 * t / duration) * t) * math.exp(-35 * t) * 0.5
        # Sub thump
        sub = math.sin(2 * math.pi * 85 * t) * math.exp(-25 * t) * 0.4
        v = (click + pop + sub)
        samples.append((v * 0.85, v * 0.85))
    return samples


def gen_chat_pop():
    """Bubble notification pop (Facebook/WhatsApp style)."""
    duration = 0.22
    num_samples = int(SAMPLE_RATE * duration)
    samples = []
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        freq = 600 + 900 * math.exp(-15 * t)
        v = math.sin(2 * math.pi * freq * t) * math.exp(-18 * t) * 0.6
        samples.append((v * 0.7, v * 0.8))
    return samples


def gen_gemini_sparkle():
    """Gemini-style shimmering harmonic glissando with stereo width."""
    duration = 1.2
    num_samples = int(SAMPLE_RATE * duration)
    samples = []
    freqs = [1046.5, 1318.5, 1567.98, 2093.0, 2637.0, 3135.96]  # C6, E6, G6, C7, E7, G7
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        env = math.sin(math.pi * t / duration) ** 1.5
        left = 0.0
        right = 0.0
        for idx, f in enumerate(freqs):
            detune = 1.0 + 0.003 * math.sin(2 * math.pi * 4 * t + idx)
            amp = 0.15 * math.exp(-1.5 * (t - idx * 0.12)) if t >= idx * 0.12 else 0.0
            sig = math.sin(2 * math.pi * f * detune * t) * amp
            pan = (idx / len(freqs))
            left += sig * (1.0 - pan * 0.6)
            right += sig * (0.4 + pan * 0.6)
        samples.append((left * env, right * env))
    return samples


def gen_radar_ping_gemini():
    """Modern energetic radar pulse with luminous tail."""
    duration = 1.5
    num_samples = int(SAMPLE_RATE * duration)
    samples = []
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        # Low boom
        sub = math.sin(2 * math.pi * (160 - 70 * t / duration) * t) * math.exp(-4 * t) * 0.5
        # Shimmer ring
        ring1 = math.sin(2 * math.pi * 1760 * t) * math.exp(-3.5 * t) * 0.3
        ring2 = math.sin(2 * math.pi * 2200 * t) * math.exp(-4.2 * t) * 0.2
        v = sub + ring1 + ring2
        samples.append((v * 0.9, v * 0.95))
    return samples


# -----------------------------------------------------------------------------
# 2. FULL 32.0s MODERN TECH-HOUSE GROOVE (BPM 126)
# -----------------------------------------------------------------------------

def synthesize_fast_modern_groove():
    """
    Synthesizes a 32s modern tech track inspired by Bring Any Agent:
    - Tight modern kick drum with sub-body
    - Crisp off-beat claps and acoustic snap
    - Rolling 16th-note shaker & closed hats
    - Deep, bouncy synth bassline (F minor -> Ab -> Bb -> C)
    - Warm electric keys / synth plucks with stereo delay
    - Dynamic energy riser at 6.0s (into App reveal) and 27.5s (into Payoff)
    """
    bpm = 126.0
    beat_dur = 60.0 / bpm          # 0.47619 s
    sixteenth = beat_dur / 4.0      # 0.11905 s

    # Pre-generate kick buffer (0.35s)
    kick_len = int(SAMPLE_RATE * 0.35)
    kick_buf = []
    for i in range(kick_len):
        t = i / SAMPLE_RATE
        # Pitch drop 180Hz -> 48Hz
        freq = 48 + 140 * math.exp(-28 * t)
        body = math.sin(2 * math.pi * freq * t) * math.exp(-10 * t) * 0.95
        click = math.sin(2 * math.pi * 1800 * t) * math.exp(-120 * t) * 0.4
        kick_buf.append(clamp(body + click))

    # Pre-generate clap buffer (0.28s)
    clap_len = int(SAMPLE_RATE * 0.28)
    clap_buf = []
    import random
    rng = random.Random(42)
    noise = [rng.uniform(-1.0, 1.0) for _ in range(clap_len)]
    for i in range(clap_len):
        t = i / SAMPLE_RATE
        env = math.exp(-18 * t)
        # Pre-burst claps
        if t < 0.03:
            env *= (math.sin(2 * math.pi * 30 * t) ** 2) * 1.5
        filt = (noise[i] * 0.7 + math.sin(2 * math.pi * 1200 * t) * 0.3) * env
        clap_buf.append(clamp(filt * 0.75))

    # Pre-generate hat buffer (0.08s)
    hat_len = int(SAMPLE_RATE * 0.08)
    hat_buf = []
    for i in range(hat_len):
        t = i / SAMPLE_RATE
        env = math.exp(-55 * t)
        val = rng.uniform(-1.0, 1.0) * env * 0.35
        hat_buf.append(val)

    # Output master buffers
    left_channel = [0.0] * TOTAL_SAMPLES
    right_channel = [0.0] * TOTAL_SAMPLES

    total_beats = int(TOTAL_DURATION / beat_dur)

    # Bassline notes (F1=43.65, Ab1=51.91, Bb1=58.27, C2=65.41, Eb2=77.78)
    bass_prog = [
        43.65, 43.65, 43.65, 51.91,  # Bar 1
        58.27, 58.27, 65.41, 51.91,  # Bar 2
        43.65, 43.65, 43.65, 77.78,  # Bar 3
        58.27, 58.27, 65.41, 43.65,  # Bar 4
    ]

    chord_freqs = [
        [174.61, 261.63, 311.13, 392.00], # Fm9
        [207.65, 261.63, 311.13, 415.30], # Abmaj7
        [233.08, 293.66, 349.23, 466.16], # Bb7
        [261.63, 329.63, 392.00, 523.25], # C7
    ]

    # --- Render Drums & Bass on the Timeline ---
    for b in range(total_beats):
        beat_time = b * beat_dur
        beat_idx = int(beat_time * SAMPLE_RATE)
        bar_idx = b // 4
        beat_in_bar = b % 4

        # Section intensity
        is_intro = (beat_time < 6.0)     # Tension phase (chaotic groups)
        is_buildup = (5.5 <= beat_time <= 6.5) or (26.5 <= beat_time <= 27.5)
        is_breakdown = (20.5 <= beat_time < 22.0)
        is_climax = (27.5 <= beat_time <= 31.0)

        # 1. KICK DRUM:
        # Intro: kick on beat 1 and 3
        # Main groove: kick on 1, 2, 3, 4 (pumping four-on-the-floor)
        play_kick = True
        if is_intro:
            play_kick = (beat_in_bar in [0, 2])
        if is_buildup:
            play_kick = True

        if play_kick and beat_idx + kick_len < TOTAL_SAMPLES:
            k_gain = 0.85 if not is_intro else 0.7
            for i in range(kick_len):
                left_channel[beat_idx + i] += kick_buf[i] * k_gain
                right_channel[beat_idx + i] += kick_buf[i] * k_gain

        # 2. CLAP: on beats 2 and 4 (skip during intro bar 1-2)
        if beat_time >= 3.8 and (beat_in_bar in [1, 3]) and not is_breakdown:
            if beat_idx + clap_len < TOTAL_SAMPLES:
                for i in range(clap_len):
                    left_channel[beat_idx + i] += clap_buf[i] * 0.72
                    right_channel[beat_idx + i] += clap_buf[i] * 0.72

        # 3. HI-HATS: 16th notes
        if beat_time >= 5.5:
            for s in range(4):
                hat_t = beat_time + s * sixteenth
                hat_i = int(hat_t * SAMPLE_RATE)
                if hat_i + hat_len < TOTAL_SAMPLES:
                    h_gain = 0.4 if (s % 2 == 1) else 0.22
                    if s == 2:  # Offbeat open feel
                        h_gain = 0.55
                    for i in range(hat_len):
                        # Subtle stereo ping-pong
                        p = 0.8 if s % 2 == 0 else 1.2
                        left_channel[hat_i + i] += hat_buf[i] * h_gain * (2.0 - p)
                        right_channel[hat_i + i] += hat_buf[i] * h_gain * p

        # 4. BASSLINE: Off-beat bouncing 16ths
        if not is_intro and not is_breakdown:
            note_idx = (b % len(bass_prog))
            base_f = bass_prog[note_idx]
            # Play on 16th notes [1, 2, 3] of the beat (classic bouncy rolling bass)
            for sub_b in [1, 2, 3]:
                bass_t = beat_time + sub_b * sixteenth
                bass_i = int(bass_t * SAMPLE_RATE)
                bass_note_len = int(SAMPLE_RATE * sixteenth * 0.85)
                if bass_i + bass_note_len < TOTAL_SAMPLES:
                    for i in range(bass_note_len):
                        t_b = i / SAMPLE_RATE
                        env = math.exp(-14 * t_b)
                        saw = (2.0 * ((base_f * t_b) % 1.0) - 1.0)
                        sq = 1.0 if (base_f * t_b % 1.0) < 0.5 else -1.0
                        b_val = (saw * 0.6 + sq * 0.4) * env * 0.45
                        left_channel[bass_i + i] += b_val * 0.8
                        right_channel[bass_i + i] += b_val * 0.8

        # 5. SYNTH CHORDS / PLUCKS (Bring Any Agent style warm keys)
        if beat_in_bar == 0 or (beat_time >= 7.5 and beat_in_bar == 2):
            chord_idx = bar_idx % len(chord_freqs)
            curr_chord = chord_freqs[chord_idx]
            c_len = int(SAMPLE_RATE * (beat_dur * 1.5))
            if beat_idx + c_len < TOTAL_SAMPLES:
                for i in range(c_len):
                    t_c = i / SAMPLE_RATE
                    c_env = math.exp(-4.5 * t_c) * (1.0 - math.exp(-50 * t_c))
                    sig_l = 0.0
                    sig_r = 0.0
                    for c_i, cf in enumerate(curr_chord):
                        tone = math.sin(2 * math.pi * cf * t_c) * 0.08
                        harmonic = math.sin(2 * math.pi * cf * 2.0 * t_c) * 0.03
                        sig_l += (tone + harmonic) * (1.0 if c_i % 2 == 0 else 0.6)
                        sig_r += (tone + harmonic) * (0.6 if c_i % 2 == 0 else 1.0)
                    left_channel[beat_idx + i] += sig_l * c_env * 0.9
                    right_channel[beat_idx + i] += sig_r * c_env * 0.9

    # 6. ENERGETIC TRANSITIONS & RISERS:
    # Build-up riser into App Reveal (t = 4.5s to 6.5s)
    r1_start = int(4.5 * SAMPLE_RATE)
    r1_len = int(2.0 * SAMPLE_RATE)
    for i in range(r1_len):
        t = i / SAMPLE_RATE
        env = (t / 2.0) ** 2
        f = 200 + 1200 * (t / 2.0) ** 1.5
        noise = rng.uniform(-0.15, 0.15)
        sweep = (math.sin(2 * math.pi * f * t) * 0.25 + noise) * env
        left_channel[r1_start + i] += sweep * 0.7
        right_channel[r1_start + i] += sweep * 0.85

    # Build-up riser into Payoff (t = 25.5s to 27.5s)
    r2_start = int(25.5 * SAMPLE_RATE)
    r2_len = int(2.0 * SAMPLE_RATE)
    for i in range(r2_len):
        t = i / SAMPLE_RATE
        env = (t / 2.0) ** 2
        f = 300 + 1800 * (t / 2.0) ** 1.5
        sweep = (math.sin(2 * math.pi * f * t) * 0.28) * env
        left_channel[r2_start + i] += sweep * 0.85
        right_channel[r2_start + i] += sweep * 0.7

    # Master Fade Out in last 1.5 seconds
    fade_start = int((TOTAL_DURATION - 1.5) * SAMPLE_RATE)
    fade_len = int(1.5 * SAMPLE_RATE)
    for i in range(fade_len):
        idx = fade_start + i
        if idx < TOTAL_SAMPLES:
            fade_gain = (1.0 - i / fade_len)
            left_channel[idx] *= fade_gain
            right_channel[idx] *= fade_gain

    # Interleave to stereo
    master_samples = []
    for i in range(TOTAL_SAMPLES):
        l = clamp(left_channel[i] * 0.85)
        r = clamp(right_channel[i] * 0.85)
        master_samples.append((l, r))

    return master_samples


def main():
    print("--- Generando Audio Rápido & Dinámico (Bring Any Agent / Gemini Style) ---")
    
    # 1. SFX
    print("1. Sintetizando SFX táctiles y Gemini...")
    write_wav(os.path.join(SFX_DIR, "touch_tap.wav"), gen_touch_tap())
    write_wav(os.path.join(SFX_DIR, "chat_pop.wav"), gen_chat_pop())
    write_wav(os.path.join(SFX_DIR, "gemini_sparkle.wav"), gen_gemini_sparkle())
    write_wav(os.path.join(SFX_DIR, "radar_ping_gemini.wav"), gen_radar_ping_gemini())

    # 2. Master Fast Track (32.0s)
    print("2. Sintetizando Modern Tech Groove a 126 BPM (32.0s exactos)...")
    bgm_samples = synthesize_fast_modern_groove()
    write_wav(FAST_BGM_PATH, bgm_samples)

    print(f"[OK] Archivos generados con éxito en {AUDIO_DIR}!")


if __name__ == "__main__":
    main()
