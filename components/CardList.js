import Link from 'next/link'

function CustomizeLink(props) {
  return (
    <Link href="/p/[id]" as={`/p/${props.id}`}>
      <a>
        {props.id}-{props.name}
      </a>
    </Link>
  )
}

const linkColor = 'cyan'

export default function CardList(props) {
  return (
    <div className="container">
      <CustomizeLink {...props} />
      <style jsx global>
        {`
          a {
            color: ${linkColor};
            text-decoration: underline;
            font-size: 20px;
          }
          .container {
            padding: 10px;
            border: 1px solid #ff8200;
          }
        `}
      </style>
    </div>
  )
}
