const tracks: { audio: MediaStreamTrack | null; video: MediaStreamTrack | null } = {
  audio: null,
  video: null,
};

const urls = new Map<string, string>();

export function rememberFile(id: string, file: File) {
  const previous = urls.get(id);
  if (previous) URL.revokeObjectURL(previous);
  const url = URL.createObjectURL(file);
  urls.set(id, url);
  return url;
}

export function fileUrl(id: string) {
  return urls.get(id) ?? null;
}

export function forgetFile(id: string) {
  const url = urls.get(id);
  if (url) URL.revokeObjectURL(url);
  urls.delete(id);
}

export function localTracks() {
  return tracks;
}

export function stopCallTracks() {
  tracks.audio?.stop();
  tracks.video?.stop();
  tracks.audio = null;
  tracks.video = null;
}

export function setTrackEnabled(kind: "audio" | "video", enabled: boolean) {
  const track = tracks[kind];
  if (track) track.enabled = enabled;
}

export function explainMediaError(error: unknown, device: "microphone" | "camera") {
  if (error instanceof DOMException) {
    if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
      return `${device[0]?.toUpperCase() ?? ""}${device.slice(1)} permission was denied.`;
    }
    if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
      return `No ${device} was found.`;
    }
    if (error.name === "NotReadableError") return `The ${device} is unavailable.`;
  }
  return `Couldn’t use the ${device}.`;
}

export async function captureMedia(audio: boolean, video: boolean) {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: audio ? { echoCancellation: true } : false,
    video: video ? { facingMode: "user" } : false,
  });
  if (audio) {
    tracks.audio?.stop();
    tracks.audio = stream.getAudioTracks()[0] ?? null;
  } else {
    stream.getAudioTracks().forEach((track) => track.stop());
  }
  if (video) {
    tracks.video?.stop();
    tracks.video = stream.getVideoTracks()[0] ?? null;
  } else {
    stream.getVideoTracks().forEach((track) => track.stop());
  }
  return tracks;
}
