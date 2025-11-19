// Type definitions for AudioSamplePlayer

export interface AudioSample {
  _id?: string;
  _type?: string;
  songName?: string;
  artistName?: string;
  services?: string[];
  image?: {
    asset?: { _ref?: string; _type?: string };
    alt?: string;
    hotspot?: unknown;
    crop?: unknown;
  };
  audioFile?: {
    asset?: {
      _id?: string;
      url?: string;
      mimeType?: string;
      size?: number;
      originalFilename?: string;
      duration?: number;
    };
  };
}

export interface AudioSamplePlayerProps {
  audioSamples: AudioSample[];
  documentId?: string;
  documentType?: string;
}
