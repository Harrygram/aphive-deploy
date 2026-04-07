// components/TimeAgo.tsx
'use client';

import ReactTimeAgo from 'react-timeago';

export default function TimeAgo({ date }: { date: Date }) {
  return <ReactTimeAgo date={date} />;
}
