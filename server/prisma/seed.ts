import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Example User",
      email: "example@email.com",
      googleId: "123456789",
      avatarUrl: "https://github.com/GuilhermeFontana.png",
    },
  });

  const poll = await prisma.poll.create({
    data: {
      title: "Example Poll",
      code: "BOL123",
      ownerId: user.id,

      participants: {
        create: {
          userId: user.id,
        },
      },
    },
  });

  await prisma.game.create({
    data: {
      date: "2022-12-19T16:00:00.695Z",
      firstTeamCountryCode: "BR",
      secondTeamCountryCode: "US",
    },
  });
  await prisma.game.create({
    data: {
      date: "2022-12-15T12:00:00.695Z",
      firstTeamCountryCode: "DE",
      secondTeamCountryCode: "AR",

      guesses: {
        create: {
          firstTeamPoint: 3,
          SecondTeamPoint: 1,

          participant: {
            connect: {
              userId_pollId: {
                userId: user.id,
                pollId: poll.id,
              },
            },
          },
        },
      },
    },
  });
}

main();
