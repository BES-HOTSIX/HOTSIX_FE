"use client";

import React, { useState } from "react";
import { useHotelDetail } from "@/hooks/useHotel";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaBed, FaHome, FaKey, FaCalendarCheck } from "react-icons/fa";
import {
  MdBathroom,
  MdFamilyRestroom,
  MdLocationOn,
  MdPerson4,
} from "react-icons/md";
import ConfirmAlert from "../ui/modal/ConfirmAlert";
import { amenitiesOptions } from "@/constants/hotel";
import { useDeleteHotel } from "@/hooks/useHotel";
import { formatPrice } from "@/constants/hotel";
import { useUser } from "@/hooks/useUser";
import LikeButton from "@/app/hotel/like/LikeButton";

export default function HotelDetail({ id }) {
  const router = useRouter();
  const handleReservationButton = (e) => {
    e.preventDefault();

    router.push(`/hotel/reserve/${id}`);
  };

  const { hotel, isHotelLoading, isFetching, isError, error } =
    useHotelDetail(id);
  const { user, isLoading } = useUser();
  const { submitDelete, isPending } = useDeleteHotel(id);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const mainImage = hotel?.imagesResponse.imageUrl[0];
  const otherImages = hotel?.imagesResponse.imageUrl.slice(1, 5);

  if (isLoading) return <div></div>;
  if (isHotelLoading) return <div></div>;

  return (
    <div className="w-full mx-auto p-4">
      <div className="flex justify-between">
        <h1 className="text-2xl mb-3 ">{hotel.nickname}</h1>
        {user?.objData.nickname === hotel.host && (
          <div className="flex justify-end items-center gap-2 h-10 text-sm">
            <Link href={`/hotel/${id}/modify`}>
              <span>수정</span>
            </Link>
            <button onClick={() => setIsConfirmOpen(true)}>
              <span>삭제</span>
            </button>
          </div>
        )}
      </div>

      <div className="border-t-2 border-gray-200 mt-4 pt-4"></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 mb-4 relative h-[600px]">
          <Image
            src={mainImage}
            alt="Main Image"
            layout="fill"
            objectFit="cover"
            className="rounded-md"
          />
          <div className="absolute top-2 left-2">
            {user && <LikeButton hotelId={id} />}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 h-[600px]">
          {" "}
          {/* Adjust height as needed */}
          {/* 작은 이미지들 */}
          {otherImages.map((image, index) => (
            <div key={index} className="relative w-full h-[295px]">
              {" "}
              {/* Adjust height as needed */}
              <Image
                src={image}
                alt={`Image ${index + 1}`}
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3">
        <div className="col-span-3 sm:col-span-2">
          <h2 className="text-xl font-semibold mb-4 mt-5">기본 정보</h2>
          <div className="w-[55vw]">
            <div className="w-[40vw]">
              <div className="border-t-2 border-gray-200 mt-4 pt-4"></div>
            </div>

            <div className="flex items-center text-lg mb-2">
              <MdPerson4 className="text-xl mr-2" />
              <p>호스트: {hotel.host}</p>
            </div>
            <div className="flex items-center text-lg mb-2">
              <MdLocationOn className="text-xl mr-2" />
              <p>
                주소: {hotel.address}, {hotel.addressDetail}
              </p>
            </div>
            <div className="flex items-center text-lg mb-2">
              <FaHome className="text-xl mr-2" />
              <p>숙소 유형: {hotel.hotelType}</p>
            </div>
            <div className="flex items-center text-lg mb-2">
              <FaKey className="text-xl mr-2" />
              <p>방 개수: {hotel.roomCnt}</p>
            </div>
            <div className="flex items-center text-lg mb-2">
              <FaBed className="text-xl mr-2" />
              <p>침대 개수: {hotel.bedCnt}</p>
            </div>
            <div className="flex items-center text-lg mb-2">
              <MdBathroom className="text-xl mr-2" />
              <p>화장실 개수: {hotel.bathroomCnt}</p>
            </div>
            <div className="flex items-center text-lg mb-2 ">
              <MdFamilyRestroom className="text-xl mr-2" />
              <p>최대 수용 인원: {hotel.maxPeople}</p>
            </div>

            <h2 className="text-xl font-semibold mb-4 mt-5">편의 시설</h2>
            <div className="w-[55vw]">
              <div className="w-[40vw]">
                <div className="border-t-2 border-gray-200 mt-4 pt-4"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {amenitiesOptions
                  .filter((amenity) => hotel.facility.includes(amenity.type))
                  .map((filteredAmenity, index) => (
                    <div key={index} className="flex items-center text-lg mb-2">
                      {filteredAmenity.icon}
                      <span className="ml-2">{filteredAmenity.type}</span>
                    </div>
                  ))}
              </div>

              <h2 className="text-xl font-semibold mb-4 mt-5">소개</h2>

              <div className="w-[55vw]">
                <div className="w-[40vw]">
                  <div className="border-t-2 border-gray-200 mt-4 pt-4"></div>
                </div>
                <div className="flex items-center text-lg mb-2">
                  <p>{hotel.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-100 rounded-lg shadow-md p-4 mt-4">
          <div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                특별한 숙소 예약하기
              </h3>
              <p className="text-gray-600 mb-4">
                이 숙소는 독특한 경험을 제공합니다. 멋진 경치와 편안한 환경을
                즐겨보세요.
              </p>
            </div>

            <div className="space-y-52 text-lg mb-4">
              <div className="mt-32">
                <span className="font-semibold">가격: </span>
                <span className="text-gray-800">
                  {formatPrice(hotel.price)}원/박
                </span>
              </div>
              <button
                onClick={handleReservationButton}
                className=" w-full px-6 py-3 bg-red-500 text-white font-semibold rounded-full shadow-lg hover:bg-red-600 transition duration-200 ease-in-out flex items-center justify-center"
              >
                <FaCalendarCheck className="mr-2" />
                예약하기
              </button>
            </div>
          </div>
        </div>
      </div>
      {isConfirmOpen && (
        <ConfirmAlert
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onSubmit={submitDelete}
        >
          삭제시 복구가 불가능합니다. <br /> 정말로 삭제하시겠어요?
        </ConfirmAlert>
      )}
    </div>
  );
}
