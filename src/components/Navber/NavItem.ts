export interface NavItem {
    label: string
    subLabel?: string
    children?: Array<NavItem>
    href?: string
}

export const NAV_ITEMS: Array<NavItem> = [
    {
        label: 'Home',
        href: '/',
    },
    {
        label: "Trade",
        href: '/trade'
    },
    {
        label: "Investor",
        href: "/investor"
    },
    {
        label: "Token Service",
        href: "/token-service"
    }
]