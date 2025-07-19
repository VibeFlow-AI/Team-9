export interface JitsiMeetConfig {
  roomName: string;
  width: string | number;
  height: string | number;
  parentNode?: HTMLElement;
  configOverwrite?: {
    prejoinPageEnabled?: boolean;
    startWithAudioMuted?: boolean;
    startWithVideoMuted?: boolean;
    enableWelcomePage?: boolean;
    enableUserRolesBasedOnToken?: boolean;
    disableModeratorIndicator?: boolean;
    startScreenSharing?: boolean;
    enableEmailInStats?: boolean;
  };
  interfaceConfigOverwrite?: {
    DISABLE_JOIN_LEAVE_NOTIFICATIONS?: boolean;
    DISABLE_PRESENCE_STATUS?: boolean;
    HIDE_INVITE_MORE_HEADER?: boolean;
    SHOW_JITSI_WATERMARK?: boolean;
    SHOW_WATERMARK_FOR_GUESTS?: boolean;
    SHOW_BRAND_WATERMARK?: boolean;
    BRAND_WATERMARK_LINK?: string;
    SHOW_POWERED_BY?: boolean;
    DISPLAY_WELCOME_PAGE_CONTENT?: boolean;
    DISPLAY_WELCOME_PAGE_TOOLBAR_ADDITIONAL_CONTENT?: boolean;
    APP_NAME?: string;
    NATIVE_APP_NAME?: string;
    PROVIDER_NAME?: string;
    LANG_DETECTION?: boolean;
    CONNECTION_INDICATOR_DISABLED?: boolean;
    VIDEO_LAYOUT_FIT?: string;
    FILM_STRIP_MAX_HEIGHT?: number;
    TILE_VIEW_MAX_COLUMNS?: number;
  };
  onApiReady?: (api: any) => void;
  userInfo?: {
    displayName?: string;
    email?: string;
  };
}

export interface JitsiMeetAPI {
  executeCommand: (command: string, ...args: any[]) => void;
  addEventListeners: (events: { [key: string]: (...args: any[]) => void }) => void;
  removeEventListeners: (events: string[]) => void;
  dispose: () => void;
  getParticipantsInfo: () => any[];
  isAudioMuted: () => Promise<boolean>;
  isVideoMuted: () => Promise<boolean>;
  invite: (people: any[]) => Promise<void>;
  captureLargeVideoScreenshot: () => Promise<string>;
  getVideoQuality: () => number;
  getAvatarURL: (participantId: string) => string;
}

declare global {
  interface Window {
    JitsiMeetExternalAPI: new (domain: string, options: JitsiMeetConfig) => JitsiMeetAPI;
  }
}

export class JitsiService {
  private static instance: JitsiService;
  private api: JitsiMeetAPI | null = null;
  private isScriptLoaded = false;

  static getInstance(): JitsiService {
    if (!JitsiService.instance) {
      JitsiService.instance = new JitsiService();
    }
    return JitsiService.instance;
  }

  async loadJitsiScript(): Promise<void> {
    if (this.isScriptLoaded) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://meet.jit.si/external_api.js';
      script.onload = () => {
        this.isScriptLoaded = true;
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  generateRoomName(sessionId: string, mentorName?: string, studentName?: string): string {
    const timestamp = Date.now();
    const cleanMentorName = mentorName?.replace(/[^a-zA-Z0-9]/g, '') || 'mentor';
    const cleanStudentName = studentName?.replace(/[^a-zA-Z0-9]/g, '') || 'student';
    return `vibeflow-${cleanMentorName}-${cleanStudentName}-${sessionId}-${timestamp}`;
  }

  async createMeeting(
    roomName: string,
    containerElement: HTMLElement,
    userDisplayName?: string,
    userEmail?: string
  ): Promise<JitsiMeetAPI> {
    await this.loadJitsiScript();

    if (this.api) {
      this.api.dispose();
    }

    const config: JitsiMeetConfig = {
      roomName,
      width: '100%',
      height: '100%',
      parentNode: containerElement,
      configOverwrite: {
        prejoinPageEnabled: false,
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        enableWelcomePage: false,
        disableModeratorIndicator: false,
        startScreenSharing: false,
        enableEmailInStats: false,
      },
      interfaceConfigOverwrite: {
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
        DISABLE_PRESENCE_STATUS: false,
        HIDE_INVITE_MORE_HEADER: true,
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_BRAND_WATERMARK: false,
        SHOW_POWERED_BY: false,
        DISPLAY_WELCOME_PAGE_CONTENT: false,
        DISPLAY_WELCOME_PAGE_TOOLBAR_ADDITIONAL_CONTENT: false,
        APP_NAME: 'VibeFlow',
        NATIVE_APP_NAME: 'VibeFlow',
        PROVIDER_NAME: 'VibeFlow',
        LANG_DETECTION: true,
        CONNECTION_INDICATOR_DISABLED: false,
        VIDEO_LAYOUT_FIT: 'nocrop',
        FILM_STRIP_MAX_HEIGHT: 120,
        TILE_VIEW_MAX_COLUMNS: 5,
      },
      userInfo: {
        displayName: userDisplayName || 'Anonymous',
        email: userEmail,
      },
    };

    this.api = new window.JitsiMeetExternalAPI('meet.jit.si', config);
    return this.api;
  }

  getCurrentAPI(): JitsiMeetAPI | null {
    return this.api;
  }

  dispose(): void {
    if (this.api) {
      this.api.dispose();
      this.api = null;
    }
  }
}

export const jitsiService = JitsiService.getInstance();
