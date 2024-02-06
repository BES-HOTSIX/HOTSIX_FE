'use client'

import {
  useReservationForPay,
  useReserveForCashPayment,
} from '@/hooks/useCashLog'
import {
  Button,
  Card,
  CardBody,
  Checkbox,
  Image,
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

export default function Pay({ fail, reserveId }) {
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
  console.log(isToasted)

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
    if (reservation) setPrice(reservation.objData.paidPrice)
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
  const usableCash = paidPrice < restCash ? paidPrice : restCash

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

    // 사용하는 캐시가 price와 같을 경우 포인트 결제
    if (price == 0) submitReservation(reserveId)

    if (price != 0) onOpen()
  }

  const goTossPayments = async () => {
    const paymentWidget = paymentWidgetRef.current

    try {
      await paymentWidget?.requestPayment({
        orderId: nanoid(),
        orderName: `${reservationData.hotelNickname}`,
        customerEmail: `hagd0520@gmail.com`, // TODO Member 값에 이메일도 있다면 여기에 입력해주자
        customerName: `${reservationData.buyerName}`,
        successUrl: `${window.location.origin}/cashLog/payByToss/success/${reserveId}`,
        failUrl: `${window.location.origin}/cashLog/payByCash/${reserveId}`,
        _skipAuth: 'FORCE_SUCCESS',
        // _skipAuth: "FORCE_FAIL", // TODO 테스트용 설정
      })
    } catch (error) {}
  }

  // goPay에서 만약 submitReservation이 호출될 경우 결제 확인 페이지로 이동
  if (cashLogConfirm) {
    const cashLogId = cashLogConfirm.data.objData.cashLogId

    router.push(`/cashLog/${cashLogId}/confirm`)
  }

  const goBack = async () => {
    router.back()
  }

  const cashHandler = (e) => {
    const newCash = e.target.value

    if (!isNaN(newCash) && newCash != '00') setPayWithCash(newCash)
    if (newCash >= usableCash) {
      setPayWithCash(usableCash)
      setIsChecked(true)
    }
    if (newCash < usableCash) setIsChecked(false)

    setPrice(paidPrice - newCash)
  }
  console.log(`--------------------${price}`)

  if (!isToasted && fail.message) {
    toast.error(`토스페이먼츠 결제에 실패하였습니다. 사유 : ${fail.message}`)
    setIsToasted(true)
  }

  console.log(reservation)

  // 토스페이먼트

  return (
    <div>
      <div className='mt-32'>
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
                      <p className='text-large mt-1'>할인 금액 : 0원</p>
                      <p className='text-large mt-1'>
                        결제 금액 : {reservationData.paidPrice}원
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
          <span className='w-1/4'>{`보유 포인트 : ${reservationData.buyerRestCash}원`}</span>
          <div className='w-96'>
            <div className='flex justify-between'>
              <div>포인트 사용</div>
              <label htmlFor='coupon-box'>
                <Checkbox
                  isSelected={isChecked}
                  onChange={(event) => {
                    if (event.target.checked) {
                      setPreviousPayWithCash(payWithCash)
                      setPayWithCash(usableCash)
                      setPrice(paidPrice - usableCash)
                      setIsChecked(true)
                    }
                    if (!event.target.checked) {
                      setPayWithCash(previousPayWithCash)
                      setPrice(paidPrice - previousPayWithCash)
                      setIsChecked(false)
                    }
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
