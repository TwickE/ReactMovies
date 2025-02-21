import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import i18next from 'i18next'
import global_en from './translation/en/global.json'
import global_pt from './translation/pt/global.json'
import { I18nextProvider } from 'react-i18next'

i18next.init({
    fallbackLng: "en",
    resources: {
        en: {
            global: global_en
        },
        pt: {
            global: global_pt
        }
    }
})

createRoot(document.getElementById('root')!).render(
    <I18nextProvider i18n={i18next}>
        <App />
    </I18nextProvider>
)
