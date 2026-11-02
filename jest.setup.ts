import { Platform, UIManager, Animated } from 'react-native';

interface MockAnimatedTarget {
  setValue?: (val: number) => void;
}

interface MockTimingConfig {
  toValue?: number;
}

// Mock determinista de Animated para evitar ciclos de timers y callbacks fuera de tests
Object.defineProperty(Animated, 'loop', {
  configurable: true,
  writable: true,
  value: () => ({
    start: jest.fn(),
    stop: jest.fn(),
    reset: jest.fn(),
  }),
});

Object.defineProperty(Animated, 'timing', {
  configurable: true,
  writable: true,
  value: (value: MockAnimatedTarget, config: MockTimingConfig) => ({
    start: (callback?: (result: { finished: boolean }) => void) => {
      if (value && typeof value.setValue === 'function') {
        value.setValue(typeof config?.toValue === 'number' ? config.toValue : 0);
      }
      callback?.({ finished: true });
    },
    stop: jest.fn(),
    reset: jest.fn(),
  }),
});

Object.defineProperty(Animated, 'spring', {
  configurable: true,
  writable: true,
  value: (value: MockAnimatedTarget, config: MockTimingConfig) => ({
    start: (callback?: (result: { finished: boolean }) => void) => {
      if (value && typeof value.setValue === 'function') {
        value.setValue(typeof config?.toValue === 'number' ? config.toValue : 0);
      }
      callback?.({ finished: true });
    },
    stop: jest.fn(),
    reset: jest.fn(),
  }),
});

// Asegurar entorno Android nativo real durante las pruebas de componentes RNTL
Object.defineProperty(Platform, 'OS', {
  get: () => 'android',
  configurable: true,
});

if (typeof UIManager.setLayoutAnimationEnabledExperimental !== 'function') {
  UIManager.setLayoutAnimationEnabledExperimental = jest.fn();
}

Object.defineProperty(Animated, 'sequence', {
  configurable: true,
  writable: true,
  value: (_animations: unknown[]) => ({
    start: (callback?: (result: { finished: boolean }) => void) => {
      callback?.({ finished: true });
    },
    stop: jest.fn(),
    reset: jest.fn(),
  }),
});

// Carga ansiosa de todos los getters perezosos para evitar requires dinámicos fuera del scope de pruebas en Jest 30
const recordGlobal = globalThis as unknown as Record<string, unknown>;
for (const key of Object.getOwnPropertyNames(recordGlobal)) {
  try {
    void recordGlobal[key];
  } catch {}
}

// Mock de iconos nativos @expo/vector-icons para evitar carga asíncrona de fuentes .ttf en Jest
jest.mock('@expo/vector-icons', () => {
  const ReactMock = require('react');
  const { Text } = require('react-native');
  const MockIcon = ({ name, testID }: { name: string; testID?: string }) =>
    ReactMock.createElement(Text, { testID: testID ?? `icon-${name}` }, name);
  return {
    Ionicons: Object.assign(MockIcon, { glyphMap: {} }),
    MaterialIcons: Object.assign(MockIcon, { glyphMap: {} }),
    FontAwesome: Object.assign(MockIcon, { glyphMap: {} }),
  };
});

// Mock de fuentes Google para carga síncrona en árbol nativo
jest.mock('@expo-google-fonts/baloo-2', () => ({
  useFonts: () => [true, null],
  Baloo2_400Regular: 'Baloo2_400Regular',
  Baloo2_500Medium: 'Baloo2_500Medium',
  Baloo2_600SemiBold: 'Baloo2_600SemiBold',
  Baloo2_700Bold: 'Baloo2_700Bold',
}));

jest.mock('@expo-google-fonts/nunito', () => ({
  useFonts: () => [true, null],
  Nunito_300Light: 'Nunito_300Light',
  Nunito_400Regular: 'Nunito_400Regular',
  Nunito_600SemiBold: 'Nunito_600SemiBold',
  Nunito_700Bold: 'Nunito_700Bold',
}));

// Mock de SafeAreaContext simulando insets reales de un dispositivo Android con barra de 3 botones (48dp bottom, 24dp top)
jest.mock('react-native-safe-area-context', () => {
  const ReactMock = require('react');
  const { View } = require('react-native');
  const androidInsets = { top: 24, right: 0, bottom: 48, left: 0 };
  const androidFrame = { x: 0, y: 0, width: 360, height: 780 };
  return {
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) =>
      ReactMock.createElement(View, null, children),
    SafeAreaView: ({ children, style }: { children: React.ReactNode; style?: unknown }) =>
      ReactMock.createElement(View, { style }, children),
    useSafeAreaInsets: () => androidInsets,
    useSafeAreaFrame: () => androidFrame,
  };
});

// Mock de AsyncStorage en memoria
const mockStorage = new Map<string, string>();
jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(async (key: string) => mockStorage.get(key) ?? null),
    setItem: jest.fn(async (key: string, value: string) => {
      mockStorage.set(key, value);
    }),
    removeItem: jest.fn(async (key: string) => {
      mockStorage.delete(key);
    }),
    clear: jest.fn(async () => {
      mockStorage.clear();
    }),
  },
}));

// Mock de useWindowDimensions para Android
jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  default: () => ({ width: 360, height: 780, scale: 2, fontScale: 1 }),
}));

// Mock de expo-router
export const mockRouterPush = jest.fn();
export const mockRouterReplace = jest.fn();
export const mockRouterBack = jest.fn();

jest.mock('expo-router', () => {
  const ReactMock = require('react');
  return {
    router: {
      push: mockRouterPush,
      replace: mockRouterReplace,
      back: mockRouterBack,
    },
    useRouter: () => ({
      push: mockRouterPush,
      replace: mockRouterReplace,
      back: mockRouterBack,
    }),
    useLocalSearchParams: jest.fn(() => ({})),
    useFocusEffect: (cb: () => void) => {
      ReactMock.useEffect(() => {
        cb();
      }, []);
    },
  };
});
