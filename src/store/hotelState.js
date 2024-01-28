import { atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'

// 클라이언트 측에서만 sessionStorage를 사용합니다.
const isClient = typeof window !== 'undefined'

// RecoilPersist 설정
const { persistAtom } = recoilPersist({
  key: 'hotelState', // 고유한 key 값
  storage: isClient ? sessionStorage : undefined, // 서버 사이드에서는 undefined
})

// 각 상태(atom)에 대해 persistAtom을 적용
export const filterState = atom({
  key: 'filterState',
  default: [],
  effects_UNSTABLE: [persistAtom], // 상태 영속화
})

export const hotelTypeState = atom({
  key: 'hotelTypeState',
  default: '',
  effects_UNSTABLE: [persistAtom], // 상태 영속화
})

export const hotelAddressState = atom({
  key: 'hotelAddressState',
  default: '',
  effects_UNSTABLE: [persistAtom], // 상태 영속화
})

export const hotelDetailAddressState = atom({
  key: 'hotelDetailAddressState',
  default: '',
  effects_UNSTABLE: [persistAtom], // 상태 영속화
})

export const numberOfBedroomsState = atom({
  key: 'numberOfBedroomsState',
  default: 1,
  effects_UNSTABLE: [persistAtom], // 상태 영속화
})

export const numberOfBedsState = atom({
  key: 'numberOfBedsState',
  default: 1,
  effects_UNSTABLE: [persistAtom], // 상태 영속화
})

export const numberOfBathroomsState = atom({
  key: 'numberOfBathroomsState',
  default: 1,
  effects_UNSTABLE: [persistAtom], // 상태 영속화
})

export const maximumGuestsState = atom({
  key: 'maximumGuestsState',
  default: 1,
  effects_UNSTABLE: [persistAtom], // 상태 영속화
})

export const hotelAmenitiesState = atom({
  key: 'hotelAmenitiesState',
  default: [],
  effects_UNSTABLE: [persistAtom], // 상태 영속화
})

export const hotelNameState = atom({
  key: 'hotelNameState',
  default: '',
  effects_UNSTABLE: [persistAtom], // 상태 영속화
})

export const hotelDescriptionState = atom({
  key: 'hotelDescriptionState',
  default: '',
  effects_UNSTABLE: [persistAtom], // 상태 영속화
})

export const hotelPricePerNightState = atom({
  key: 'hotelPricePerNightState',
  default: 0,
  effects_UNSTABLE: [persistAtom], // 상태 영속화
})

export const hotelImagesState = atom({
  key: 'hotelImagesState',
  default: [],
  effects_UNSTABLE: [persistAtom], // 상태 영속화
})
