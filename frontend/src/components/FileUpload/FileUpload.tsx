import React, { CSSProperties, RefObject, useRef } from 'react';
import { Button } from '../Button';

type FileUploadProps = {
    children: string | JSX.Element | (JSX.Element | string)[],
    style?: CSSProperties,
    onFilesSelected: (files: FileList | null) => void,
};

export const FileUpload = (props: FileUploadProps) => {
    const fileUploaderRef = useRef<HTMLInputElement>(null);

    return (
        <div>
            <input
                type='file'
                ref={fileUploaderRef}
                style={{display: 'none'}}
                onChange={e => props.onFilesSelected(e.target.files)} />
            <Button
                style={props.style}
                onClick={openFileUploader.bind(undefined, fileUploaderRef)}
            >{ props.children }</Button>
        </div>
    );
};

const openFileUploader = (fileUploaderRef: RefObject<HTMLInputElement>) => {
    const fileUploader = fileUploaderRef.current;
    if (fileUploader === null) {
        return;
    }

    fileUploader.click();
};