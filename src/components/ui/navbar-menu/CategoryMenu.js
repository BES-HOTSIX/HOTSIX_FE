import Link from 'next/link'
import {navDefaultMenus} from '@/constants/navbar'
import {useUser} from '@/hooks/useUser'

export default function CategoryMenu({setIsMenuOpen}) {
    const {user, isLoading, isError} = useUser()

    if (isLoading) return <div></div>

    return (
        <>
            {navDefaultMenus.map((category) => (
                <li
                    key={category.id}
                    className='px-1 hover:text-coral-400'
                    onClick={() =>
                        typeof setIsMenuOpen === 'function' && setIsMenuOpen(false)
                    }>
                    <Link href={category.link}>{category.title}</Link>
                </li>
            ))}
            {user && (
                <li className='px-1 hover:text-coral-400'>
                    <Link href='/mypage/info'>마이페이지</Link>
                </li>
            )}
        </>
    )
}
