import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTranslation } from "react-i18next"
import { useEffect } from "react"

const LanguageSwitch = () => {
    const { t, i18n } = useTranslation("global");

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage) {
            i18n.changeLanguage(savedLanguage);
        }
    }, [i18n]);

    const handleChangeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('language', lang);
        window.location.reload();
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 pr-1 pl-4 rounded-full text-white bg-light-mode-100 dark:bg-dark-100 shadow-inner shadow-light-100/10 cursor-pointer">
                {
                    i18n.language === 'pt' ? "PT" : "EN"
                }
                <img
                    src={i18n.language === 'pt' ? "portuguese.png" : "english.png"}
                    alt={i18n.language === 'pt' ? "portuguese flag" : "english flag"}
                    className="w-8 h-8"
                />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-light-mode-100 dark:bg-dark-100 shadow-inner shadow-light-100/10">
                <DropdownMenuLabel>{t("languageSwitch.language")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => handleChangeLanguage("pt")}>
                    <img src="portuguese.png" alt="portuguese flag" className="w-8 h-8" />
                    Português
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => handleChangeLanguage("en")}>
                    <img src="english.png" alt="english flag" className="w-8 h-8" />
                    English
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default LanguageSwitch