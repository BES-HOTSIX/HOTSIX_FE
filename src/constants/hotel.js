import {
  MdAcUnit,
  MdDeck,
  MdFitnessCenter,
  MdFreeBreakfast,
  MdKitchen,
  MdLocalLaundryService,
  MdLocalParking,
  MdOutdoorGrill,
  MdPool,
  MdTv,
  MdWifi,
} from 'react-icons/md'
import React from 'react'
import {
  FaBuilding,
  FaCampground,
  FaCaravan,
  FaHome,
  FaHotel,
  FaHouseUser,
  FaShippingFast,
  FaTree,
} from 'react-icons/fa'

export const amenitiesOptions = [
  { type: 'WiFi', icon: <MdWifi /> },
  { type: 'TV', icon: <MdTv /> },
  { type: '주방', icon: <MdKitchen /> },
  { type: '건물 내 무료 주차', icon: <MdLocalParking /> },
  { type: '건물 내 유료 주차', icon: <MdLocalParking /> },
  { type: '세탁기', icon: <MdLocalLaundryService /> },
  { type: '에어컨', icon: <MdAcUnit /> },
  { type: '주차장', icon: <MdLocalParking /> },
  { type: '헬스장', icon: <MdFitnessCenter /> },
  { type: '수영장', icon: <MdPool /> },
  { type: '조식 제공', icon: <MdFreeBreakfast /> },
  { type: '바베큐 그릴', icon: <MdOutdoorGrill /> },
  { type: '야외 식사 공간', icon: <MdDeck /> },
]

export function formatPrice(price) {
  return price?.toLocaleString('ko-KR')
}

export function getIconForType(type) {
  switch (type) {
    case '주택':
      return <FaHome />
    case '아파트':
      return <FaBuilding />
    case '캠핑카':
      return <FaCaravan />
    case '호텔':
      return <FaHotel />
    case '텐트':
      return <FaCampground />
    case '통나무집':
      return <FaTree />
    case '게스트용 별채':
      return <FaHouseUser />
    case '컨테이너 하우스':
      return <FaShippingFast />
    default:
      return null
  }
}
