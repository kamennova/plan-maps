export type ChartUser = {
    id: number,
    role: UserRole,
    invitedBy: number,
};

export type UserRole = 'guest' |  'owner' | 'editor';
