import React, { useEffect, useState } from 'react';
import { Spin, Alert, Button } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface JitsiMeetingProps {
    roomName: string;
    displayName: string;
    onError: (error: Error) => void;
}

export const JitsiMeeting: React.FC<JitsiMeetingProps> = ({
    roomName,
    displayName,
    onError
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [api, setApi] = useState<any>(null);

    useEffect(() => {
        let jitsiApi: any = null;

        const initJitsi = async () => {
            try {
                // Check if JitsiMeetExternalAPI is loaded
                if (!window.JitsiMeetExternalAPI) {
                    throw new Error('Jitsi Meet External API not loaded');
                }

                const domain = 'meet.jit.si';
                const options = {
                    roomName: roomName,
                    width: '100%',
                    height: '100%',
                    parentNode: document.querySelector('#jitsi-container'),
                    userInfo: {
                        displayName: displayName
                    },
                    interfaceConfigOverwrite: {
                        TOOLBAR_BUTTONS: [
                            'microphone', 'camera', 'closedcaptions', 'desktop',
                            'fullscreen', 'fodeviceselection', 'hangup', 'profile',
                            'chat', 'recording', 'livestreaming', 'etherpad',
                            'sharedvideo', 'settings', 'raisehand', 'videoquality',
                            'filmstrip', 'shortcuts', 'tileview', 'download', 'help'
                        ],
                        SHOW_JITSI_WATERMARK: false,
                        SHOW_WATERMARK_FOR_GUESTS: false,
                        DEFAULT_REMOTE_DISPLAY_NAME: 'Student',
                        TOOLBAR_ALWAYS_VISIBLE: true
                    },
                    configOverwrite: {
                        startWithAudioMuted: true,
                        startWithVideoMuted: true,
                        prejoinPageEnabled: false,
                        disableDeepLinking: true
                    }
                };

                jitsiApi = new window.JitsiMeetExternalAPI(domain, options);

                // Add event listeners
                jitsiApi.addEventListeners({
                    videoConferenceJoined: () => {
                        setIsLoading(false);
                    },
                    videoConferenceLeft: () => {
                        window.location.href = '/virtual/classes';
                    },
                    participantLeft: () => {
                        console.log('Participant left');
                    },
                    participantJoined: () => {
                        console.log('Participant joined');
                    },
                    readyToClose: () => {
                        window.location.href = '/virtual/classes';
                    }
                });

                setApi(jitsiApi);
            } catch (err: any) {
                setError(err.message);
                onError(err);
            }
        };

        initJitsi();

        return () => {
            if (jitsiApi) {
                jitsiApi.dispose();
            }
        };
    }, [roomName, displayName, onError]);

    if (error) {
        return (
            <Alert
                message="Error"
                description={`Failed to load meeting: ${error}`}
                type="error"
                action={
                    <Button type="primary" onClick={() => window.location.reload()}>
                        Retry
                    </Button>
                }
            />
        );
    }

    return (
        <div className="h-screen flex flex-col">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                </div>
            )}
            <div id="jitsi-container" className="flex-1" />
        </div>
    );
};