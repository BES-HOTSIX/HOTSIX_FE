'use client'
import LeftBar from '@/components/mypage/LeftBar'
import {useUser} from '@/hooks/useUser'

export default function MypageLayout({children}) {
    const {user, isLoading, isError} = useUser()

    return (
        <div className={'flex h-screen'}>
            <LeftBar user={user}/>
            <div className={'w-full px-10 py-7'}>{children}</div>
        </div>
    )
}
