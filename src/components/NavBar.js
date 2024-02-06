"use client"

import Link from "next/link"
import CategoryMenu from "./ui/navbar-menu/CategoryMenu"
import HotelIcon from "./ui/icon/HotelIcon"
import {useUser} from "@/hooks/useUser"
import {ERROR_CODE, HTTP_STATUS_CODE} from "@/constants/constants"
import axios from "@/config/axios-config"
import {FiMenu} from "react-icons/fi"
import {Avatar, Button, Dropdown as NextDropDown, DropdownItem, DropdownMenu, DropdownTrigger,} from "@nextui-org/react"

export default function Navbar() {
    const {user, isLoading, isError, error, refetch} = useUser()

    const handleLogout = async (e) => {
        e.preventDefault()

        const response = await axios
            .delete("/user/logout", {...axios.defaults, useAuth: true})
            .then((res) => {
                console.log(res)
                sessionStorage.removeItem("ACCESS_TOKEN_KEY")
                window.location.href = "/"
            })
            .catch((err) => {
                const {statusCode, code} = err ?? {}

                if (
                    statusCode === HTTP_STATUS_CODE.BAD_REQUEST &&
                    code === ERROR_CODE.EXPIRED_ACCESS_TOKEN
                ) {
                    sessionStorage.removeItem("ACCESS_TOKEN_KEY")
                    window.location.href = "/"
                }
            })
    }

    const {statusCode, code} = error ?? {}

    if (
        statusCode === HTTP_STATUS_CODE.BAD_REQUEST &&
        code === ERROR_CODE.EXPIRED_ACCESS_TOKEN
    ) {
        refetch()
    }

    return (
        <div className='font-suite navbar flex bg-transparent p-[15px]'>
            <div className='flex flex-1 gap-2'>
                <Link
                    href='/'
                    className='font-pretendard font-extrabold text-2xl flex justify-center items-center px-3 text-sage-750 dark:text-coral-500'
                >
                    HOTSHARE
                </Link>
                <div className='hidden lg:flex'>
                    <ul className='flex items-center gap-2 px-1 text-sage-700 dark:text-cream text-sm font-semibold tracking-widest'>
                        <CategoryMenu/>
                    </ul>
                </div>
            </div>
            <div className='flex-none gap-1'>
                <div className='lg:hidden flex gap-1'></div>
                <div className='hidden lg:flex flex-none gap-10 h-full items-center'>
                    <div className='flex'>
                        {user ? (
                            <div className='flex space-x-4'>
                                <p className='text-md flex items-center mr-3'>
                                    {user?.objData.nickname}님 환영합니다
                                </p>
                                <Link
                                    href='/hotel/register'
                                    className='text-sm flex items-center justify-center gap-1'
                                >
                                    <HotelIcon/>
                                    숙소등록
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className='text-sm py-3 px-4 rounded-full text-white bg-coral-400 hover:bg-coral-500'
                                >
                                    로그아웃
                                </button>
                            </div>
                        ) : (
                            <div className='space-x-3'>
                                <Link href='/auth/signin'>
                                    <button
                                        className='bg-sage-600 hover:bg-sage-650 text-white rounded-full text-sm font-semibold py-4 px-4'>
                                        로그인
                                    </button>
                                </Link>
                                <Link href='/auth/signup'>
                                    <button
                                        className='bg-sage-600 hover:bg-sage-650 text-white rounded-full text-sm font-semibold py-4 px-4'>
                                        회원가입
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
                <div className='md:flex lg:hidden mr-2'>
                    {user ? (
                        <>
                            <NextDropDown placement='bottom-end'>
                                <DropdownTrigger>
                                    <Avatar
                                        isBordered
                                        as='button'
                                        className='transition-transform'
                                        src={user?.objData.imageUrl}
                                    />
                                </DropdownTrigger>
                                <div className='md:flex lg:hidden mr-2'>
                                    <DropdownMenu aria-label='Profile Actions' variant='flat'>
                                        <DropdownItem key='profile' className='h-14 gap-2'>
                                            <p className='font-semibold'>{user.objData.nickname}</p>
                                        </DropdownItem>
                                        <DropdownItem key='hotle' href='/hotel'>
                                            전체 숙소
                                        </DropdownItem>
                                        <DropdownItem key='register' href='/hotel/register'>
                                            숙소 등록
                                        </DropdownItem>
                                        <DropdownItem key='mypage' href='/mypage/info'>
                                            마이페이지
                                        </DropdownItem>

                                        <DropdownItem
                                            onClick={handleLogout}
                                            key='logout'
                                            color='danger'
                                        >
                                            로그아웃
                                        </DropdownItem>
                                    </DropdownMenu>
                                </div>
                            </NextDropDown>
                        </>
                    ) : (
                        <>
                            <NextDropDown>
                                <DropdownTrigger>
                                    <Button
                                        size='sm'
                                        variant='light'
                                        auto
                                        startContent={<FiMenu size={24}/>}
                                    ></Button>
                                </DropdownTrigger>
                                <div className='md:flex lg:hidden mr-2'>
                                    <DropdownMenu aria-label='Static Actions'>
                                        <DropdownItem key='signin' href='/auth/signin'>
                                            로그인
                                        </DropdownItem>
                                        <DropdownItem key='signup' href='/auth/signup'>
                                            회원가입
                                        </DropdownItem>
                                        <DropdownItem key='copy' href='/hotel'>
                                            전체 숙소
                                        </DropdownItem>
                                    </DropdownMenu>
                                </div>
                            </NextDropDown>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}