'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import instance from '@/config/axios-config'
import {
  getKeyValue,
  Link,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react'
import { useState } from 'react'
import axios from 'axios'
import convertToISO8601 from '@/util/convertToISO8601'
import { FiArrowRight } from 'react-icons/fi'

export default function MyHotels() {
  const [page, setPage] = useState(1)

  const hotelsQuery = useQuery({
    queryKey: ['hotels', page],
    queryFn: () =>
      instance
        .get(`api/v1/members/me/hotels?page=${page - 1}`, {
          ...axios.defaults,
          useAuth: true,
        })
        .then((res) => res.data),
    placeholderData: keepPreviousData,
  })

  const pages = hotelsQuery.data?.objData.totalPages ?? 0

  const loadingState =
    hotelsQuery.isLoading || hotelsQuery.data?.objData.length === 0
      ? 'loading'
      : 'idle'

  return (
    <div>
      <Table
        aria-label='Example table with client async pagination'
        bottomContent={
          pages > 0 ? (
            <div className='flex w-full justify-center'>
              <Pagination
                isCompact
                showControls
                showShadow
                color='primary'
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          ) : null
        }>
        <TableHeader>
          <TableColumn key='nickname'>이름</TableColumn>
          <TableColumn key='price'>가격</TableColumn>
          <TableColumn key='hotelType'>타입</TableColumn>
          <TableColumn key='createdAt'>등록일</TableColumn>
          <TableColumn key='hotelSales'>매출 현황</TableColumn>
        </TableHeader>
        <TableBody
          items={hotelsQuery.data?.objData.content ?? []}
          loadingContent={<Spinner />}
          loadingState={loadingState}>
          {(item) => (
            <TableRow key={item?.name}>
              {(columnKey) => {
                if (columnKey === 'nickname') {
                  return (
                    <TableCell>
                      <Link href={`/hotel/${item.id}`}>
                        {getKeyValue(item, columnKey)}
                      </Link>
                    </TableCell>
                  )
                } else if (columnKey === 'createdAt') {
                  return (
                    <TableCell>
                      {convertToISO8601(getKeyValue(item, columnKey))}
                    </TableCell>
                  )
                } else if (columnKey === 'hotelSales') {
                  return (
                    <TableCell>
                      <Link href={`/hotel/${item.id}/sales`}>
                        <FiArrowRight className='w-full' size={30} />
                      </Link>
                    </TableCell>
                  )
                } else {
                  return <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                }
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
