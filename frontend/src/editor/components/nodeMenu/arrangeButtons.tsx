import React from 'react';
import { ButtonDivider } from "./NodeMenuComponents";

export const arrangeButtons = (buttons: JSX.Element[]) => {
    return buttons.map(btn => [btn]).reduce((a, b) => [...a, (<ButtonDivider />), ...b]);
};
