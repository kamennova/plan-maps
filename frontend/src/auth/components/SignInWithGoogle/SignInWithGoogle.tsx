import React, { CSSProperties, useEffect, useState } from 'react';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

type SignInWithGoogleProps = {
    style?: CSSProperties,
    onAuthDone: (accessToken: string) => void,
};

export const SignInWithGoogle = (props: SignInWithGoogleProps) => {
    const [ isHover, updateIsHover ] = useState(false);

    const updateAuthStatus = (googleAuth: gapi.auth2.GoogleAuth) => {
        const user = googleAuth.currentUser.get();
        if (user.hasGrantedScopes('https://www.googleapis.com/auth/userinfo.email')) {
            props.onAuthDone(user.getAuthResponse().access_token);
        }
    };

    useEffect(() => {
        loadGapi().then(() => {
            const googleAuth = gapi.auth2.getAuthInstance();
            googleAuth.isSignedIn.listen(updateAuthStatus.bind(undefined, googleAuth));
            updateAuthStatus(googleAuth);
        });
    }, []);

    return (
        <img
            src={require('./google_signin.png')}
            alt='Sign in with Google'
            style={{ ...props.style, cursor: isHover ? 'pointer' : undefined }}
            onMouseEnter={updateIsHover.bind(undefined, true)}
            onMouseLeave={updateIsHover.bind(undefined, false)}
            onClick={ () => gapi.auth2.getAuthInstance().signIn() }/>
    );
};

function initGapi(): Promise<void> {
    return gapi.client.init({
        clientId: GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/userinfo.email'
    }).then(() => {});
}

export const loadGapi = () => new Promise<void>((resolve, _) => {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.async = true;
    document.body.appendChild(script);
    script.onload = () => gapi.load('client:auth2', () => initGapi().then(resolve));
});