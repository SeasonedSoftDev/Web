import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { ConfigService } from '@nestjs/config';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  // let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();

    const configService = app.get<ConfigService>(ConfigService);
    const port = configService.get('app.port');
    await app.listen(port);

    // prisma = app.get(PrismaService);
    // await prisma.cleanDb();
    // pactum.request.setBaseUrl(`http://localhost:${port}`);
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    it.todo('Done');
  });
});
