type MenuItem = {
    title: string
    onClick?: { route: string }
    children?: MenuItem[]
}

type MenuConfigResult = {
    menu: MenuItem[]
}

export const MenuConfig = async (): Promise<MenuConfigResult> => {
    const token = localStorage.getItem('bp-tm-token')

    if (!token) {
        return { menu: [] }
    }

    return {
        menu: [
            {
                title: 'Demo',
                onClick: { route: '/demo' }
            }
        ]
    }
}
