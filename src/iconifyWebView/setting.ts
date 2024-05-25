import { createContext } from 'react';
import type { Setting } from '../common';

export const SettingContext = createContext<Setting>({});
