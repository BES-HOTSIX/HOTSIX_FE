"use client";

import { Avatar, Spacer } from "@nextui-org/react";
import { FaArrowRight, FaUserCircle } from "react-icons/fa";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function LeftBar(props) {
  const { user } = useUser();
  const router = useRouter();

  if (user && user.objData.role === null) {
    toast.info("호스트 혹은 게스트 선택 후 이용해주세요🏡🧳");
    router.push("/auth/signup/role");
  } // 역할 설정 안했을 시, 역할 설정 페이지로 이동

  const pathName = usePathname();

  const items = [
    { text: "예약 내역", link: "/mypage/reservations" },
    { text: "내 정보", link: "/mypage/info" },
    { text: "결제 내역", link: "/mypage/cashLog" },
    { text: "내가 등록한 숙소", link: "/mypage/hotels" },
    { text: "내가 찜한 숙소", link: "/mypage/like" },
    { text: "나의 리뷰", link: "/mypage/reviews" },
    { text: "나의 문의내역", link: "/mypage/chats" },
  ];

  return (
    <div className="flex flex-col items-center w-1/4 bg-[#CECECE]">
      <Spacer y={5} />
      <div className={"text-2xl"}>마이페이지</div>
      <Spacer y={5} />
      {props.user?.objData.imageUrl ? (
        <Avatar src={props.user.objData.imageUrl} className={"w-44 h-44"} />
      ) : (
        <FaUserCircle size={100} />
      )}
      <Spacer y={5} />
      <div className={"text-2xl"}>{props.user?.objData.nickname}</div>
      <Spacer y={10} />
      <ul className={"flex flex-col w-full"}>
        {items
          .filter((item) =>
            user?.objData.role === "HOST"
              ? item.text === "내 정보" || item.text === "내가 등록한 숙소"
              : item.text !== "내가 등록한 숙소"
          )
          .map((item, index) => (
            <Link href={item.link} key={`l-${index}`}>
              <li
                className={`w-full h-15 p-5 flex items-center  ${
                  pathName === item.link
                    ? "bg-white"
                    : "hover:cursor-pointer bg-[#898989]"
                }`}
              >
                {item.text}
                {item.text === "캐시 사용 내역" && (
                  <div className={"ml-auto"}>
                    <FaArrowRight />
                  </div>
                )}
              </li>
            </Link>
          ))}
      </ul>
    </div>
  );
}
