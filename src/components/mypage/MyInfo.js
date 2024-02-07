'use client'
import {useUser} from "@/hooks/useUser";
import {FaUserCircle} from "react-icons/fa";
import {Avatar, Button, Spacer} from "@nextui-org/react";
import PassChange from "@/components/mypage/PassChange";
import NickNameChange from "@/components/mypage/NickNameChange";
import ImageChange from "@/components/mypage/ImageChange";

export default function MyInfo() {
    const {user, isLoading, isError} = useUser();

    if (isLoading) return <div></div>

    return <div className='flex h-screen'>
        <div className={"flex flex-col w-full"}>
            <div className={"flex gap-5 items-center"}>
                {user?.objData.imageUrl ?
                    <Avatar src={user.objData.imageUrl} className={"w-44 h-44"}/> :
                    <FaUserCircle size={100}/>
                }
                <div className={"flex flex-col"}>
                    <div>{user?.objData.username}</div>
                    <div>{user?.objData.nickname}</div>
                    <Spacer y={5}/>
                    <ImageChange/>
                </div>
            </div>
            <Spacer y={10}/>
            <div className={"flex flex-col"}>
                <div className={"w-full bg-[#D9D9D9] h-20 px-10 flex items-center border-b-black border-b-1"}>
                    <div className={"w-1/12"}>닉네임</div>
                    <Spacer x={16}/>
                    <div>{user?.objData.nickname}</div>
                    <div className={"ml-auto"}>
                        <NickNameChange/>
                    </div>
                </div>
                <div className={"w-full bg-[#D9D9D9] h-20 px-10 flex items-center border-b-black border-b-1"}>
                    <div className={"w-1/12"}>비밀번호</div>
                    <Spacer x={16}/>
                    <div className={"flex items-center"}>*************</div>
                    <div className={"ml-auto"}>
                        <PassChange/>
                    </div>
                </div>
                <div className={"w-full bg-[#D9D9D9] h-20 px-10 flex items-center "}>
                    <div className={"w-1/12"}>포인트</div>
                    <Spacer x={16}/>
                    <div className={"flex items-center"}>{user?.objData.restCash}P</div>
                    <div className={"ml-auto"}>
                        <Button className={"bg-white"} isDisabled={user?.objData.restCash === 0}>환전하기</Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
}