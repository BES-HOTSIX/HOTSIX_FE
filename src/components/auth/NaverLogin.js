'use client'

import React, { useEffect, useRef } from 'react'

export default function NaverLogin() {
  const naverRef = useRef(null)
  const naverLogin = useRef(null)

  useEffect(() => {
    const naverScript = document.createElement('script')
    naverScript.src =
      'https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js'
    naverScript.type = 'text/javascript'
    document.head.appendChild(naverScript)

    naverScript.onload = () => {
      naverLogin.current = new window.naver.LoginWithNaverId({
        clientId: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID,
        callbackUrl: process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI,
        callbackHandle: true,
        isPopup: false,
        loginButton: { color: 'green', type: 3, height: 55 },
      })
      naverLogin.current.init()
    }
  }, [])

  const handleNaverLoginBtn = (e) => {
    e.preventDefault()

    console.log('로그인 버튼 내부')

    if (naverLogin.current) {
      naverLogin.current.getLoginStatus((status) => {
        if (!status) {
          const state = generateRandomString()
          window.location.href =
            'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' +
            process.env.NEXT_PUBLIC_NAVER_CLIENT_ID +
            '&redirect_uri=' +
            encodeURIComponent(process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI) +
            '&state=' +
            state
        }
      })
    }
  }

  const generateRandomString = () => {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    const charactersLength = characters.length
    for (let i = 0; i < 16; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
  }

  return (
    <>
      <div ref={naverRef} id='naverIdLogin'></div>
      <button onClick={handleNaverLoginBtn}>
        <img
          className='ml-4 w-[300px] h-12'
          src='https://static.nid.naver.com/oauth/big_g.PNG?version=js-2.0.1'
          alt='naver'
        />
      </button>
    </>
  )
}
