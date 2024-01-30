import CartIcon from '@/components/ui/icon/CartIcon'
import SaleIcon from '@/components/ui/icon/SaleIcon'
import SearchSvgIcon from '@/components/ui/icon/SearchSvgIcon'
import {FiMenu} from 'react-icons/fi'

export const navMenuType = {
    dropdown: {btnClass: 'lg:hidden'},
    avatar: {btnClass: 'avatar'},
}

export const navSvgType = {
    dropdown: {
        svgClass: 'inline-block w-5 h-5 stroke-current',
        path: 'M4 6h16M4 12h16M4 18h16',
        link: '',
    },
    search: {
        svgClass: 'h-5 w-5',
        path: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
        link: '/search',
    },
    cart: {
        svgClass: 'h-5 w-5',
        path: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
        link: '/products/cart',
    },
}

export const navIconType = {
    dropdown: {
        icon: <FiMenu size={25}/>,
        link: '',
    },
    search: {
        //icon: <FiSearch size={20} />,
        icon: <SearchSvgIcon/>,
        link: '/search',
    },
    cart: {
        //icon: <FiShoppingCart size={25} />,
        icon: <CartIcon/>,
        link: '/products/cart',
    },
    write: {
        icon: <SaleIcon/>,
        link: '/products/write',
    },
}

export const navDefaultMenus = [
    {id: 1, title: '숙소', link: '/hotel'},
    {id: 2, title: '예약하기', link: '/hotel/reserve'},
    {id: 3, title: '결제하기', link: '/hotel/payment'},
]

export const navAvatarMenus = [
    {
        id: 1,
        title: '마이페이지',
        link: '/mypage/info',
    },
    {
        id: 2,
        title: '로그아웃',
        link: '',
    },
]
