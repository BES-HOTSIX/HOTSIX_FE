import { atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'

// 클라이언트 측에서만 sessionStorage를 사용합니다.
const isClient = typeof window !== 'undefined'

// RecoilPersist 설정
const { persistAtom } = recoilPersist({
  key: 'reserveState', // 고유한 key 값
  storage: isClient ? sessionStorage : undefined, // 서버 사이드에서는 undefined
})

export const reserveIdState = atom({
  key: 'reserveIdState', // 고유한 키
  default: '', // 기본값
  effects_UNSTABLE: [persistAtom], // 상태 영속화
});