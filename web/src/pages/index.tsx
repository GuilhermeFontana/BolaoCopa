import { FormEvent, useState } from "react";
import Image from "next/image";
import { api } from "../lib/axios";
import logoImg from "../assets/logo.svg";
import usersAvatarExampleImg from "../assets/users-avatar-example.png";
import appPreviewImg from "../assets/app-preview.png";
import iconCheckImg from "../assets/icon-check.svg";

interface IHomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}

export default function Home(props: IHomeProps) {
  const [poolTitle, setPoolTitle] = useState("");

  async function createPool(e: FormEvent){
    e.preventDefault();

    await api.post("/pool", {
      title: poolTitle
    })
    .then(async (res) => {
      const { code } = res.data

      await navigator.clipboard.writeText(code);
      alert(`Bolão criado com sucesso! O código foi copiado para sua área de tranferências`)
      setPoolTitle(code);
    })
    .catch((err => {
      alert("Ocorreu um erro ao criar o bolão, tente novamente!")
      console.log(err)
    }))
  }

  return (
    <div className="max-w-[1024px] h-screen mx-auto grid grid-cols-2 items-center gap-28">
      <main>
        <Image src={logoImg} alt="logo" />

        <h1 className="mt-14 text-white text-4xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={usersAvatarExampleImg} alt="" />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.userCount} </span>
            pessoas já estão usando
          </strong>
        </div>

        <form className="mt-10 flex gap-2" onSubmit={createPool}>
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
            type="text"
            placeholder="Qual o nome do seu bolão?"
            value={poolTitle}
            onChange={(e) => setPoolTitle(e.target.value)}
            required
          />
          <button
            className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold tetx-sm uppercase hover:bg-yellow-700"
            type="submit"
          >
            Criar meu bolão
          </button>
        </form>

        <p className="text-gray-300 mt-4 text-sm leading-relaxed">
          Após criar seu bolão você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 flex justify-between items-center text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="icon check" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>
          <div className="w-px h-12 bg-gray-600" />
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="icon check" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>
      <Image
        src={appPreviewImg}
        alt="Dois celulres mostrando um preview do app"
        quality={100}
      />
    </div>
  );
}

export async function getStaticProps() {
  const [poolCountResponse, guessCountResponse, userCountResponse] =
    await Promise.all([
      api.get("/pools/count"),
      api.get("/guesses/count"),
      api.get("/users/count"),
    ]);

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    },
  };
}