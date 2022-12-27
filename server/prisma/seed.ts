import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      {
        name: "Example User",
        email: "example@email.com",
        googleId: "1234567890",
        avatarUrl: "https://github.com/GuilhermeFontana.png",
      },
      {
        name: "Dalton Menezes",
        email: "daltonmenezes@rocketseat.com",
        googleId: "1234567891",
        avatarUrl: "https://github.com/daltonmenezes.png",
      },
      {
        name: "Diego Fernandes",
        email: "diego3g@rocketseat.com",
        googleId: "1234567892",
        avatarUrl: "https://github.com/diego3g.png",
      },
      {
        name: "Elias Gabriel",
        email: "EliasGcf@rocketseat.com",
        googleId: "1234567893",
        avatarUrl: "https://github.com/EliasGcf.png",
      },
      {
        name: "Guilherme Capitão",
        email: "guilhermecapitao@rocketseat.com",
        googleId: "1234567894",
        avatarUrl: "https://github.com/guilhermecapitao.png",
      },
      {
        name: "Jakeliny",
        email: "jakeliny@rocketseat.com",
        googleId: "1234567895",
        avatarUrl: "https://github.com/jakeliny.png",
      },
      {
        name: "Joseph Oliveira",
        email: "josepholiveira@rocketseat.com",
        googleId: "1234567896",
        avatarUrl: "https://github.com/josepholiveira.png",
      },
    ],
    skipDuplicates: true,
  });
  const users = await prisma.user.findMany();

  await prisma.poll.createMany({
    data: [
      {
        title: "Bolão do Trabalho",
        code: `TRA${getRandom(100, 999)}`,
        ownerId: users[getRandom(0, 6)].id,
      },
      {
        title: "Bolão dos Amigos",
        code: `AMI${getRandom(100, 999)}`,
        ownerId: users[getRandom(0, 6)].id,
      },
      {
        title: "Bolão da Faculdade",
        code: `FAC${getRandom(100, 999)}`,
        ownerId: users[getRandom(0, 6)].id,
      },
      {
        title: "Bolão da Família",
        code: `FAM${getRandom(100, 999)}`,
        ownerId: users[getRandom(0, 6)].id,
      },
    ],
  });
  const polls = await prisma.poll.findMany();

  polls.forEach(async (poll) => {
    const users = await prisma.user.findMany({
      where: {
        NOT: [
          {
            id: poll.ownerId || "",
          },
        ],
      },
      take: getRandom(1, 6),
    });

    if (poll.ownerId)
      await prisma.participant.create({
        data: {
          pollId: poll.id,
          userId: poll.ownerId,
        },
      });

    users.forEach(async (user) => {
      await prisma.participant.create({
        data: {
          pollId: poll.id,
          userId: user.id,
        },
      });
    });
  });

  await prisma.game.createMany({
    data: [
      {
        date: "2022-12-09T12:00:00.695Z",
        firstTeamCountryCode: "NL",
        secondTeamCountryCode: "AR",
      },
      {
        date: "2022-12-09T16:00:00.695Z",
        firstTeamCountryCode: "US",
        secondTeamCountryCode: "FR",
      },
      {
        date: "2022-12-10T12:00:00.695Z",
        firstTeamCountryCode: "DE",
        secondTeamCountryCode: "BR",
      },
      {
        date: "2022-12-10T16:00:00.695Z",
        firstTeamCountryCode: "HR",
        secondTeamCountryCode: "PT",
      },
      {
        date: "2022-12-13T16:00:00.695Z",
        firstTeamCountryCode: "AR",
        secondTeamCountryCode: "FR",
      },
      {
        date: "2022-12-14T16:00:00.695Z",
        firstTeamCountryCode: "BR",
        secondTeamCountryCode: "PT",
      },
      {
        date: "2022-12-17T16:00:00.695Z",
        firstTeamCountryCode: "FR",
        secondTeamCountryCode: "PT",
      },
      {
        date: "2022-12-18T16:00:00.695Z",
        firstTeamCountryCode: "AR",
        secondTeamCountryCode: "BR",
      },
    ],
  });
}

function getRandom(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

main();
