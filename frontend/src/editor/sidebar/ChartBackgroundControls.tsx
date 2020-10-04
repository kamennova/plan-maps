import React, { CSSProperties, useState } from 'react';
import { Button, FileUpload } from '../../components';
import { api_request, monitorAssetUpload, ASSETS_ENDPOINT } from '../../api';
import { UploadBackgroundResponse } from 'flowcharts-common';

type ChartBackgroundControlProps = {
    background?: string,
    onNewBackgroundSelected: (backgroundId: string | undefined) => void,
};

const btnStyle: CSSProperties = {
    display: 'block',
    margin: '10px auto',
};

export const ChartBackgroundControls = (props: ChartBackgroundControlProps) => {
    const [ uploading, setUploading ] = useState(false);

    const onFilesSelected = (files: FileList | null) => {
        if (files === null) {
            return;
        }
        setUploading(true);

        const reader = new FileReader();
        reader.onload = e => {
            api_request<UploadBackgroundResponse>('background', 'POST', e.target?.result, false)
                .then(res => {
                    if (res.backgroundId !== undefined) {
                        // It may take a while for uploaded image to propagate to gcs, so we will check every
                        // second until the image is available. Usually the image is ready immediately.
                        monitorAssetUpload('background/' + res.backgroundId, () => {
                            setUploading(false);
                            props.onNewBackgroundSelected(res.backgroundId)
                        });
                    }
                });
        };
        reader.readAsArrayBuffer(files.item(0) as Blob);
    };

    const ctl = (props.background !== undefined && props.background !== null) ? (
        <div style={{
            width: '100%',
            height: '180px',
            backgroundImage: 'url(' + ASSETS_ENDPOINT + 'background/' + props.background + ')',
            backgroundPositionX: '50%',
            backgroundPositionY: '50%',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            margin: '10px 0',
            padding: '40px'
        }}>
            <FileUpload style={btnStyle} onFilesSelected={onFilesSelected}>Change</FileUpload>
            <Button style={btnStyle} onClick={props.onNewBackgroundSelected.bind(undefined, undefined)}>Remove</Button>
        </div>
    ) : (uploading ? (
        <div style={{ marginTop: '10px' }}>Uploading...</div>
    ) : (
        <FileUpload style={{ display: 'block', marginTop: '10px' }} onFilesSelected={onFilesSelected}>Select</FileUpload>
    ));

    return (
        <section style={{ marginTop: '10px' }}>
            Background:
            { ctl }
        </section>
    );
};

