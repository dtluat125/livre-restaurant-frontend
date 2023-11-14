export enum GenderValue {
    male = 'male',
    female = 'female',
    other = 'other',
}
export enum UserGender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
}
export const GenderArray = ['male', 'female', 'other'];

export const PositionArray = ['developer', 'tester', 'admin', 'accounting'];

export const GenderOptions = [
    {
        label: 'auth.profile.gender.male',
        value: UserGender.MALE,
    },
    {
        label: 'auth.profile.gender.female',
        value: UserGender.FEMALE,
    },
    {
        label: 'auth.profile.gender.other',
        value: UserGender.OTHER,
    },
];
