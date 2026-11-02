/**
 * Remotion Configuration for Patitas Encontradas Launch Studio
 * Configured for deterministic 1080p 60fps rendering on Windows 11 host.
 */
import { Config } from '@remotion/cli/config';

// Concurrency limited to 4 workers to preserve memory on 16GB host
Config.setConcurrency(4);

// Target pre-installed 64-bit Google Chrome executable to avoid web downloads
Config.setBrowserExecutable('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe');

// Hardware acceleration using ANGLE on Windows GPU (NVIDIA RTX 3050 / Intel UHD)
Config.setChromiumOpenGlRenderer('angle');

// Strict broadcast audio sample rate
Config.setSampleRate(48000);

// Frame capture format & quality for preview/intermediate renders
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(90);

// Video encoding standards
Config.setCodec('h264');
Config.setPixelFormat('yuv420p');
Config.setCrf(18);

// Overwrite existing outputs without prompting
Config.setOverwriteOutput(true);
