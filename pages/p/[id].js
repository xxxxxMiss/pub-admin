import { useRouter } from 'next/router'
export default function CardPage() {
  const router = useRouter()
  return <div>{router.query.id}</div>
}
