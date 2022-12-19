interface IHomeProps {
  count: number
}

export default function Home(props: IHomeProps) {
  return (
    <h1>Contagem: {props.count}</h1>
  )
}

export async function getServerSideProps() {
  const response = await fetch("http://localhost:3333/pools/count")
  const data = await response.json()

  return {
    props: {
      count: data.count
    }
  }
}