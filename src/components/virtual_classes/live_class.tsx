// components/live_class.tsx
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
declare const JitsiMeetExternalAPI: any;

export const LiveClass: React.FC = () => {
    const { classId } = useParams();

    useEffect(() => {
        const domain = 'meet.jit.si';
        const options = {
            roomName: `virtual-class-${classId}`,
            width: '100%',
            height: '100%',
            parentNode: document.querySelector('#jitsi-container'),
            interfaceConfigOverwrite: {
                TOOLBAR_BUTTONS: [
                    'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                    'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
                    'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
                    'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
                    'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
                    'security'
                ],
            },
            configOverwrite: {
                startWithAudioMuted: true,
                startWithVideoMuted: true,
                prejoinPageEnabled: false
            }
        };

        const api = new JitsiMeetExternalAPI(domain, options);

        return () => {
            api.dispose();
        };
    }, [classId]);

    return (
        <div className="h-screen">
            <div id="jitsi-container" className="h-full" />
        </div>
    );
};
