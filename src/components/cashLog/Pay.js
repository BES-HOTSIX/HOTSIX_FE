'use client'

import {
  Button,
  Card,
  CardBody,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react'
import { loadPaymentWidget } from '@tosspayments/payment-widget-sdk'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { CiImageOff } from 'react-icons/ci'
import { useAsync } from 'react-use'
import { nanoid } from 'nanoid'
import { toast } from 'react-toastify'
import { useSetRecoilState } from 'recoil'
import { reserveIdState } from '@/store/reservationState'
import Image from 'next/image'
import {
  useReservationForPay,
  useReserveForCashPayment,
} from '@/hooks/CashLog/usePay'
import CouponButton from '../coupon/CouponButton'
import CouponWidget from '../coupon/CouponWidget'
import { useMyCoupons } from '@/hooks/useCoupon'

export default function Pay({ fail, reserveId }) {
  const { myCoupons } = useMyCoupons()
  const paymentWidgetRef = useRef(null)
  const paymentMethodsWidgetRef = useRef(null)
  const [price, setPrice] = useState(null)
  const [payWithCash, setPayWithCash] = useState('')
  const [previousPayWithCash, setPreviousPayWithCash] = useState('')
  const [isChecked, setIsChecked] = useState(false)
  const router = useRouter()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  // 리렌더링되더라도 실패 사유는 한번만 뜨게 하기 위한 useState
  const [isToasted, setIsToasted] = useState(false)
  const [isCouponWidgetOpen, setIsCouponWidgetOpen] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState(null)
  const [discountAmount, setDiscountAmount] = useState(0)

  console.log(isToasted)
  console.log(myCoupons)

  // 쿠폰 선택 핸들러
  const handleSelectCoupon = (couponType) => {
    const coupon = myCoupons.objData.find((c) => c.couponType === couponType)
    setSelectedCoupon(coupon)

    const calculatedDiscountAmount = coupon
      ? reservationData.paidPrice * coupon.discountRate
      : 0
    setDiscountAmount(calculatedDiscountAmount)

    // 최신 payWithCash 값을 반영하기 위해 setPrice 내에서 현재 price를 기반으로 계산
    setPrice(
      (prevPrice) =>
        reservationData.paidPrice - calculatedDiscountAmount - payWithCash
    )
  }

  useEffect(() => {
    if (price < 0) {
      setPrice(0)
    }
  }, [price])

  // 쿠폰 버튼 클릭 핸들러
  const handleCouponButtonClick = () => {
    setIsCouponWidgetOpen(!isCouponWidgetOpen)
  }

  const setReserveId = useSetRecoilState(reserveIdState)

  useAsync(async () => {
    if (isOpen) {
      const paymentWidget = await loadPaymentWidget(
        process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY,
        process.env.NEXT_PUBLIC_TOSS_CUSTOMER_KEY
      )

      const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
        '#payment-widget',
        { value: price },
        { variantKey: 'DEFAULT' }
      )

      paymentWidget.renderAgreement('#agreement', { variantKey: 'AGREEMENT' })

      paymentWidgetRef.current = paymentWidget
      paymentMethodsWidgetRef.current = paymentMethodsWidget
    }
  }, [isOpen])

  // 할인이나 포인트 사용으로 가격 수정할 때 필요한 useEffect
  useEffect(() => {
    const paymentMethodsWidget = paymentMethodsWidgetRef.current

    if (paymentMethodsWidget == null) {
      return
    }

    paymentMethodsWidget.updateAmount(price)
  }, [price])

  // 토스페이먼트 외 로직
  const {
    submitReservation,
    cashLogConfirm,
    isPending: submitIsPending,
    isError: submitIsError,
    error: submitError,
  } = useReserveForCashPayment()

  const { reservation, isLoading, isError, error } =
    useReservationForPay(reserveId)

  useEffect(() => {
    if (reservation) setPrice(reservation.objData.paidPrice - discountAmount)
  }, [reservation])

  if (isLoading) {
    return <div>loading</div>
  }

  if (isError) {
    return <div>Error: {error.message}</div>
  }

  const reservationData = reservation.objData
  const paidPrice = reservationData.paidPrice
  const restCash = reservationData.buyerRestCash
  const usableCash =
    paidPrice - discountAmount < restCash
      ? paidPrice - discountAmount
      : restCash

  // createdAt 날짜 형식을 'nnnn.nn.nn' 형태로 포맷
  const formattedCreatedAt = new Date(reservationData.createdAt)
    .toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\./g, '')
    .split(' ')
    .join('.')

  // 예약 날짜 포맷 'nnnn.nn.nn ~ nnnn.nn.nn' 형태로 포맷
  const formattedCheckInDate = new Date(reservationData.checkInDate)
    .toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\./g, '')
    .split(' ')
    .join('.')
  const formattedCheckOutDate = new Date(reservationData.checkOutDate)
    .toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\./g, '')
    .split(' ')
    .join('.')

  const goPay = async (e) => {
    e.preventDefault()

    console.log(discountAmount)

    // 사용하는 캐시가 price와 같을 경우 포인트 결제
    if (price == 0)
      submitReservation({
        reserveId,
        discountAmount,
        couponType: selectedCoupon?.couponType,
      })

    if (price != 0) onOpen()
  }

  const goTossPayments = async () => {
    const paymentWidget = paymentWidgetRef.current

    // 테스트 환경에선 결제 스킵
    if (process.env.NEXT_PUBLIC_BASE_URL == 'http://localhost:8080') {
      await paymentWidget?.requestPayment({
        orderId: nanoid(),
        orderName: `${reservationData.hotelNickname}`,
        customerEmail: `${reservationData.buyerEmail}`, // TODO Member 값에 이메일도 있다면 여기에 입력해주자
        customerName: `${reservationData.buyerName}`,
        successUrl:
          `${window.location.origin}/cashLog/payByToss/success/${reserveId}?discountAmount=${discountAmount}` +
          (selectedCoupon?.couponType
            ? `&couponType=${selectedCoupon.couponType}`
            : ''),
        failUrl: `${window.location.origin}/cashLog/pay/${reserveId}`,
        // _skipAuth: 'FORCE_SUCCESS',
      })
    }

    try {
      await paymentWidget?.requestPayment({
        orderId: nanoid(),
        orderName: `${reservationData.hotelNickname}`,
        customerEmail: `${reservationData.buyerEmail}`, // TODO Member 값에 이메일도 있다면 여기에 입력해주자
        customerName: `${reservationData.buyerName}`,
        successUrl:
          `${window.location.origin}/cashLog/payByToss/success/${reserveId}?discountAmount=${discountAmount}` +
          (selectedCoupon?.couponType
            ? `&couponType=${selectedCoupon.couponType}`
            : ''),
        failUrl: `${window.location.origin}/cashLog/pay/${reserveId}?`,
      })
    } catch (error) {}
  }

  // goPay에서 만약 submitReservation이 호출될 경우 결제 확인 페이지로 이동
  if (cashLogConfirm) {
    const cashLogId = cashLogConfirm.data.objData.cashLogId

    setReserveId(null)

    router.push(`/cashLog/${cashLogId}/confirm`)
  }

  const goBack = async () => {
    router.back()
  }

  const cashHandler = (e) => {
    const newCash = e.target.value
    const finalCash = Math.min(
      isNaN(newCash) || newCash === '' ? 0 : parseInt(newCash, 10),
      usableCash
    )

    setPayWithCash(finalCash)

    // discountAmount를 고려하여 새로운 price를 계산
    setPrice(reservationData.paidPrice - discountAmount - finalCash)

    // 사용자가 수동으로 금액을 입력할 경우, '포인트 전부 사용' 체크박스 상태 업데이트
    setIsChecked(finalCash >= usableCash)
  }
  console.log(`--------------------${price}`)

  if (!isToasted && fail.message) {
    toast.error(`토스페이먼츠 결제에 실패하였습니다. 사유 : ${fail.message}`)
    setIsToasted(true)
  }

  console.log(reservation)
  console.log(reservationData.hotelPhotoUrl)

  return (
    <div>
      <div className='h-[55vh] mt-32'>
        <div className='flex justify-center mb-5' style={{ fontSize: '40px' }}>
          예약하기
        </div>
        <div className='flex justify-center mb-5'>
          <Card
            isBlurred
            className='
        border-none 
        bg-background/60 
        dark:bg-default-100/50 
        w-[810px]
        '
            shadow='sm'>
            <CardBody>
              <div className='grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center'>
                <div className='relative col-span-6 md:col-span-4'>
                  <div>
                    {reservationData.hotelPhotoUrl ? (
                      <Image
                        alt='숙소 대표 이미지'
                        className='object-cover'
                        height={200}
                        shadow='md'
                        src={reservationData.hotelPhotoUrl}
                        width={200}
                      />
                    ) : (
                      <div className='absolute w-full h-full bg-base-200 inset-0 flex flex-col justify-center items-center text-gray-500 rounded-md'>
                        <CiImageOff
                          className='object-cover'
                          height={200}
                          width={200}
                        />
                        <span>No Image</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className='flex flex-col col-span-6 md:col-span-8'>
                  <div className='flex justify-between items-start'>
                    <div className='flex flex-col gap-0'>
                      <h3 className='font-semibold text-2xl'>예약 정보</h3>
                      <p className='text-large mt-1'>
                        호텔 이름 : {reservationData.hotelNickname}
                      </p>
                      <p className='text-large mt-1'>
                        체크인 : {formattedCheckInDate}
                      </p>
                      <p className='text-large mt-1'>
                        체크아웃 : {formattedCheckOutDate}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className='flex justify-center'>
          <Card
            isBlurred
            className='
        border-none 
        bg-background/60 
        dark:bg-default-100/50 
        w-[810px]
        '
            shadow='sm'>
            <CardBody>
              <div className='grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center'>
                <div className='relative col-span-6 md:col-span-4'></div>

                <div className='flex flex-col col-span-6 md:col-span-8'>
                  <div className='flex justify-between items-start'>
                    <div className='flex flex-col gap-0'>
                      <h3 className='font-semibold text-2xl'>결제 정보</h3>
                      <p className='text-large mt-1'>
                        총 가격 : {reservationData.paidPrice}원
                      </p>
                      <p className='text-large mt-1'>
                        할인 금액 : {discountAmount}원
                      </p>
                      <p className='text-large mt-1'>
                        사용 포인트 : {payWithCash}원
                      </p>
                      <p className='text-large mt-1'>
                        결제 금액 :{' '}
                        {reservationData.paidPrice -
                          discountAmount -
                          payWithCash}
                        원
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
      <main style={{ display: 'flex', flexDirection: 'column' }}>
        <div className='flex justify-around items-center mt-4'>
          <div className='relative'>
            <CouponButton onClick={handleCouponButtonClick} />
            {isCouponWidgetOpen && (
              <div className='absolute w-full left-0'>
                <CouponWidget
                  coupons={myCoupons}
                  onSelectCoupon={handleSelectCoupon}
                  selectedCouponType={selectedCoupon?.couponType}
                />
              </div>
            )}
          </div>
          <span className='w-1/4'>{`보유 포인트 : ${reservationData.buyerRestCash}원`}</span>
          <div className='w-96'>
            <div className='flex justify-between'>
              <div>포인트 사용</div>
              <label htmlFor='coupon-box'>
                <Checkbox
                  isSelected={isChecked}
                  onChange={() => {
                    const newIsChecked = !isChecked
                    setIsChecked(newIsChecked)
                    const newCashValue = newIsChecked ? usableCash : 0
                    setPayWithCash(newCashValue)

                    // discountAmount를 고려하여 새로운 price를 계산
                    setPrice(
                      reservationData.paidPrice - discountAmount - newCashValue
                    )
                  }}
                />
                <span>포인트 전부 쓰기</span>
              </label>
            </div>
            <Input
              value={payWithCash}
              onChange={cashHandler}
              placeholder={usableCash}
              labelPlacement='outside'
              endContent={
                <div className='pointer-events-none flex items-center'>
                  <span className='text-default-400 text-small'>₩</span>
                </div>
              }
            />
          </div>
        </div>

        <div className='flex justify-center mt-5'>
          <Button onClick={goBack} className='mr-20' color='default'>
            뒤로가기
          </Button>
          <Button onClick={goPay} color='primary'>
            결제하기
          </Button>
        </div>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='xl'>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className='flex flex-col gap-1'>
                  토스페이먼츠 결제
                </ModalHeader>
                <ModalBody>
                  <div id='payment-widget' className='mt-5' />
                  <div id='agreement'></div>
                </ModalBody>
                <ModalFooter>
                  <Button variant='light' onPress={onClose}>
                    취소하기
                  </Button>
                  <Button color='primary' onPress={goTossPayments}>
                    결제하기
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </main>
    </div>
  )
}
