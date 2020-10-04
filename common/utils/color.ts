export const colors = [
    'rgb(0, 0, 255)',
    'rgb(146, 50, 255)',
    'rgb(251, 102, 255)',
    'rgb(255, 136, 102)',
    'rgb(110, 187, 193)',
    'rgb(24, 208, 222)',
    'rgb(222, 24, 24)',
    'rgb(247, 185, 22)',
    'rgb(160, 193, 53)',
    'rgb(35, 239, 133)',
    'rgb(176, 151, 255)',
    'rgb(173, 154, 183)',
    'rgb(255, 106, 197)',
    'rgb(178, 62, 197)',
    'rgb(75, 62, 197)',
    'rgb(226, 190, 66)',
    'rgb(66, 226, 158)',
    'rgb(226, 66, 112)'
];

export const generateRandomColor = (): string => colors[Math.floor(Math.random() * colors.length)];


