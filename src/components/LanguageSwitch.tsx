import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"



const LanguageSwitch = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="p-1 rounded-full text-white bg-light-mode-100 dark:bg-dark-100 shadow-inner shadow-light-100/10">
                <img src="portuguese.png" alt="portuguese flag" className="w-8 h-8 cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Language</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Português</DropdownMenuItem>
                <DropdownMenuItem>English</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default LanguageSwitch