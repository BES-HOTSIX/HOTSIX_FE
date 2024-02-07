'use client'

import React from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  getKeyValue,
  card,
  Card,
  CardBody,
} from '@nextui-org/react'
import { useMyCashLog } from '@/hooks/useCashLog'

export default function CashLogMe() {
  const [page, setPage] = React.useState(1)
  const { myCashLog, isLoading, isError, error } = useMyCashLog(page - 1)

  if (isLoading) return <div></div>

  if (!myCashLog) return <div>잘못된 접근입니다</div>

  console.log(myCashLog)

  const cashLogsData = myCashLog.objData

  const restCash = myCashLog.objData.restCash

  const { content: cashLogPage, totalPages } = cashLogsData.cashLogConfirmPage

  console.log(cashLogPage)

  cashLogPage.map((e) => {
    e.createdAt = new Date(e.createdAt)
      .toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
      .replace(/\./g, '')
      .split(' ')
      .join('.')
  })

  return (
    <div className='mt-32 min-h-screen'>
      <div className='flex justify-between mb-5 items-center'>
        <p className='text-4xl ml-10'>결제 내역</p>
        <Card className='py-4 w-2/4 right-0 top-0'>
          <CardBody className='overflow-visible py-2'>
            <p className='text-2xl'>보유 캐시 : {restCash}</p>
          </CardBody>
        </Card>
      </div>
      <Table
        aria-label='Example table with client side pagination'
        bottomContent={
          <div className='flex w-full justify-center'>
            <Pagination
              isCompact
              showControls
              showShadow
              color='secondary'
              page={page}
              total={totalPages}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
        classNames={{
          wrapper: 'min-h-[222px]',
        }}>
        <TableHeader>
          <TableColumn key='createdAt'>날짜</TableColumn>
          <TableColumn key='cashLogId'>식별번호</TableColumn>
          <TableColumn key='eventType'>카테고리</TableColumn>
          <TableColumn key='price'>금액</TableColumn>
        </TableHeader>
        <TableBody items={cashLogPage}>
          {(cashLog) => (
            <TableRow key={cashLog.cashLogId}>
              {(columnKey) => (
                <TableCell>{getKeyValue(cashLog, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
