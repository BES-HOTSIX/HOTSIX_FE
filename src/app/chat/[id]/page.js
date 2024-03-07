import React from 'react'
import Chat from '@/components/chat/Chat'

export default function page({ params: { id } }) {
  return <Chat id={id} />
}
