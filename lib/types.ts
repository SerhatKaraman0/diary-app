export interface Note {
    $id: string;
    position: string;
    colors: string;
    body: string;
}

export interface Habit {
    name: string;
    color: string;
}

export interface UserSettings {
    name: string;
    notificationTime: string;
    habits: Habit[];
    setupComplete: boolean;
} 