export const getCurrentDate = (): Date => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const today = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();
    return new Date(Date.UTC(year, month, today, hours, minutes, seconds, milliseconds));
};

export const getDate = (date: string): Date => {
    const localDate = new Date(date);

    const year = localDate.getFullYear();
    const month = localDate.getMonth();
    const day = localDate.getDate();
    const hours = localDate.getHours();
    const minutes = localDate.getMinutes();
    const seconds = localDate.getSeconds();
    const milliseconds = localDate.getMilliseconds();

    return new Date(Date.UTC(year, month, day, hours, minutes, seconds, milliseconds));
};
