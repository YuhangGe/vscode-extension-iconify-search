import { createContext } from 'react';
import type { WebviewInitData } from '../common';

export const InitDataContext = createContext<WebviewInitData | undefined>(undefined);
