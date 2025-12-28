import { DayData } from '../types';

const STORAGE_KEY = 'diary_day_data';

export const saveDayData = (data: DayData): void => {
  try {
    const allData = getAllDayData();
    const dateKey = new Date(data.date).toISOString().split('T')[0];
    allData[dateKey] = data;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
  } catch (error) {
    console.error('Error saving day data:', error);
  }
};

export const getDayData = (date: Date): DayData | undefined => {
  try {
    const allData = getAllDayData();
    const dateKey = date.toISOString().split('T')[0];
    return allData[dateKey];
  } catch (error) {
    console.error('Error getting day data:', error);
    return undefined;
  }
};

export const getAllDayData = (): Record<string, DayData> => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error getting all day data:', error);
    return {};
  }
};

export const deleteDayData = (date: Date): void => {
  try {
    const allData = getAllDayData();
    const dateKey = date.toISOString().split('T')[0];
    delete allData[dateKey];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
  } catch (error) {
    console.error('Error deleting day data:', error);
  }
};
