import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ConfigProvider } from 'antd'
import './index.scss'
import App from './App.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

/**
 * Ant Design theme mapped to the "Warm Hearth" Stitch design system.
 * All values sourced from the named color tokens in the project design system.
 */
const antTheme = {
  token: {
    // Brand
    colorPrimary:        '#E67E22',
    colorPrimaryHover:   '#f68a2f',
    colorPrimaryActive:  '#904800',

    // Backgrounds
    colorBgBase:         '#f2f7ff',  // --color-surface
    colorBgContainer:    '#ffffff',  // --color-surface-container-lowest (cards)
    colorBgLayout:       '#e8f2ff',  // --color-surface-container-low

    // Text
    colorTextBase:       '#1e3042',  // --color-on-surface
    colorTextSecondary:  '#4b5d70',  // --color-on-surface-variant

    // Border — "Ghost Border" rule: outline-variant @ 20% opacity
    colorBorder:         'rgba(156, 175, 197, 0.2)',
    colorBorderSecondary:'rgba(156, 175, 197, 0.12)',

    // Error
    colorError:          '#b02500',
    colorErrorBg:        '#fff0ee',

    // Shape
    borderRadius:        8,           // ROUND_EIGHT from Stitch
    borderRadiusLG:      16,
    borderRadiusSM:      4,

    // Typography
    fontFamily: "'Be Vietnam Pro', system-ui, sans-serif",
    fontSize:   15,
    fontSizeLG: 17,
    fontSizeSM: 13,

    // Motion
    motionDurationMid:  '0.25s',
    motionDurationSlow: '0.4s',
  },
  components: {
    Button: {
      // Primary: warm orange gradient feel
      colorPrimary:         '#E67E22',
      colorPrimaryHover:    '#f68a2f',
      colorPrimaryActive:   '#904800',
      borderRadiusSM:       9999,
      borderRadius:         9999,   // pill shape for all primary buttons
      borderRadiusLG:       9999,
      fontWeight:           600,
    },
    Input: {
      // Soft-filled inputs per design spec
      colorBgContainer:     '#c4e0ff',   // surface-container-highest
      colorBgContainerDisabled: '#e8f2ff',
      activeBg:             '#ffffff',    // surface-container-lowest on focus
      activeBorderColor:    '#E67E22',
      borderRadius:         8,
    },
    Select: {
      colorBgContainer:     '#c4e0ff',
      borderRadius:         8,
    },
    Card: {
      colorBgContainer:     '#ffffff',   // surface-container-lowest — "lifted"
      borderRadius:         16,
      boxShadow:            '0 4px 12px rgba(30, 48, 66, 0.08)',
    },
    Menu: {
      colorBgContainer:     '#f2f7ff',   // surface
      colorItemBgSelected:  '#e8f2ff',   // surface-container-low
      colorItemTextSelected:'#904800',   // primary
      itemSelectedColor:    '#904800',
      borderRadius:          8,
    },
    Layout: {
      colorBgHeader:  'rgba(242, 247, 255, 0.80)', // glass nav
      colorBgBody:    '#f2f7ff',
      colorBgSider:   '#ffffff',
    },
    Form: {
      labelColor:     '#4b5d70',   // on-surface-variant
      labelFontSize:  13,
    },
    Tag: {
      borderRadius:   9999,         // pill tags
    },
    Table: {
      colorBgContainer: '#ffffff',
      headerBg:         '#e8f2ff',  // surface-container-low
      borderRadius:      8,
    },
    Modal: {
      borderRadius:     16,
    },
    Notification: {
      borderRadius:     12,
    },
    Message: {
      borderRadius:     8,
    },
  },
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider theme={antTheme}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ConfigProvider>
  </StrictMode>,
)
